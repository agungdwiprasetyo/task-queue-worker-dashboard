import gql from 'graphql-tag';

const LISTEN_ALL_JOB = gql`
subscription ($filter: GetAllJobInputResolver) {
    listen_all_job: listen_all_job(filter: $filter) {
        meta {
            page limit total_pages total_records is_close_session is_loading is_freeze_broadcast detail {
                failure retrying success queueing stopped
            }
        }
        data {
            id
            task_name
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

export default LISTEN_ALL_JOB;