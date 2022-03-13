import gql from 'graphql-tag';

const LISTEN_JOB_LIST = gql`
subscription ($task_name: String!, $page: Int!, $limit: Int!, $search: String, $status: [String!]!, 
    $start_date: String, $end_date: String, $job_id: String) {
    listen_task_job_list(
        task_name: $task_name, 
        page: $page, 
        limit: $limit, 
        search: $search, 
        status: $status, 
        start_date: $start_date, 
        end_date: $end_date,
        job_id: $job_id
    ) {
        meta {
            page limit total_pages total_records is_close_session detail {
                failure retrying success queueing stopped
            }
        }
        data {
            id
            args: arguments
            retries
            max_retry
            interval
            error
            status
            created_at
            finished_at
            next_retry_at
            trace_id
        }
    }
}`;

export default LISTEN_JOB_LIST;