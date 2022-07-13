import gql from 'graphql-tag';

const STOP_JOB = gql`
mutation ($job_id: String!) {
    stop_job(job_id: $job_id)
}`;

export default STOP_JOB;