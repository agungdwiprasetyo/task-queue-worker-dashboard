import React from 'react';
import { withAuthSync } from '../src/utils/auth'; import TaskComponent from '../src/components/task/Task';
import { Layout } from 'antd';

const Task = (props: any) => {
  return (
    <Layout>
      <TaskComponent {...props} />
    </Layout>
  );
};

export default withAuthSync(Task);
