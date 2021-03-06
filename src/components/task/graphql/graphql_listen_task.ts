import gql from 'graphql-tag';

const LISTEN_JOB_TASK = gql`
subscription ($taskName: String!, $page: Int!, $limit: Int!, $search: String, $status: [String!]!) {
    listen_task(task_name: $taskName, page: $page, limit: $limit, search: $search, status: $status) {
        meta{
            page limit total_pages total_records detail {
                give_up retrying success queueing stopped
            }
        }
        data {
            id args: arguments retries max_retry interval error status created_at finished_at next_retry_at trace_id
        }
    }
}`;

export default LISTEN_JOB_TASK;