import { withAuthSync } from '../src/utils/auth';
import Head from 'next/head';
import React from 'react';
import DashboardComponent from '../src/components/dashboard/Dashboard';
import { Layout } from 'antd';

const Index = (props: any) => {
  return (
    <>
      <Head>
        <title>Candi Task Queue Worker</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Membangun candi kini lebih cepat"
        />
      </Head>

      <DashboardComponent {...props} />
    </>
  );
};

export default withAuthSync(Index);
