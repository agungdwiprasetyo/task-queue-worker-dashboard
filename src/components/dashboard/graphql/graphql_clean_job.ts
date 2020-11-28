import gql from 'graphql-tag';

const CLEAN_JOB = gql`
mutation ($taskName: String!) {
  clean_job(task_name: $taskName)
}`;

export default CLEAN_JOB;