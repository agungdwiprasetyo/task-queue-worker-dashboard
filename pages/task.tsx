import React from 'react';
import { withAuthSync } from '../src/utils/auth'; import TaskComponent from '../src/components/task/Task';

const Task = (props: any) => {
  return (
    <>
      <TaskComponent {...props} />
    </>
  );
};

export default withAuthSync(Task);
