import gql from 'graphql-tag';

const LISTEN_JOB_TASK = gql`
subscription ($taskName: String!, $page: Int!, $limit: Int!) {
    listen_task(task_name: $taskName, page: $page, limit: $limit) {
        meta{
            page limit total_pages total_records
        }
        data {
            id task_name args: arguments retries max_retry interval error status created_at trace_id
        }
    }
}`;

export default LISTEN_JOB_TASK;