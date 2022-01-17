import gql from 'graphql-tag';

const DELETE_JOB = gql`
mutation ($jobId: String!) {
    delete_job(job_id: $jobId)
}`;

export default DELETE_JOB;