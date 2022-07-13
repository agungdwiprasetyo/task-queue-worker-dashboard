import React from 'react';
import { withAuthSync } from '../src/utils/auth';
import EmptyPage from '../src/components/expired/Expired';
import Head from 'next/head';

const Expired = (props: any) => {

    return (
        <>
            <Head>
                <title>Expired Session</title>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ffffff" />
                <meta
                    name="description"
                    content="Membangun candi kini lebih cepat"
                />
            </Head>

            <EmptyPage />
        </>
    );
};

export default withAuthSync(Expired);
