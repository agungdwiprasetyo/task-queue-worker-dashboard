import gql from 'graphql-tag';

const SUBSCRIBE_TASK = gql`
subscription {
  subscribe_all_task {
    name total_jobs detail {
      give_up retrying success queueing stopped
    }
  }
}`;

export default SUBSCRIBE_TASK;