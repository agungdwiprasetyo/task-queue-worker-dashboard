import React from 'react';
import { useRouter } from 'next/router';
import { LeftOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Layout, Row, Space } from "antd";

const ExpiredPage = () => {
    const router = useRouter();

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
