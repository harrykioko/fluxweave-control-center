-- Drop views first
DROP VIEW IF EXISTS monitoring.active_queries;
DROP VIEW IF EXISTS monitoring.index_usage;
DROP VIEW IF EXISTS monitoring.performance_metrics;
DROP VIEW IF EXISTS monitoring.system_health;

-- Drop functions
DROP FUNCTION IF EXISTS archive_stale_data(TEXT, INT);
DROP FUNCTION IF EXISTS monitor_cache_health();
DROP FUNCTION IF EXISTS check_shard_health();
DROP FUNCTION IF EXISTS get_shard_id(UUID);

-- Drop tables
DROP TABLE IF EXISTS archive_management.archive_runs;
DROP TABLE IF EXISTS archive_management.config;
DROP TABLE IF EXISTS cache_management.invalidation_events;
DROP TABLE IF EXISTS cache_management.config;
DROP TABLE IF EXISTS sharding.health_checks;
DROP TABLE IF EXISTS sharding.config;
DROP TABLE IF EXISTS monitoring.replica_health;
DROP TABLE IF EXISTS monitoring.schema_versions;

-- Drop schemas
DROP SCHEMA IF EXISTS archive_management;
DROP SCHEMA IF EXISTS cache_management;
DROP SCHEMA IF EXISTS sharding;
DROP SCHEMA IF EXISTS monitoring; 