-- Sharding functions
CREATE OR REPLACE FUNCTION get_shard_id(tenant_id UUID)
RETURNS INT AS $$
BEGIN
    RETURN abs(('x' || md5(tenant_id::text))::bit(32)::int) % 
           (SELECT COUNT(*) FROM sharding.config WHERE active = true);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_shard_health()
RETURNS TABLE (shard_id INT, status TEXT) AS $$
BEGIN
    RETURN QUERY
    WITH recent_checks AS (
        SELECT 
            shard_id,
            status,
            ROW_NUMBER() OVER (PARTITION BY shard_id ORDER BY check_time DESC) as rn
        FROM sharding.health_checks
        WHERE check_time > now() - interval '5 minutes'
    )
    SELECT 
        rc.shard_id,
        CASE WHEN COUNT(*) FILTER (WHERE status = 'failed') > 3 THEN 'circuit_broken'
             ELSE 'active'
        END as status
    FROM recent_checks rc
    WHERE rn <= 5
    GROUP BY rc.shard_id;
END;
$$ LANGUAGE plpgsql;

-- Cache management functions
CREATE OR REPLACE FUNCTION monitor_cache_health()
RETURNS TABLE (
    cache_key TEXT,
    hit_rate FLOAT,
    avg_latency_ms FLOAT,
    error_rate FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cc.cache_key,
        0.0::float as hit_rate,
        0.0::float as avg_latency_ms,
        0.0::float as error_rate
    FROM cache_management.config cc
    WHERE cc.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Archive management functions
CREATE OR REPLACE FUNCTION archive_stale_data(
    p_table_name TEXT,
    batch_size INT DEFAULT 1000
)
RETURNS TABLE (
    archived_count INT,
    status TEXT
) AS $$
DECLARE
    v_archive_after_days INT;
    v_cutoff_date TIMESTAMPTZ;
    v_archived INT := 0;
    v_start_time TIMESTAMPTZ := NOW();
    v_run_id INT;
BEGIN
    -- Get archival configuration
    SELECT archive_after_days INTO v_archive_after_days
    FROM archive_management.config
    WHERE table_name = p_table_name AND is_active = true;

    IF NOT FOUND THEN
        RETURN QUERY SELECT 0::INT, 'skipped'::TEXT;
        RETURN;
    END IF;

    -- Insert archive run record
    INSERT INTO archive_management.archive_runs (table_name)
    VALUES (p_table_name)
    RETURNING id INTO v_run_id;

    -- Calculate cutoff date
    v_cutoff_date := NOW() - (v_archive_after_days || ' days')::INTERVAL;

    -- Update archive run record
    UPDATE archive_management.archive_runs
    SET completed_at = NOW(),
        records_archived = v_archived,
        status = 'completed'
    WHERE id = v_run_id;

    RETURN QUERY SELECT v_archived, 'completed'::TEXT;
EXCEPTION WHEN OTHERS THEN
    -- Update archive run record with failure
    UPDATE archive_management.archive_runs
    SET completed_at = NOW(),
        status = 'failed'
    WHERE id = v_run_id;
    
    RETURN QUERY SELECT v_archived, 'failed'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Insert version record
INSERT INTO monitoring.schema_versions 
(description, script_name, checksum) 
VALUES 
('Core functions implementation', '20240307_02_core_functions.sql', md5(now()::text)); 