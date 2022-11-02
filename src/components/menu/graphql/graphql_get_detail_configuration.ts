import { gql } from '@apollo/client';

const GET_DETAIL_CONFIGURATION = gql`
query getDetailConfiguration($key: String!) {
  get_detail_configuration(key: $key) {
    is_active value
  }
}`;

export default GET_DETAIL_CONFIGURATION;
