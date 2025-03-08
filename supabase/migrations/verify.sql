-- Verify schema creation
SELECT COUNT(*) = 4 as schemas_created
FROM information_schema.schemata
WHERE schema_name IN ('monitoring', 'sharding', 'cache_management', 'archive_management');

-- Verify table creation
SELECT COUNT(*) = 8 as tables_created
FROM information_schema.tables
WHERE table_schema IN ('monitoring', 'sharding', 'cache_management', 'archive_management')
AND table_type = 'BASE TABLE';

-- Verify function creation
SELECT COUNT(*) = 3 as functions_created
FROM information_schema.routines
WHERE routine_schema IN ('monitoring', 'sharding', 'cache_management', 'archive_management')
AND routine_type = 'FUNCTION';

-- Verify view creation
SELECT COUNT(*) = 4 as views_created
FROM information_schema.views
WHERE table_schema = 'monitoring'
AND table_name IN ('system_health', 'performance_metrics', 'index_usage', 'active_queries');

-- Verify schema versions
SELECT COUNT(*) = 3 as versions_recorded
FROM monitoring.schema_versions; 