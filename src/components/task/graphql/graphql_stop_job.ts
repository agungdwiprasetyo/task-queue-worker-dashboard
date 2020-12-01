import gql from 'graphql-tag';

const STOP_JOB = gql`
mutation ($jobId: String!) {
    stop_job(job_id: $jobId)
}`;

export default STOP_JOB;