import React from 'react';
import { useRouter } from 'next/router';
import { LeftOutlined } from "@ant-design/icons";
import { Button, Layout, Row, Space } from "antd";
import { getURLRootPath } from 'src/utils/helper';

const ExpiredPage = () => {
    const router = useRouter();
    const pathRoot = getURLRootPath(false);

    return (
        <Layout >
            <Layout.Content style={{
                width: "400px",
                height: "350px",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: "auto"
            }}>
                <Row justify="center" >
                    <Space direction='vertical'>
                        <div className='text-center'>
                            <h1>Your session has expired</h1>
                            <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                router.push({
                                    host: pathRoot,
                                    pathname: "/"
                                })
                            }}>Back to dashboard</Button>
                        </div>
                    </Space>
                </Row>
            </Layout.Content>
        </Layout>
    )
}

export default ExpiredPage;
