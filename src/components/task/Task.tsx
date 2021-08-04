import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Divider, Space, Modal, Tooltip, Layout } from 'antd';
import { LeftOutlined, PlusOutlined, ClearOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import TableComponent from './Table';
import ModalAddJob from './AddJob';
import { SubscribeTaskList, StopAllJob, RetryAllJob } from './graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import { TableProps, ITaskListParam, ModalProps, MetaProps } from './interface';
import Meta from './Meta';
import { GetTagLine } from "../dashboard/graphql";

const { Content, Footer } = Layout;

const TaskComponent = (props: any) => {
    const router = useRouter();
    const { task_name } = router.query;

    const [paramsTaskList, setParamsTaskList] = useState<ITaskListParam>({
        page: 1,
        limit: 10,
        taskName: task_name as string,
        search: null,
        status: [],
    });

    const [modalAddJobVisible, setModalAddJobVisible] = useState(false);
    const showModal = () => {
        setModalAddJobVisible(true);
    };

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

    const propsMeta: MetaProps = {
        params: paramsTaskList,
        meta: meta,
        loadData: setParamsTaskList,
    }

    const propsTable: TableProps = {
        data: data?.listen_task_job_detail?.data,
        meta: meta,
        loadData: setParamsTaskList,
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
                                <h3>Task Name:</h3> <h2><pre><b>{task_name}</b></pre></h2>
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
                        <Col span={16}>
                            <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                router.push({
                                    pathname: "/",
                                })
                            }}>Back to dashboard</Button>
                        </Col>
                        <Col span={6} offset={2}>
                            <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                                <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                    icon={<PlusOutlined />}
                                    size="middle"
                                    type="primary"
                                    onClick={showModal}>Add Job<span>&nbsp;&nbsp;</span></Button>
                                <Tooltip title="Clear all success, failure, and stopped job">
                                    <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                        icon={<ClearOutlined />}
                                        danger
                                        size="middle"
                                        onClick={() => {
                                            cleanJob({ variables: { taskName: paramsTaskList.taskName } });
                                        }}>Clear Job</Button>
                                </Tooltip>
                                <Tooltip title="Retry all failure and stopped job">
                                    <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                        icon={<SyncOutlined />}
                                        size="middle"
                                        type="primary"
                                        onClick={() => {
                                            retryAllJob({ variables: { taskName: paramsTaskList.taskName } });
                                        }}>Retry All<span>&nbsp;&nbsp;</span></Button>
                                </Tooltip>
                                <Tooltip title="Stop all running and queued job">
                                    <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                        icon={<StopOutlined />}
                                        danger
                                        size="middle"
                                        onClick={() => {
                                            stopAllJob({ variables: { taskName: paramsTaskList.taskName } });
                                        }}>Stop All<span>&nbsp;&nbsp;&nbsp;</span></Button>
                                </Tooltip>
                            </Space>
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
