CREATE OR REPLACE VIEW avg_simulation_performance AS
SELECT
    org_id,
    COUNT(id) as total_simulations,
    AVG(completed_at - started_at) as avg_processing_time,
    AVG(confidence_score) as mean_confidence_index
FROM
    simulation_runs
WHERE
    status = 'completed'
    AND completed_at > NOW() - INTERVAL '7 days'
GROUP BY
    org_id;

GRANT SELECT ON avg_simulation_performance TO authenticated;