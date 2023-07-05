import gql from 'graphql-tag';

const GET_JOB_DETAIL = gql`
query ($job_id: String!, $filter: GetAllJobHistoryInputResolver) {
  get_detail_job(job_id: $job_id, filter: $filter) {
    id
    task_name
    arguments
    retries
    max_retry
    interval
    error
    result
    trace_id
    status
    created_at
    finished_at
    next_retry_at
    meta {
        is_close_session
        page
        total_history
    }
    retry_histories {
        status
        trace_id
        error
        result
        start_at
        end_at
        error_stack
    }
  }
}
`;

export default GET_JOB_DETAIL;
