import gql from 'graphql-tag';

const DELETE_JOB = gql`
mutation ($job_id: String!) {
    delete_job(job_id: $job_id)
}`;

export default DELETE_JOB;