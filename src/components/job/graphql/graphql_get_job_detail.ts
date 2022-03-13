import gql from 'graphql-tag';

const GET_JOB_DETAIL = gql`
query ($job_id: String!) {
  get_job_detail(job_id: $job_id) {
    id
    task_name
    arguments
    retries
    max_retry
    interval
    error
    trace_id
    retry_histories {
      status
      trace_id
      error
      start_at
      end_at
      error_stack
    }
    status
    created_at
    finished_at
    next_retry_at
  }
}
`;

export default GET_JOB_DETAIL;
