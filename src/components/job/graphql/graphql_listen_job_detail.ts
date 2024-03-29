import gql from 'graphql-tag';

const LISTEN_JOB_DETAIL = gql`
subscription ($job_id: String!, $filter: GetAllJobHistoryInputResolver) {
    listen_detail_job(job_id: $job_id, filter: $filter) {
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
        current_progress
        max_progress
        meta {
            is_close_session
            page
            total_history
            is_show_more_args
            is_show_more_error
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
}`;

export default LISTEN_JOB_DETAIL;