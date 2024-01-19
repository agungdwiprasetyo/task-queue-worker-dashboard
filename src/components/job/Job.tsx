import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button, Divider, Tooltip, Layout, Space, Skeleton, Progress } from 'antd';
import { DetailDataProps, IFilterJobHistoryParam, IJobComponentProps } from './interface';
import { SubscribeJobDetail } from './graphql';
import { RetryJobGraphQL, StopJobGraphQL } from '../task/graphql';
import { Row, Col } from 'antd';
import Moment from 'react-moment';
import Paragraph from 'antd/lib/typography/Paragraph';
import JSONPretty from 'react-json-pretty';
import { getURLRootPath, roundN, StatusLayout, StatusLayoutProps } from 'src/utils/helper';
import Table, { ColumnProps, TablePaginationConfig } from 'antd/lib/table';
import { LeftOutlined, LoadingOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { getQueryVariable } from '../../utils/helper';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import moment from 'moment';
import { Content } from 'antd/lib/layout/layout';
import DetailData from 'src/components/job/DetailData';
import PaginationComponent from 'src/components/shared/PaginationComponent';
import { GetDetailConfiguration } from 'src/components/menu/graphql';
import CopyComponent from 'src/components/shared/CopyComponent';

const JobComponent = (props: IJobComponentProps) => {
    const router = useRouter();
    const pathRoot = getURLRootPath(false);

    const { retryJob } = RetryJobGraphQL();
    const { stopJob } = StopJobGraphQL();
    const traceURLConfig = GetDetailConfiguration("trace_detail_url");

    let jobId = props.id;
    if (!jobId) {
        jobId = getQueryVariable("id") || "";
    }

    const divRef = useRef(null);
    const [paramJobHistory, setParamJobHistory] = useState<IFilterJobHistoryParam>({
        page: 1, limit: 5
    });

    const { data, loading, error } = SubscribeJobDetail(jobId, paramJobHistory);
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
    if (detailJob?.meta?.is_close_session) {
        router.push({
            host: pathRoot,
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
            render: (trace_id: string) => {
                const traceURL = trace_id !== "" ? traceURLConfig?.value?.replace(/\/?(\?|#|$)/, '/$1') + trace_id : "";
                return (
                    <a href={traceURL} target="blank">{traceURL}</a>
                );
            },
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            render: (result: string, row: any) => {
                const resp = row?.error ? row?.error : result;

                if (!resp) { return (<></>) };
                return (
                    <>
                        <Paragraph style={{ cursor: 'pointer' }}>
                            <pre style={row?.error ? { color: "#f5222d", fontWeight: "bold" } : {}} onClick={() => Modal.info({
                                title: row?.error ? 'Error:' : 'Result:',
                                content: (
                                    <Paragraph copyable={{ text: resp }} style={row?.error ? { color: "#f5222d", fontWeight: "bold" } : {}}>
                                        <JSONPretty id="json-pretty" data={resp} />
                                    </Paragraph>
                                ),
                                onOk() { },
                                maskClosable: true,
                                width: 1000
                            })}>{resp.length > 70 ? (<>{resp.slice(0, 70)}<b>...(more)</b></>) : resp}
                            </pre>
                        </Paragraph>
                        {row.error_stack ? (
                            <a onClick={() => Modal.info({
                                title: 'Error Line:',
                                content: (
                                    <Paragraph copyable={{ text: resp }}><JSONPretty id="json-pretty" data={row.error_stack} /></Paragraph>
                                ),
                                onOk() { },
                                maskClosable: true,
                                width: 1000
                            })}>View Error Line</a>
                        ) : ""}
                    </>
                )
            },
        }
    ]

    const propsFooter: IFooterComponentProps = null;

    const showDetailData = (propsDetailData: DetailDataProps) => {
        return (
            <DetailData {...propsDetailData} />
        );
    }

    if (!detailJob?.id && !loading) {
        return (
            <Layout>
                <Content style={{ minHeight: "87vh", padding: '10px 50px' }}>
                    <Row>
                        <Col span={24}>
                            <div className="text-center">
                                <h2><b>Job Detail</b></h2>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Divider orientation="left" />
                        <Col span={24}>
                            <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                router.push({
                                    host: pathRoot,
                                    pathname: "/"
                                })
                            }}>Back to dashboard</Button>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Divider orientation="left" />
                        <p>job not found</p>
                    </Row>
                </Content>
            </Layout>
        )
    }

    return (
        <Layout>
            <Content style={{ minHeight: "87vh", padding: '10px 50px' }}>
                <Row>
                    <Col span={24}>
                        <div className="text-center">
                            <h2><b>Job Detail</b></h2>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={14}>
                        <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                            router.push({
                                host: pathRoot,
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
                                        stopJob({ variables: { job_id: detailJob?.id } })
                                    }}>STOP<span>&nbsp;&nbsp;</span></Button>
                                    :
                                    <Button icon={<SyncOutlined />} type="primary" size="middle" onClick={() => {
                                        retryJob({ variables: { job_id: detailJob?.id } });
                                    }}>RETRY<span>&nbsp;</span></Button>
                            }
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>ID</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : (
                            <Space>
                                <b>{detailJob?.id}</b>
                                <CopyComponent value={detailJob?.id} />
                            </Space>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Task Name</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : (
                            <b><Tooltip title={`View all ${detailJob?.task_name}`}>
                                <a onClick={() => {
                                    router.push({
                                        host: pathRoot,
                                        pathname: "/task",
                                        query: { task_name: detailJob?.task_name }
                                    })
                                }}>{detailJob?.task_name}</a>
                            </Tooltip></b>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Retry</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : detailJob?.retries}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Max Retry</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : detailJob?.max_retry}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Status</b></Col>
                    <Col span={15}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : (
                            <StatusLayout {...statusProps} />
                        )}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Retry Interval</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : detailJob?.interval}</Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Created At</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : (
                            <Moment format="DD MMMM YYYY, HH:mm:ssZ">{detailJob?.created_at}</Moment>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Finished At</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : (
                            <Moment format="DD MMMM YYYY, HH:mm:ssZ">{detailJob?.finished_at}</Moment>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Next Retry At</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) :
                            detailJob?.next_retry_at ?
                                (<Moment format="DD MMMM YYYY, HH:mm:ssZ">{detailJob?.next_retry_at}</Moment>) :
                                "-"
                        }
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Last Trace URL</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : detailJob?.trace_id ? (
                            <a href={traceURLConfig?.value?.replace(/\/?(\?|#|$)/, '/$1') + detailJob?.trace_id} target="blank">
                                {traceURLConfig?.value?.replace(/\/?(\?|#|$)/, '/$1') + detailJob?.trace_id}
                            </a>
                        ) : ""}
                    </Col>
                </Row>
                {detailJob?.max_progress > 0 ? (
                    <Row>
                        <Divider orientation="left" />
                        <Col span={6}><b>Progress</b></Col>
                        <Col span={18}>
                            {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : (
                                <>
                                    <Progress
                                        percent={roundN((detailJob?.current_progress / detailJob?.max_progress) * 100, 2)}
                                        status={detailJob?.current_progress < detailJob?.max_progress ? "active" : "success"}
                                    />
                                    <Row justify="end">{detailJob?.current_progress}/{detailJob?.max_progress}</Row>
                                </>
                            )}
                        </Col>
                    </Row>
                ) : ""}
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Arguments</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : showDetailData({
                            title: "Arguments:",
                            jobId: detailJob?.id,
                            initialValue: detailJob?.arguments,
                            search: "",
                            keyData: "arguments",
                            isShowMore: detailJob?.meta?.is_show_more_args
                        })}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Result</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : detailJob?.result ? showDetailData({
                            title: "Result:",
                            jobId: detailJob?.id,
                            initialValue: detailJob?.result,
                            search: "",
                            keyData: "result",
                            isShowMore: detailJob?.meta?.is_show_more_result
                        }) : ""}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={6}><b>Last Error</b></Col>
                    <Col span={18}>
                        {loading ? (<Skeleton.Button active={true} style={{ width: "500px" }} />) : detailJob?.error ? showDetailData({
                            title: "Error:",
                            jobId: detailJob?.id,
                            initialValue: detailJob?.error,
                            search: "",
                            keyData: "error",
                            isShowMore: detailJob?.meta?.is_show_more_error,
                            isError: detailJob?.error
                        }) : ""}
                    </Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col><b>Retry Histories (Total: {loading ?
                        (<LoadingOutlined spin={true} />) :
                        detailJob?.meta?.total_history})</b></Col>
                </Row>
                <Row>
                    <Divider orientation="left" />
                    <Col span={24}>
                        <div className="ic-table" ref={divRef}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={detailJob?.retry_histories}
                                onChange={(pagination: TablePaginationConfig) => { }}
                                pagination={false}
                            />
                            <PaginationComponent
                                page={detailJob?.meta?.page}
                                limit={paramJobHistory.limit}
                                totalRecord={detailJob?.meta?.total_history}
                                detail={"histories"}
                                onChangePage={(incrPage: number) => {
                                    setParamJobHistory({
                                        page: detailJob?.meta?.page + incrPage, limit: paramJobHistory.limit
                                    });
                                    divRef.current.scrollIntoView({ behavior: 'smooth' });
                                }} />
                        </div>
                    </Col>
                </Row>
            </Content>
            {/* <BackTop>
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
            </BackTop> */}
            <FooterComponent {...propsFooter} />
        </Layout>
    );
}

export default JobComponent;