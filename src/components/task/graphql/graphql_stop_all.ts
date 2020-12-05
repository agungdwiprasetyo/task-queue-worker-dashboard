import gql from 'graphql-tag';

const STOP_ALL_JOB = gql`
mutation ($taskName: String!) {
    stop_all_job(task_name: $taskName)
}`;

export default STOP_ALL_JOB;