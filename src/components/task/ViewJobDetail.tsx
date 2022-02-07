import * as React from 'react';
import { Modal, Button, Divider, Spin, } from 'antd';
import { ViewJobDetailProps } from './interface';
import { GetDetailJob } from './graphql';
import { Row, Col } from 'antd';
import Moment from 'react-moment';
import Paragraph from 'antd/lib/typography/Paragraph';
import JSONPretty from 'react-json-pretty';
import { StatusLayout, StatusLayoutProps } from 'src/utils/helper';
import Table, { ColumnProps } from 'antd/lib/table';

const ViewJobDetail = (props: ViewJobDetailProps) => {
    let detailJob;
    let isLoading = false;
    if (props?.param?.visible) {
        const { data, loading, error } = GetDetailJob(props?.param?.job_id);
        if (error) {
            Modal.error({
                title: 'Error get job detail data',
                content: (
                    <p>{error.message}</p>
                ),
                onOk() { },
                maskClosable: true,
            })
        }
        isLoading = loading;
        detailJob = data?.get_job_detail;
    }

    const statusProps: StatusLayoutProps = {
        status: detailJob?.status,
        retry: detailJob?.retries
    }

    let columns: Array<ColumnProps<any>> = [
        {
            title: 'Start At',
            dataIndex: 'start_at',
            key: 'start_at',
            render: (text: string) => {
                return (
                    <Moment format="MMMM DD YYYY, HH:mm:ss TZ">{text}</Moment>
                );
            },
        },
        {
            title: 'End At',
            dataIndex: 'end_at',
            key: 'end_at',
            render: (text: string) => {
                return (
                    <Moment format="MMMM DD YYYY, HH:mm:ss TZ">{text}</Moment>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: string, row: any) => {
                const statusProps: StatusLayoutProps = {
                    status: row?.status,
                    retry: row?.retries
                }
                return (<StatusLayout {...statusProps} />);
            },
        },
        {
            title: 'Trace URL',
            dataIndex: 'trace_id',
            key: 'trace_id',
            render: (text: string) => {
                return (
                    <a href={text} target="blank">{text}</a>
                );
            },
        },
        {
            title: 'Error',
            dataIndex: 'error',
            key: 'error',
            render: (text: string) => {
                if (!text) { return (<></>) };
                return (
                    <Paragraph>
                        <JSONPretty id="json-pretty" data={text} />
                    </Paragraph>
                )
            },
        },
        {
            title: 'Error Stack',
            dataIndex: 'error_stack',
            key: 'error_stack',
            ellipsis: true,
            render: (text: string) => {
                if (!text) { return (<></>) };
                return (
                    <Paragraph>
                        <JSONPretty id="json-pretty" data={text} />
                    </Paragraph>
                );
            },
        }
    ]

    return (

        <Modal title="Job Detail"
            visible={props?.param?.visible}
            onOk={() => {
                props.setParam({ job_id: null, visible: false });
            }}
            onCancel={() => {
                props.setParam({ job_id: null, visible: false })
            }}
            width={1000}
            footer={[
                <Button type="primary" onClick={() => {
                    props.setParam({ job_id: null, visible: false });
                }}>OK</Button>,
            ]}
        >
            {isLoading ? (
                <Row justify="center"><Spin size="large" tip="Loading..." /></Row>
            ) : (
                <>
                    <Row>
                        <Col span={6}><b>ID</b></Col>
                        <Col span={18}>{detailJob?.id}</Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Task Name</b></Col>
                        <Col span={18}>{detailJob?.task_name}</Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Retry</b></Col>
                        <Col span={18}>{detailJob?.retries}</Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Max Retry</b></Col>
                        <Col span={18}>{detailJob?.max_retry}</Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Status</b></Col>
                        <Col span={18}>
                            <StatusLayout {...statusProps} />
                        </Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Retry Interval</b></Col>
                        <Col span={18}>{detailJob?.interval}</Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Created At</b></Col>
                        <Col span={18}>
                            <Moment format="MMMM DD YYYY, HH:mm:ss TZ">{detailJob?.created_at}</Moment>
                        </Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Finished At</b></Col>
                        <Col span={18}>
                            <Moment format="MMMM DD YYYY, HH:mm:ss TZ">{detailJob?.finished_at}</Moment>
                        </Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Next Retry At</b></Col>
                        <Col span={18}>
                            {detailJob?.next_retry_at ? (<Moment format="MMMM DD YYYY, HH:mm:ss TZ">{detailJob?.next_retry_at}</Moment>) : "-"}
                        </Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Trace URL</b></Col>
                        <Col span={18}><a href={detailJob?.trace_id} target="blank">{detailJob?.trace_id}</a></Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Error</b></Col>
                        <Col span={18}>
                            {
                                detailJob?.error ? (
                                    <Paragraph>
                                        <JSONPretty id="json-pretty" data={detailJob?.error} />
                                    </Paragraph>
                                ) : ""
                            }
                        </Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={6}><b>Arguments</b></Col>
                        <Col span={18}>
                            <pre>
                                <Paragraph copyable={{ text: detailJob?.arguments }}>
                                    <JSONPretty id="json-pretty" data={detailJob?.arguments} />
                                </Paragraph>
                            </pre>
                        </Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col><b>Retry Histories</b></Col>
                    </Row>
                    <Divider orientation="left" />
                    <Row>
                        <Col span={24}>
                            <Table
                                columns={columns}
                                dataSource={detailJob?.retry_histories}
                                pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
                            />
                        </Col>
                    </Row>
                </>)}
        </Modal>

    );
}

export default ViewJobDetail;