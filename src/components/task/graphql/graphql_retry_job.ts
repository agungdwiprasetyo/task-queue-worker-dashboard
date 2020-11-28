import gql from 'graphql-tag';

const RETRY_JOB = gql`
mutation ($jobId: String!) {
    retry_job(job_id: $jobId)
}`;

export default RETRY_JOB;