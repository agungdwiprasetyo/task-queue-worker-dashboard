import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Divider, Space, Modal, Tooltip, Layout } from 'antd';
import { LeftOutlined, PlusOutlined, ClearOutlined, StopOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TableComponent from './Table';
import ModalAddJob from './AddJob';
import { SubscribeTaskList, StopAllJob, RetryAllJob } from './graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import { TableProps, ITaskListParam, ModalProps, MetaProps, ITaskComponentProps } from './interface';
import Meta from './Meta';
import { GetTagLine } from "../dashboard/graphql";

const { confirm } = Modal;

const { Content, Footer } = Layout;

const TaskComponent = (props: ITaskComponentProps) => {
    const router = useRouter();

    const [modalAddJobVisible, setModalAddJobVisible] = useState(false);
    const [jobStatus, setJobStatus] = useState<string[]>([]);
    const [paramsTaskList, setParamsTaskList] = useState<ITaskListParam>({
        loading: false,
        page: 1,
        limit: 10,
        taskName: props.taskName,
        search: null,
        status: jobStatus,
    });

    const { cleanJob } = CleanJobGraphQL();
    const { stopAllJob } = StopAllJob();
    const { retryAllJob } = RetryAllJob();
    const dataTagline = GetTagLine();
    const { data, loading, error } = SubscribeTaskList(paramsTaskList);
    if (error) {
        Modal.error({
            title: 'Error:',
            content: (
                <p>{error.message}</p>
            ),
            onOk() { },
            maskClosable: true,
        })
    }
    const meta = data?.listen_task_job_detail?.meta;


    if (meta?.is_close_session) {
        Modal.error({
            title: 'Session expired, refresh page',
            content: (
                <p>Please refresh page</p>
            ),
            onOk() {
                router.push({
                    pathname: "/"
                })
            },
            maskClosable: true,
        })
    }

    const showAlertConfirm = (title: string, taskName: string, action: string) => {
        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if (action === "CLEAN") {
                    cleanJob({ variables: { taskName: taskName } });
                } else if (action === "STOP") {
                    stopAllJob({ variables: { taskName: taskName } });
                }
            },
            onCancel() {
            },
        });
    }

    const propsMeta: MetaProps = {
        params: paramsTaskList,
        meta: meta,
        setLoadData: setParamsTaskList,
        setJobStatus: setJobStatus,
    }

    const propsTable: TableProps = {
        data: data?.listen_task_job_detail?.data,
        meta: meta,
        setLoadData: setParamsTaskList,
        setJobStatus: setJobStatus,
        loading: loading,
        defaultSort: "desc",
        defaultOrder: "",
        params: paramsTaskList,
    };

    const propsModal: ModalProps = {
        taskName: paramsTaskList.taskName,
        visible: modalAddJobVisible,
        setVisible: setModalAddJobVisible,
    }

    return (
        <>
            <Layout>
                <Content style={{ padding: '10px 50px' }}>
                    <Row>
                        <Col span={24}>
                            <div className="text-center">
                                <h3>Task Name:</h3> <h2><pre><b>{props.taskName}</b></pre></h2>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Divider orientation="left" />
                        <Col span={24}>
                            <Meta {...propsMeta} />
                        </Col>
                    </Row>

                    <Row>
                        <Divider orientation="left" />
                        <Col span={14}>
                            <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                router.push({
                                    pathname: "/",
                                })
                            }}>Back to dashboard</Button>
                        </Col>
                        <Col span={9}>
                            <Row justify="end" gutter={[48, 16]}>
                                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                                    <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                        icon={<PlusOutlined />}
                                        size="middle"
                                        type="primary"
                                        onClick={() => { setModalAddJobVisible(true) }}>Add Job<span>&nbsp;&nbsp;</span></Button>
                                    <Tooltip title="Retry all failure and stopped job">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            icon={<SyncOutlined />}
                                            size="middle"
                                            type="primary"
                                            onClick={() => {
                                                retryAllJob({ variables: { taskName: paramsTaskList.taskName } });
                                            }}>Retry All<span>&nbsp;&nbsp;</span></Button>
                                    </Tooltip>
                                </Space>
                            </Row>
                            <Row justify="end" gutter={48}>
                                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                                    <Tooltip title="Clear all success, failure, and stopped job" placement="bottom">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            icon={<ClearOutlined />}
                                            danger
                                            size="middle"
                                            onClick={() => {
                                                showAlertConfirm(
                                                    "Are you sure clear all success, failure, and stopped job in this task?",
                                                    paramsTaskList.taskName,
                                                    "CLEAN"
                                                );
                                            }}>Clear Job</Button>
                                    </Tooltip>
                                    <Tooltip title="Stop all running and queued job" placement="bottom">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            icon={<StopOutlined />}
                                            danger
                                            size="middle"
                                            onClick={() => {
                                                showAlertConfirm(
                                                    "Are you sure stop all running and queued job in this task?",
                                                    paramsTaskList.taskName,
                                                    "STOP"
                                                );
                                            }}>Stop All<span>&nbsp;&nbsp;&nbsp;</span></Button>
                                    </Tooltip>
                                </Space>
                            </Row>
                        </Col>
                        <Divider orientation="left" />
                    </Row>
                    <Row>
                        <Col span={24}>
                            <ModalAddJob {...propsModal} />
                            <TableComponent {...propsTable} />
                        </Col>
                    </Row>
                    <Footer style={{ textAlign: 'center' }}>candi version <b>{dataTagline?.tagline?.version}</b></Footer>
                </Content>
            </Layout>
        </>
    );
};

export default TaskComponent;
