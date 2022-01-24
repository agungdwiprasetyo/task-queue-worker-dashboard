import React from 'react';
import { withAuthSync } from '../src/utils/auth';
import TaskComponent from '../src/components/task/Task';
import { ITaskComponentProps } from '../src/components/task/interface';
import { Layout } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Task = (props: any) => {

  const router = useRouter();
  const { task_name } = router.query;

  const taskComponentProps: ITaskComponentProps = {
    taskName: task_name as string,
  }

  return (
    <>
      <Head>
        <title>Detail Task</title>
      </Head>

      <TaskComponent {...taskComponentProps} />
    </>
  );
};

export default withAuthSync(Task);
