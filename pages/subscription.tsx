import React from 'react';
import { useSubscription } from '@apollo/react-hooks';
// import { TopicCard } from '../src/components/Topic';
import SUBSCRIBE_TOPIC from '../src/graphql/subscribe_topic';
import { withAuthSync } from '../src/utils/auth';
import Table from 'react-bootstrap/Table'

const Subscription = () => {
  const { data, loading, error } = useSubscription(SUBSCRIBE_TOPIC, {
    variables: {
      "token": "test",
      "topic": "test"
    }
  });
  let message = 'GraphQL Subscriber';
  if (loading) message = 'Listening...';
  if (error) message = `Error! ${error.message}`;
  return (
    <div className="container">

      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th >ID</th>
            <th >MESSAGE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{data?.listen_topic.id}</td>
            <td>{data?.listen_topic.message}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default withAuthSync(Subscription);
