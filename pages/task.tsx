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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Membangun candi kini lebih cepat"
        />
      </Head>

      <TaskComponent {...taskComponentProps} />
    </>
  );
};

export default withAuthSync(Task);
