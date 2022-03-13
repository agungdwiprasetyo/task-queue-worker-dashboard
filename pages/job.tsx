import React from 'react';
import { withAuthSync } from '../src/utils/auth';
import JobComponent from '../src/components/job/Job';
import { IJobComponentProps } from '../src/components/job/interface';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Job = (props: any) => {

  const router = useRouter();
  const { id } = router.query;

  const taskComponentProps: IJobComponentProps = {
    id: id as string,
  }

  return (
    <>
      <Head>
        <title>Detail Job</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Membangun candi kini lebih cepat"
        />
      </Head>

      <JobComponent {...taskComponentProps} />
    </>
  );
};

export default withAuthSync(Job);
