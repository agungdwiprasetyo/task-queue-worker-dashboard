import gql from 'graphql-tag';

const RETRY_ALL_JOB = gql`
mutation ($filter: FilterMutateJobInputResolver!) {
    retry_all_job(filter: $filter)
}`;

export default RETRY_ALL_JOB;
