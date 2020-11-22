import gql from 'graphql-tag';

const SUBSCRIBE_TOPIC = gql`
  subscription onSubs ($token: String!, $topic: String!) {
    push_notif {
      listen_topic(
        token: $token
        topic: $topic
      ) {
      id, message
      }
    }
}`;

export default SUBSCRIBE_TOPIC;