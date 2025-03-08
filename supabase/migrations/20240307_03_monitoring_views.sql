-- Create monitoring views
CREATE OR REPLACE VIEW monitoring.system_health AS
WITH shard_status AS (
    SELECT * FROM check_shard_health()
),
cache_metrics AS (
    SELECT * FROM monitor_cache_health()
),
archive_status AS (
    SELECT 
        table_name,
        MAX(completed_at) as last_run,
        COUNT(*) FILTER (WHERE status = 'failed') as recent_failures
    FROM archive_management.archive_runs
    WHERE started_at > now() - interval '24 hours'
    GROUP BY table_name
)
SELECT 
    now() as check_time,
    (SELECT COUNT(*) FROM shard_status WHERE status = 'circuit_broken') as broken_shards,
    (SELECT COUNT(*) FROM cache_metrics WHERE error_rate > 0.01) as cache_errors,
    (SELECT COUNT(*) FROM archive_status WHERE recent_failures > 0) as archive_failures;

-- Create performance monitoring view
CREATE OR REPLACE VIEW monitoring.performance_metrics AS
SELECT 
    schemaname,
    relname as table_name,
    seq_scan,
    seq_tup_read,
    idx_scan,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
WHERE schemaname IN ('public', 'sharding', 'cache_management', 'archive_management');

-- Create index usage view
CREATE OR REPLACE VIEW monitoring.index_usage AS
SELECT 
    schemaname,
    tablename,
    indexrelname as index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname IN ('public', 'sharding', 'cache_management', 'archive_management');

-- Create active queries view
CREATE OR REPLACE VIEW monitoring.active_queries AS
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    xact_start,
    query_start,
    state,
    wait_event_type,
    wait_event,
    query
FROM pg_stat_activity
WHERE state != 'idle'
AND pid != pg_backend_pid();

-- Insert version record
INSERT INTO monitoring.schema_versions 
(description, script_name, checksum) 
VALUES 
('Monitoring views implementation', '20240307_03_monitoring_views.sql', md5(now()::text)); 