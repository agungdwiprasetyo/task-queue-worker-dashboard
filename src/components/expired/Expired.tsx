import React from 'react';
import { useRouter } from 'next/router';
import { LeftOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Layout, Row, Space } from "antd";

const ExpiredPage = () => {
    const router = useRouter();

    return (
        <Layout style={{ minHeight: "88vh" }}>
            <Layout.Content style={{ padding: '10px 50px' }}>
                <Row justify="center">
                    <Space direction='vertical'>
                        <div className='text-center'>
                            <h1>Your session has expired</h1>
                            <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                router.push({
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
