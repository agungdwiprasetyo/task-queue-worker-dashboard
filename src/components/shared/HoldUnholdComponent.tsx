import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { Form, Input, List, Modal, Radio, Switch, Tag } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { HoldJobTask, ParseCronExpression } from 'src/graphql';

export interface IHoldUnholdProps {
    visible: boolean;
    taskName: string;
    isHold: boolean;
    switchInterval?: string;
}

export const HoldUnholdComponent = (props: {
    setState: Dispatch<SetStateAction<IHoldUnholdProps>>
    state: IHoldUnholdProps
}) => {
    const [form] = Form.useForm();
    const { holdJobTask } = HoldJobTask();
    const [parseCronExpr, parseCronExprResult] = ParseCronExpression();

    const [withInterval, setWithInterval] = useState(false);
    const [showListCron, setShowListCron] = useState(false);
    const [status, setStatus] = useState(["HOLD", "UNHOLD"]);

    const submitData = (values: any) => {
        console.log("form val:", values);
        holdJobTask({
            variables: {
                task_name: props.state.taskName,
                is_auto_switch: values.is_auto_switch,
                switch_interval: values.switch_interval,
                first_switch: values.first_switch ? values.first_switch : null
            }
        })
        setWithInterval(false);
        setShowListCron(false);
        props.setState({ visible: false, taskName: props.state.taskName, isHold: !props.state.isHold });
    }

    return (
        <Modal
            destroyOnClose={true}
            title={`Set "${props.state.isHold ? "Unhold" : "Hold"}" for task "${props.state.taskName}"`}
            visible={props.state.visible}
            confirmLoading={false}
            onCancel={() => {
                form.resetFields();
                setWithInterval(false);
                setShowListCron(false);
                props.setState({ visible: false, taskName: "", isHold: props.state.isHold });
            }}
            width={700}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        submitData(values);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
            okText={withInterval ? "Submit" : props.state.isHold ? "UNHOLD" : "HOLD"}
        >
            <Form form={form}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }} name="formHoldUnhold"
                initialValues={{
                    "is_auto_switch": false,
                    "switch_interval": "",
                    "first_switch": !props.state.isHold ? "HOLD" : "UNHOLD"
                }}>

                <Form.Item name="is_auto_switch" label="Auto switch hold/unhold:">
                    <Switch onChange={(checked: boolean) => {
                        if (!props.state.isHold) { setStatus(["UNHOLD", "HOLD"]) }
                        setWithInterval(checked);
                    }} />
                </Form.Item>
                {withInterval ?
                    <Form.Item name="switch_interval" label="Switch interval (cron expression):"
                        rules={[{ required: true && withInterval }]}
                        validateStatus={parseCronExprResult.called && !parseCronExprResult?.data ? "error" : ""}
                    >
                        <Input disabled={!withInterval} allowClear onChange={(val) => {
                            const expr = val.target.value.trim();
                            const el = expr.split(" ");
                            if (el.length >= 5) {
                                form.resetFields(["first_switch"])
                                if (!props.state.isHold) { setStatus(["HOLD", "UNHOLD"]) } else { setStatus(["UNHOLD", "HOLD"]) };
                                parseCronExpr({ variables: { expr: expr } });
                                console.log(parseCronExprResult)
                                setShowListCron(true);
                            } else {
                                setShowListCron(false);
                            }
                        }} />
                    </Form.Item>
                    : <></>}
                {showListCron && withInterval && parseCronExprResult?.data ? (
                    <Form.Item label="interval:" >
                        <List
                            loading={parseCronExprResult.loading}
                            size="small"
                            dataSource={parseCronExprResult?.data?.date}
                            renderItem={(item: string, index: number) => {
                                const st = status[index % 2];
                                const color = { "HOLD": "purple", "UNHOLD": "default" }
                                return (
                                    <>
                                        <List.Item>
                                            <b>{item}</b> <Tag icon={st == "HOLD" ? <PauseOutlined /> : <CaretRightOutlined />} color={color[st]}>{st.toUpperCase()}</Tag>
                                        </List.Item>
                                        {index === parseCronExprResult?.data?.date?.length - 1 ? (
                                            <List.Item>...</List.Item>
                                        ) : ""}
                                    </>
                                )
                            }}
                        />
                    </Form.Item>
                ) : <></>}
                {showListCron && !parseCronExprResult.loading ? (
                    <Form.Item name="first_switch" label="First switch:" rules={[{ required: true && withInterval }]}>
                        <Radio.Group optionType="button" buttonStyle="solid" disabled={!withInterval} options={[
                            { label: "HOLD", value: "HOLD" }, { label: "UNHOLD", value: "UNHOLD" },
                        ]} onChange={({ target: { value } }: RadioChangeEvent) => {
                            if (value == "HOLD") { setStatus(["HOLD", "UNHOLD"]) }
                            else if (value == "UNHOLD") { setStatus(["UNHOLD", "HOLD"]) }
                        }} />
                    </Form.Item>
                ) : ""}
            </Form>
        </Modal>
    );
}