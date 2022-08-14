import gql from 'graphql-tag';

const CLEAR_CLIENT_SUBSCRIBERS = gql`
mutation {
    clear_all_client_subscriber
}`;

export default CLEAR_CLIENT_SUBSCRIBERS;
