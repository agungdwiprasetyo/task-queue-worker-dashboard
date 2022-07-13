import React from 'react';
import { useRouter } from 'next/router';
import { Modal, Button, Divider, Spin, Tooltip, Tag, Layout, Space, BackTop } from 'antd';
import { IJobComponentProps } from './interface';
import { SubscribeJobDetail } from './graphql';
import { RetryJobGraphQL, StopJobGraphQL, DeleteJobGraphQL } from '../task/graphql';
import { Row, Col } from 'antd';
import Moment from 'react-moment';
import Paragraph from 'antd/lib/typography/Paragraph';
import JSONPretty from 'react-json-pretty';
import { StatusLayout, StatusLayoutProps } from 'src/utils/helper';
import Table, { ColumnProps } from 'antd/lib/table';
import { LeftOutlined, StopOutlined, SyncOutlined, UpOutlined } from '@ant-design/icons';
import { getQueryVariable } from '../../utils/helper';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import moment from 'moment';

const JobComponent = (props: IJobComponentProps) => {
    const router = useRouter();

    const { retryJob } = RetryJobGraphQL();
    const { stopJob } = StopJobGraphQL();

    let jobId = props.id;
    if (!jobId) {
        jobId = getQueryVariable("id") || "";
    }

    const { data, loading, error } = SubscribeJobDetail(jobId);
    if (error) {
        Modal.error({
            title: 'Error get job detail data',
            content: (
                <p>{error.message}</p>
            ),
            maskClosable: true,
        })
    }
    const detailJob = data?.listen_detail_job;
    if (detailJob?.is_close_session) {
        router.push({
            pathname: "/expired"
        })
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
                    <Moment format="DD MMMM YYYY, HH:mm:ssZ">{text}</Moment>
                );
            },
        },
        {
            title: 'End At',
            dataIndex: 'end_at',
            key: 'end_at',
            render: (text: string) => {
                return (
                    <Moment format="DD MMMM YYYY, HH:mm:ssZ">{text}</Moment>
                );
            },
        },
        {
            title: 'Duration',
            dataIndex: '',
            key: '',
            render: (text: string, row: any) => {
                const start = moment(new Date(row?.start_at));
                const end = moment(new Date(row?.end_at));
                return moment.duration(end.diff(start)).toISOString().replace(".", ",").replace("PT", "").toLowerCase();
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
                    <Paragraph style={{ cursor: 'pointer' }}>
                        <pre onClick={() => Modal.info({
                            title: 'Error:',
                            content: (
                                <Paragraph copyable={{ text: text }}><JSONPretty id="json-pretty" data={text} /></Paragraph>
                            ),
                            onOk() { },
                            maskClosable: true,
                            width: 1000
                        })}>{text.length > 70 ? `${text.slice(0, 70)} ...(more)` : text}
                        </pre>
                    </Paragraph>
                )
            },
        },
        {
            title: 'Error Line',
            dataIndex: 'error_stack',
            key: 'error_stack',
            ellipsis: true,
            render: (text: string) => {
                if (!text) { return (<></>) };
                return (
                    <Paragraph style={{ cursor: 'pointer' }}>
                        <pre onClick={() => Modal.info({
                            title: 'Error Line:',
                            content: (
                                <Paragraph copyable={{ text: text }}><JSONPretty id="json-pretty" data={text} /></Paragraph>
                            ),
                            onOk() { },
                            maskClosable: true,
                            width: 1000
                        })}>{text.length > 50 ? `${text.slice(0, 50)} ...(more)` : text}
                        </pre>
                    </Paragraph>
                );
            },
        }
    ]

    const propsFooter: IFooterComponentProps = null;

    return (
        <>
            <Layout style={{ minHeight: "88vh" }}>
                <Layout.Content style={{ padding: '10px 50px' }}>
                    <Row>
                        <Col span={24}>
                            <div className="text-center">
                                <h2><b>Job Detail</b></h2>
                            </div>
                        </Col>
                    </Row>
                    {loading ? (
                        <Row justify="center"><Spin size="large" tip="Loading..." /></Row>
                    ) : detailJob?.id ? (
                        <>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={14}>
                                    <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                        router.push({
                                            pathname: "/task",
                                            query: { task_name: detailJob?.task_name }
                                        })
                                    }}>Back to {detailJob?.task_name}</Button>
                                </Col>
                                <Col span={9}>
                                    <Row justify="end">
                                        {
                                            (detailJob?.status == "RETRYING" || detailJob?.status == "QUEUEING") ?
                                                <Button icon={<StopOutlined />} type="primary" danger size="middle" onClick={() => {
                                                    stopJob({ variables: { jobId: detailJob?.id } })
                                                }}>STOP<span>&nbsp;&nbsp;</span></Button>
                                                :
                                                <Button icon={<SyncOutlined />} type="primary" size="middle" onClick={() => {
                                                    retryJob({ variables: { jobId: detailJob?.id } });
                                                }}>RETRY<span>&nbsp;</span></Button>

                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>ID</b></Col>
                                <Col span={18}>
                                    <Space>
                                        <b>{detailJob?.id}</b>
                                        <Tooltip title="copy full link url to clipboard">
                                            <Tag style={{
                                                cursor: 'pointer'
                                            }} color="geekblue" onClick={() => {
                                                const el = document.createElement('textarea');
                                                el.value = window.location.href;
                                                document.body.appendChild(el);
                                                el.select();
                                                document.execCommand('copy');
                                                document.body.removeChild(el);
                                            }}>
                                                copy link url
                                            </Tag>
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Task Name</b></Col>
                                <Col span={18}>
                                    <b><Tooltip title={`View all ${detailJob?.task_name}`}>
                                        <a onClick={() => {
                                            router.push({
                                                pathname: "/task",
                                                query: { task_name: detailJob?.task_name }
                                            })
                                        }}>{detailJob?.task_name}</a>
                                    </Tooltip></b>
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Retry</b></Col>
                                <Col span={18}>{detailJob?.retries}</Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Max Retry</b></Col>
                                <Col span={18}>{detailJob?.max_retry}</Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Status</b></Col>
                                <Col span={15}>
                                    <StatusLayout {...statusProps} />
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Retry Interval</b></Col>
                                <Col span={18}>{detailJob?.interval}</Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Created At</b></Col>
                                <Col span={18}>
                                    <Moment format="DD MMMM YYYY, HH:mm:ssZ">{detailJob?.created_at}</Moment>
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Finished At</b></Col>
                                <Col span={18}>
                                    <Moment format="DD MMMM YYYY, HH:mm:ssZ">{detailJob?.finished_at}</Moment>
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Next Retry At</b></Col>
                                <Col span={18}>
                                    {detailJob?.next_retry_at ? (<Moment format="DD MMMM YYYY, HH:mm:ssZ">{detailJob?.next_retry_at}</Moment>) : "-"}
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Last Trace URL</b></Col>
                                <Col span={18}><a href={detailJob?.trace_id} target="blank">{detailJob?.trace_id}</a></Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Last Error</b></Col>
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
                            <Row>
                                <Divider orientation="left" />
                                <Col span={6}><b>Arguments</b></Col>
                                <Col span={18}>
                                    <pre>
                                        <Paragraph copyable={{ text: detailJob?.arguments }}>
                                            <JSONPretty id="json-pretty" data={detailJob?.arguments} />
                                        </Paragraph>
                                    </pre>
                                </Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col><b>Retry Histories</b></Col>
                            </Row>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={24}>
                                    <Table
                                        columns={columns}
                                        dataSource={detailJob?.retry_histories}
                                        pagination={{
                                            defaultPageSize: 10,
                                            showTotal: (total, range) => { return (<>{range[0]}-{range[1]} of <b>{total}</b> histories</>) }
                                        }}
                                    />
                                </Col>
                            </Row>
                        </>) : (
                        <>
                            <Row>
                                <Divider orientation="left" />
                                <Col span={24}>
                                    <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                        router.push({
                                            pathname: "/"
                                        })
                                    }}>Back to dashboard</Button>
                                </Col>
                            </Row>
                            <Row justify="center">
                                <Divider orientation="left" />
                                <p>job not found</p>
                            </Row>
                        </>
                    )}
                </Layout.Content>
            </Layout>
            <BackTop>
                <UpOutlined style={{
                    height: 40,
                    width: 40,
                    lineHeight: '40px',
                    borderRadius: 4,
                    backgroundColor: '#1088e9',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 17,
                }} />
            </BackTop>
            <FooterComponent {...propsFooter} />
        </>
    );
}

export default JobComponent;