import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Divider, Space, Modal, Tooltip, Layout } from 'antd';
import { LeftOutlined, PlusOutlined, ClearOutlined, StopOutlined } from '@ant-design/icons';
import TableComponent from './Table';
import ModalAddJob from './AddJob';
import { SubscribeTaskList, StopAllJob } from './graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import { TableProps, ITaskListParam, ModalProps, MetaProps } from './interface';
import Meta from './Meta';

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
    const meta = data?.listen_task?.meta;

    const propsMeta: MetaProps = {
        params: paramsTaskList,
        meta: meta,
        loadData: setParamsTaskList,
    }

    const propsTable: TableProps = {
        data: data?.listen_task?.data,
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
        <Layout.Content style={{ padding: '10px 50px' }}>
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
                        <Button style={{ marginBottom: "2px", marginTop: "2px" }} icon={<PlusOutlined />} size="middle" type="primary" onClick={showModal}>Add Job</Button>
                        <Button style={{ marginBottom: "2px", marginTop: "2px" }} icon={<ClearOutlined />} danger size="middle" onClick={() => {
                            cleanJob({ variables: { taskName: paramsTaskList.taskName } });
                        }}>Clear Job</Button>
                        <Tooltip title="Stop all queued job" color="red">
                            <Button style={{ marginBottom: "2px", marginTop: "2px" }} icon={<StopOutlined />} danger size="middle" type="primary" onClick={() => {
                                stopAllJob({ variables: { taskName: paramsTaskList.taskName } });
                            }}>Stop All</Button>
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
        </Layout.Content>
    );
};

export default TaskComponent;
