import gql from 'graphql-tag';

const ADD_JOB = gql`
mutation addJob($param: AddJobInputResolver!) {
  add_job(param: $param)
}`;

export default ADD_JOB;