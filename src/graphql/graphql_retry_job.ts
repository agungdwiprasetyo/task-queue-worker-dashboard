import gql from 'graphql-tag';

const RETRY_JOB = gql`
mutation ($job_id: String!) {
    retry_job(job_id: $job_id)
}`;

export default RETRY_JOB;