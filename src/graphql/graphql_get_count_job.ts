import { gql } from '@apollo/client';

const GET_COUNT_JOB = gql`
query getCountJob($filter: GetAllJobInputResolver) {
  get_count_job(filter: $filter)
}`;

export default GET_COUNT_JOB;
