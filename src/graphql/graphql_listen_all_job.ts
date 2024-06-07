import gql from 'graphql-tag';

const LISTEN_ALL_JOB = gql`
subscription ($filter: GetAllJobInputResolver) {
    listen_all_job: listen_all_job(filter: $filter) {
        meta {
            page limit total_pages total_records message is_close_session is_loading is_freeze_broadcast is_hold detail {
                failure retrying success queueing stopped hold
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
            result
            status
            created_at
            finished_at
            next_retry_at
            trace_id
            meta {
                is_show_more_args
                is_show_more_error
                is_show_more_result
            }
        }
    }
}`;

export default LISTEN_ALL_JOB;