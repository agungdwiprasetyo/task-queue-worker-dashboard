import { withAuthSync } from '../src/utils/auth';
import Head from 'next/head';
import React from 'react';
import DashboardComponent from '../src/components/dashboard/Dashboard';
import { Layout, Space } from 'antd';

const Index = (props: any) => {
  const candi = `
  _________    _   ______  ____
 / ____/   |  / | / / __ \/  _/
/ /   / /| | /  |/ / / / // /  
/ /___/ ___ |/ /|  / /_/ // /   
\____/_/  |_/_/ |_/_____/___/   
                               
`
  return (
    <>
      <Head>
        <title>Candi Task Queue Worker</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Don't take too long to get started!"
        />
      </Head>

      <Layout>
        <div className="text-center">
          <Space>
            <pre>
              {candi} Task Queue Worker
            </pre>
          </Space>
        </div>

        <DashboardComponent {...props} />
      </Layout>
    </>
  );
};

export default withAuthSync(Index);
