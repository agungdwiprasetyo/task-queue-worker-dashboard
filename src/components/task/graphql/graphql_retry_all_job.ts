import gql from 'graphql-tag';

const RETRY_ALL_JOB = gql`
mutation ($task_name: String!) {
    retry_all_job(task_name: $task_name)
}`;

export default RETRY_ALL_JOB;
