import gql from 'graphql-tag';

const SUBSCRIBE_TASK = gql`
subscription ($taskName: String!) {
    listen_task(task_name: $taskName) {
        meta{
            page total_data
        }
        data {
            id task_name args retries max_retry interval error is_giveup created_at
        }
    }
}`;

export default SUBSCRIBE_TASK;