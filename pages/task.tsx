import React from 'react';
import { withAuthSync } from '../src/utils/auth'; import TaskComponent from '../src/components/task/Task';

const Task = (props: any) => {
  const content = {
    marginTop: '30px',
    marginLeft: '50px',
    marginRight: '50px',
  };

  return (
    <div style={content}>
      <TaskComponent {...props} />
    </div>
  );
};

export default withAuthSync(Task);
