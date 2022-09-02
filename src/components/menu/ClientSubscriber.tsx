import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Space, Table, Tooltip } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useEffect } from "react";
import { ClearAllClientSubscriber, KillClientSubscriber } from "src/components/menu/graphql";
import { IClientSubscriber, IPropsClientSubscriber } from "src/components/menu/interface";

export const ClientSubscriber = (props: IPropsClientSubscriber) => {
    const { killClientSubscriber } = KillClientSubscriber();
    const { clearClient } = ClearAllClientSubscriber();

    useEffect(() => {
        props.getData();
    }, [props.client_id])

    const columns = [
        {
            dataIndex: 'client_id',
            key: 'client_id',
            title: 'Client ID',
            width: 50,
            render: (client_id: string) => {
                return (
                    <Paragraph><pre>{client_id}</pre></Paragraph>
                )
            },
        },
        {
            dataIndex: 'page_name',
            key: 'page_name',
            title: 'Page',
            render: (page_name: string) => {
                return (
                    <div>{page_name}</div>
                );
            }
        },
        {
            dataIndex: 'page_filter',
            key: 'page_filter',
            title: 'Page Param',
            width: 100,
            render: (page_filter: string) => {
                if (page_filter)
                    return (
                        <Paragraph><pre>{page_filter}</pre></Paragraph>
                    );
            }
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_: string, rows: IClientSubscriber) => {
                return (
                    <Row justify="center">
                        <Space>
                            <Tooltip title={props.client_id == rows.client_id ? "it's you" : ""} placement="top">
                                <Button disabled={props.client_id == rows.client_id} type="primary" danger size="small"
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => {
                                        killClientSubscriber({
                                            variables: {
                                                client_id: rows.client_id
                                            }
                                        });
                                        props.getData();
                                    }}>Kill</Button>
                            </Tooltip>
                        </Space>
                    </Row>
                );
            }
        }
    ];

    return (
        <Modal title="Client Subscribers"
            visible={props.visible}
            onCancel={() => { props.setVisible(false) }}
            maskClosable={true}
            footer={null}
            width={1200}
        >
            <Row>
                <Col span={5}>
                    <b>Total Client: {props.data?.length}</b>
                </Col>
                <Col span={16} />
                <Col span={3}>
                    <Space>
                        <Button icon={<SyncOutlined />} size="middle"
                            onClick={() => {
                                props.getData();
                            }} />
                        <Button danger icon={<CloseCircleOutlined />} size="middle" type="default"
                            onClick={() => {
                                clearClient();
                            }} >Kill All</Button>
                    </Space>
                </Col>
            </Row>
            <div className="ic-table" style={{ marginTop: "10px" }}>
                <Table
                    columns={columns}
                    dataSource={props.data}
                    loading={props.loading}
                    pagination={false}
                />
            </div>
        </Modal>
    )
}

export default ClientSubscriber;
