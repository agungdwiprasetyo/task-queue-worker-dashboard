import { gql } from '@apollo/client';

const KILL_CLIENT_SUBSCRIBER = gql`
mutation killClient($client_id: String!) {
  kill_client_subscriber(client_id: $client_id)
}`;

export default KILL_CLIENT_SUBSCRIBER;
