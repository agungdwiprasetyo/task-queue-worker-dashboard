import gql from 'graphql-tag';

const CLEAN_JOB = gql`
mutation ($task_name: String!) {
  clean_job(task_name: $task_name)
}`;

export default CLEAN_JOB;