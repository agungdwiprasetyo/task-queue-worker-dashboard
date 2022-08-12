import { gql } from '@apollo/client';

const GET_CONFIGURATION = gql`
query {
  get_all_configuration {
    key
    name
    value
    is_active
  }
}`;

export default GET_CONFIGURATION;
