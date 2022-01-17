import * as React from 'react';
import { Modal, Button, Form, Input, InputNumber, Divider, Tag, } from 'antd';
import { ViewJobDetailProps } from './interface';
import { GetDetailJob } from './graphql';
import { Row, Col } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import Paragraph from 'antd/lib/typography/Paragraph';
import JSONPretty from 'react-json-pretty';
import { StatusLayout, StatusLayoutProps } from 'src/utils/helper';

const ViewJobDetail = (props: ViewJobDetailProps) => {
    let detailJob;
    if (props?.param?.visible) {
        const getDetailJob = GetDetailJob(props?.param?.job_id);
        detailJob = getDetailJob?.get_job_detail;
    }

    const statusProps: StatusLayoutProps = {
        status: detailJob?.status,
        retry: detailJob?.retries
    }

    const renderStatusHistories = (obj: any) => {
        const statusProps: StatusLayoutProps = {
            status: obj?.status,
            retry: obj?.retries
        }
        return (<StatusLayout {...statusProps} />);
    }

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
                <Col span={6}><b>Retry Histories</b></Col>
                <Col span={18}>
                    <Row>
                        <Col span={6}><b>Timestamp</b></Col>
                        <Col span={4}><b>Status</b></Col>
                        <Col span={4}><b>Error</b></Col>
                        <Col span={10}><b>Trace URL</b></Col>
                    </Row>
                    {detailJob?.retry_histories?.map((object, i) =>
                        <>
                            <Divider orientation="left" />
                            <Row>
                                <Col span={5}>
                                    <Moment format="MMMM DD YYYY, HH:mm:ss TZ">{object.timestamp}</Moment>
                                </Col>
                                <Col span={4}>{renderStatusHistories(object)}</Col>
                                <Col span={5} style={{ padding: '0 10px 0 0' }}>
                                    {
                                        object.error ? (
                                            <Paragraph>
                                                <JSONPretty id="json-pretty" data={object.error} />
                                            </Paragraph>
                                        ) : ""
                                    }
                                </Col>
                                <Col span={10}><a href={object?.trace_id} target="blank">{object?.trace_id}</a></Col>
                            </Row>
                        </>
                    )}
                </Col>
            </Row>
        </Modal>

    );
}

export default ViewJobDetail;