import gql from 'graphql-tag';

const SUBSCRIBE_TASK = gql`
subscription ($page: Int!, $limit: Int!, $search: String) {
  listen_task_dashboard (
    page: $page, 
    limit: $limit, 
    search: $search
  ) {
    meta {
      page limit total_pages total_records is_close_session
      total_client_subscriber client_id
    }
    data {
      name module_name total_jobs is_loading loading_message detail {
        failure retrying success queueing stopped
      }
    }
  }
}`;

export default SUBSCRIBE_TASK;