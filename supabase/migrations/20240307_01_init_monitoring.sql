-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create monitoring schema
CREATE SCHEMA IF NOT EXISTS monitoring;
CREATE SCHEMA IF NOT EXISTS sharding;
CREATE SCHEMA IF NOT EXISTS cache_management;
CREATE SCHEMA IF NOT EXISTS archive_management;

-- Create monitoring tables
CREATE TABLE monitoring.schema_versions (
    version_id SERIAL PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT NOT NULL,
    script_name TEXT NOT NULL,
    checksum TEXT NOT NULL,
    success BOOLEAN DEFAULT FALSE,
    rollback_script TEXT
);

CREATE TABLE monitoring.replica_health (
    check_time TIMESTAMPTZ DEFAULT NOW(),
    replica_lag_seconds INTERVAL,
    replication_state TEXT,
    alert_triggered BOOLEAN DEFAULT FALSE
);

-- Create sharding configuration
CREATE TABLE sharding.config (
    shard_id INT PRIMARY KEY,
    host TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sharding.health_checks (
    shard_id INT REFERENCES sharding.config(shard_id),
    check_time TIMESTAMPTZ DEFAULT NOW(),
    response_time_ms INT,
    status TEXT,
    CONSTRAINT valid_status CHECK (status IN ('healthy', 'degraded', 'failed'))
);

-- Create cache management tables
CREATE TABLE cache_management.config (
    cache_key TEXT PRIMARY KEY,
    ttl_seconds INT NOT NULL,
    last_refresh TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE cache_management.invalidation_events (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    invalidated_at TIMESTAMPTZ DEFAULT NOW(),
    processed BOOLEAN DEFAULT false
);

-- Create archive management tables
CREATE TABLE archive_management.config (
    table_name TEXT PRIMARY KEY,
    archive_after_days INT NOT NULL,
    last_archive_run TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE archive_management.archive_runs (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    records_archived INT,
    status TEXT DEFAULT 'running',
    CONSTRAINT valid_status CHECK (status IN ('running', 'completed', 'failed'))
);

-- Insert initial configuration
INSERT INTO monitoring.schema_versions 
(description, script_name, checksum) 
VALUES 
('Initial monitoring schema setup', '20240307_01_init_monitoring.sql', md5(now()::text)); 