import gql from 'graphql-tag';

const ADD_JOB = gql`
mutation ($taskName: String!, $maxRetry: Int!, $args: String!) {
    add_job(task_name: $taskName, max_retry: $maxRetry, args: $args)
}`;

export default ADD_JOB;