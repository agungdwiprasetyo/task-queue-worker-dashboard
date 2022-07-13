import gql from 'graphql-tag';

const LISTEN_JOB_DETAIL = gql`
subscription ($job_id: String!) {
    listen_detail_job(job_id: $job_id) {
        is_close_session
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
}`;

export default LISTEN_JOB_DETAIL;