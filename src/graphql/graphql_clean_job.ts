import gql from 'graphql-tag';

const CLEAN_JOB = gql`
mutation ($filter: FilterMutateJobInputResolver!) {
  clean_job(filter: $filter)
}`;

export default CLEAN_JOB;