import React from 'react';
// import Link from 'next/link';

interface ITopic {
  id: string;
  message: string;
}

export const TopicCard: React.SFC<ITopic> = props => {
  return (
    <div key={props.id}>
      {/* <img src={props.img} alt=" height="90" /> */}
      <div>
        <h2>{props.message}</h2>
        {/* <h2>{props.email}</h2> */}
      </div>
    </div>
  );
};
