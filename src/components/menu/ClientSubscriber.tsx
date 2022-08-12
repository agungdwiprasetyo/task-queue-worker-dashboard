import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Table } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { KillClientSubscriber } from "src/components/menu/graphql";
import { IClientSubscriber, IPropsClientSubscriber } from "src/components/menu/interface";

export const ClientSubscriber = (props: IPropsClientSubscriber) => {
    const { killClientSubscriber } = KillClientSubscriber();

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
            title: 'Page Filter',
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
                        <Button type="primary" danger size="small"
                            icon={<CloseCircleOutlined />}
                            onClick={() => {
                                killClientSubscriber({
                                    variables: {
                                        client_id: rows.client_id
                                    }
                                });
                                props.getData();
                            }}>Kill</Button>
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
                <Col span={18} />
                <Col span={1}>
                    <Button icon={<SyncOutlined />} size="middle"
                        onClick={() => {
                            props.getData();
                        }} />
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
