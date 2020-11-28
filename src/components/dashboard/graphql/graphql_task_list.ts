import gql from 'graphql-tag';

const TASK_LIST = gql`
query {
  get_all_task {
    name total_jobs
  }
}`;

export default TASK_LIST;