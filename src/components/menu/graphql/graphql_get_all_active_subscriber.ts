import { gql } from '@apollo/client';

const GET_ALL_ACTIVE_SUBSCRIBERS = gql`
query {
  get_all_active_subscriber {
    client_id
    page_name
    page_filter
  }
}`;

export default GET_ALL_ACTIVE_SUBSCRIBERS;
