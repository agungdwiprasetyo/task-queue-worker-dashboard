import React, { useState } from 'react';
import { ClearOutlined, ExclamationCircleOutlined, PlusOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Row, Space, Tooltip, Modal, } from 'antd';
import { IActionComponentProps } from 'src/components/task/interface';
import { GetCountJob, StopAllJob } from 'src/components/task/graphql';
import { ModalAddJob, ModalMutateJob } from 'src/components/task/ActionModal';

const ActionComponent = (props: IActionComponentProps) => {

    const [modalAddJobVisible, setModalAddJobVisible] = useState(false);
    const [modalMutateVisible, setModalMutateVisible] = useState(false);
    const [action, setAction] = useState<string>("");

    const { stopAllJob } = StopAllJob();
    const { countJob } = GetCountJob(props.task_list_param);

    const showModalMutateJob = (action: string) => {
        setAction(action);
        setModalMutateVisible(true);
    }

    return (
        <>
            <Row justify="end" gutter={[48, 16]}>
                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                    <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                        disabled={props.is_loading_subscribe || props.is_loading}
                        icon={<PlusOutlined />}
                        size="middle"
                        type="primary"
                        onClick={() => { setModalAddJobVisible(true) }}>Add Job<span>&nbsp;&nbsp;</span></Button>
                    <Tooltip title="Retry all job">
                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                            disabled={props.is_loading_subscribe || props.is_loading}
                            icon={<SyncOutlined />}
                            size="middle"
                            type="primary"
                            onClick={() => { showModalMutateJob("RETRY") }}>Retry All<span>&nbsp;&nbsp;</span></Button>
                    </Tooltip>
                </Space>
            </Row>
            <Row justify="end" gutter={48}>
                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                    <Tooltip title="Clear all success, failure, and stopped job" placement="bottom">
                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                            disabled={props.is_loading_subscribe || props.is_loading}
                            icon={<ClearOutlined />}
                            danger
                            size="middle"
                            onClick={() => { showModalMutateJob("CLEAN") }}>Clear Job</Button>
                    </Tooltip>
                    <Tooltip title="Stop all running and queued job" placement="bottom">
                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                            disabled={props.is_loading_subscribe || props.is_loading}
                            icon={<StopOutlined />}
                            danger
                            size="middle"
                            onClick={() => {
                                Modal.confirm({
                                    title: "Are you sure stop all running and queued job in this task?",
                                    icon: <ExclamationCircleOutlined />,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk() { stopAllJob({ variables: { task_name: props.task_list_param.task_name } }) },
                                    onCancel() { },
                                });
                            }}>Stop All<span>&nbsp;&nbsp;&nbsp;</span></Button>
                    </Tooltip>
                </Space>
            </Row>

            <ModalAddJob
                task_name={props.task_list_param.task_name}
                visible={modalAddJobVisible}
                setVisible={setModalAddJobVisible}
            />

            <ModalMutateJob
                visible={modalMutateVisible}
                action={action}
                setVisible={setModalMutateVisible}
                task_list_param={props.task_list_param}
                action_func={null}
                count_job={countJob}
            />
        </>
    );
}

export default ActionComponent;
