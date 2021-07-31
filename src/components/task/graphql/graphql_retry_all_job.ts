import gql from 'graphql-tag';

const RETRY_ALL_JOB = gql`
mutation ($taskName: String!) {
    retry_all_job(task_name: $taskName)
}`;

export default RETRY_ALL_JOB;
