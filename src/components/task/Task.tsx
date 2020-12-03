import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Tag, Row, Col, Button, Divider, Space, Modal } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    LeftOutlined,
    PlusOutlined,
    ClearOutlined

} from '@ant-design/icons';
import TableComponent from './Table';
import ModalAddJob from './AddJob';
import { SubscribeTaskList } from './graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import { TableProps, ITaskListParam, ModalProps } from './interface';

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
        <Row justify="end">
            <Divider orientation="left" />
            <Col span={24}>
                <div className="text-center">
                    <Space>
                        <b>{task_name}</b>
                        <Tag icon={<CheckCircleOutlined />} color="processing"><b>Total Jobs: {meta?.total_records}</b></Tag>
                        <Tag icon={<CheckCircleOutlined />} color="green"><b>Success: {meta?.detail?.success}</b></Tag>
                        <Tag icon={<ClockCircleOutlined />} color="default"><b>Queueing: {meta?.detail?.queueing}</b></Tag>
                        <Tag icon={<SyncOutlined />} color="orange"><b>Retrying: {meta?.detail?.retrying}</b></Tag>
                        <Tag icon={<CloseCircleOutlined />} color="error"><b>Failure: {meta?.detail?.give_up}</b></Tag>
                        <Tag icon={<StopOutlined />} color="red"><b>Stopped: {meta?.detail?.stopped}</b></Tag>
                    </Space>
                </div>
            </Col>
            <Divider orientation="left" />
            <Col span={20}>
                <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                    router.push({
                        pathname: "/",
                    })
                }}>Back to dashboard</Button>
            </Col>
            <Col span={4}>
                <Space>
                    <Button icon={<PlusOutlined />} size="middle" type="primary" onClick={showModal}>Add Job</Button>
                    <Button icon={<ClearOutlined />} danger size="middle" type="primary" onClick={() => {
                        cleanJob({ variables: { taskName: paramsTaskList.taskName } });
                    }}>Clear Job</Button>
                </Space>
            </Col>
            <Divider orientation="left" />
            <Col span={24}>
                <ModalAddJob {...propsModal} />
                <TableComponent {...propsTable} />
            </Col>
            <Divider orientation="left" />
        </Row>
    );
};

export default TaskComponent;
