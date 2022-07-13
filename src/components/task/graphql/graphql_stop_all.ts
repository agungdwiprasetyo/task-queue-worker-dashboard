import gql from 'graphql-tag';

const STOP_ALL_JOB = gql`
mutation ($task_name: String!) {
    stop_all_job(task_name: $task_name)
}`;

export default STOP_ALL_JOB;