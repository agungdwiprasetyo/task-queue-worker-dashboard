import gql from 'graphql-tag';

const SUBSCRIBE_TASK = gql`
subscription {
  listen_task {
    meta {
      page limit total_pages total_records is_close_session
    }
    data {
      name total_jobs detail {
        give_up retrying success queueing stopped
      }
    }
  }
}`;

export default SUBSCRIBE_TASK;