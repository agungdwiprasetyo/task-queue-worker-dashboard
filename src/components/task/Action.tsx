import React, { useState } from 'react';
import {
    CaretRightOutlined, ClearOutlined, ExclamationCircleOutlined, PauseOutlined, PlusOutlined, StopOutlined, SyncOutlined
} from '@ant-design/icons';
import { Button, Row, Space, Tooltip, Modal, Col } from 'antd';
import { IActionComponentProps } from 'src/components/task/interface';
import { StopAllJob, HoldJobTask } from 'src/graphql';
import { ModalAddJob, ModalMutateJob } from 'src/components/shared/ActionModal';
import { HoldUnholdComponent, IHoldUnholdProps } from 'src/components/shared/HoldUnholdComponent';

const ActionComponent = (props: IActionComponentProps) => {
    const [modalAddJobVisible, setModalAddJobVisible] = useState(false);
    const [modalMutateVisible, setModalMutateVisible] = useState(false);
    const [action, setAction] = useState<string>("");

    const { stopAllJob } = StopAllJob();
    const { holdJobTask } = HoldJobTask();

    const showModalMutateJob = (action: string) => {
        setAction(action);
        setModalMutateVisible(true);
    }

    const isButtonDisable: boolean = props.is_loading_subscribe || props.is_loading;
    const [holdModalMutateState, setHoldModalMutateState] = useState<IHoldUnholdProps>({ visible: false, taskName: "", isHold: false });

    return (
        <>
            <Row gutter={[8, 8]} justify="center">
                <Col span={12}>
                    <Button
                        disabled={isButtonDisable}
                        icon={<PlusOutlined />}
                        size="middle"
                        type="primary"
                        onClick={() => { setModalAddJobVisible(true) }}>Add Job<span>&nbsp;&nbsp;</span></Button>
                </Col>
                <Col span={12}>
                    <Button
                        disabled={isButtonDisable}
                        icon={<SyncOutlined />}
                        size="middle"
                        type="primary"
                        onClick={() => { showModalMutateJob("RETRY") }}>Retry All</Button>
                </Col>

                <Col span={12}>
                    <Tooltip title="Clear all success, failure, and stopped job" placement="bottom">
                        <Button
                            disabled={isButtonDisable}
                            icon={<ClearOutlined />}
                            danger
                            size="middle"
                            onClick={() => { showModalMutateJob("CLEAN") }}>Clear Job</Button>
                    </Tooltip>
                </Col>
                <Col span={12}>
                    <Tooltip title="Stop all running and queued job" placement="bottom">
                        <Button
                            disabled={isButtonDisable}
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
                            }}>Stop All<span>&nbsp;</span></Button>
                    </Tooltip>
                </Col>
            </Row>
            <Row gutter={[8, 8]} justify="center">
                <Button type="ghost" size="large" style={{ marginTop: "4px" }}
                    disabled={isButtonDisable}
                    icon={props.is_hold ? (<CaretRightOutlined />) : (<PauseOutlined />)}
                    // onClick={() => {
                    //     setHoldModalMutateState({ visible: true, taskName: props?.task_list_param?.task_name, isHold: props?.is_hold });
                    // }}
                    onClick={() => {
                        Modal.confirm({
                            title: `Are you sure to ${props.is_hold ? "unhold" : "hold incoming job"}?`,
                            okText: 'Yes',
                            okType: 'danger',
                            cancelText: 'No',
                            onOk: () => {
                                holdJobTask({
                                    variables: {
                                        task_name: props?.task_list_param?.task_name,
                                        is_auto_switch: false,
                                    }
                                })
                            }
                        });
                    }}
                >
                    {props.is_hold ? "Unhold" : "Hold"}
                </Button>
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
            />

            <HoldUnholdComponent
                setState={setHoldModalMutateState}
                state={holdModalMutateState}
            />
        </>
    );
}

export default ActionComponent;
