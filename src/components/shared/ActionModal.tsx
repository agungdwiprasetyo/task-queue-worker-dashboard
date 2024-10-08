import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Row, Switch, notification } from 'antd';
import { ITaskListParam } from '../task/interface';
import { AddJob, GetCountJob, RetryAllJob } from 'src/graphql';
import { toMinifyJSON } from '../../utils/helper';
import { CleanJobGraphQL } from 'src/graphql';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';

export interface ModalProps {
    task_name: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export const ModalAddJob = (props: ModalProps) => {
    const addJobGql = AddJob();
    useEffect(() => {
        if (addJobGql.error && addJobGql.error?.message != "") {
            notification.error({
                message: "Cannot Add Job",
                description: addJobGql.error.message.replace("GraphQL error: ", "")
            })
        }
    }, [addJobGql.error]);
    const [form] = Form.useForm();
    const [cronMode, setCronMode] = useState(false);

    const handleCancel = () => {
        form.resetFields();
        setCronMode(false);
        props.setVisible(false);
    };
    const onCreate = (values: any) => {
        addJobGql.addJob({
            variables: {
                param: {
                    task_name: props.task_name,
                    max_retry: values?.max_retry ? values?.max_retry : 0,
                    args: values?.args ? toMinifyJSON(values?.args) : "",
                    cron_expression: values?.cron_expression
                }
            }
        });
        setCronMode(false);
        props.setVisible(false);
    }

    return (
        <Modal
            title={`Add job for task "${props.task_name}"`}
            visible={props.visible}
            onCancel={handleCancel}
            width={1000}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form form={form} labelCol={{ span: 4 }}
                layout="horizontal" name="formAddJob"
                initialValues={{ 'max_retry': 1 }} >
                <Form.Item name="cron" label="Cron">
                    <Switch onChange={(checked: boolean) => { setCronMode(checked) }} />
                </Form.Item>
                {cronMode ?
                    (<Form.Item name="cron_expression" label="Cron Expression:" rules={[{ required: true && cronMode }]}>
                        <Input />
                    </Form.Item>)
                    : (<Form.Item name="max_retry" label="Max Retry:" rules={[{ required: true && !cronMode }]}>
                        <InputNumber min={1} />
                    </Form.Item>)
                }
                <Form.Item name="args" label="Argument / Message:" rules={[{ required: true && !cronMode }]}>
                    <Input.TextArea rows={15} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export interface IModalMutateJobProps {
    action: string;
    task_list_param: ITaskListParam;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export const ModalMutateJob = (props: IModalMutateJobProps) => {
    if (!props.visible) {
        return (<></>);
    }

    const [getCountJob, countJob] = GetCountJob(props.task_list_param);

    const { cleanJob } = CleanJobGraphQL();
    const { retryAllJob } = RetryAllJob();

    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        props.setVisible(false);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            form.resetFields();

            const actionMap = {
                CLEAN: cleanJob,
                RETRY: retryAllJob
            }

            let start_date, end_date: string;
            if (values?.date_range?.length == 2) {
                start_date = values?.date_range[0].format("YYYY-MM-DDTHH:mm:ssZ");
                end_date = values?.date_range[1].format("YYYY-MM-DDTHH:mm:ssZ")
            }
            const variable = {
                task_name: props.task_list_param.task_name,
                search: values?.search,
                statuses: values?.status ? values?.status : [],
                start_date: start_date,
                end_date: end_date
            }

            actionMap[props.action]({ variables: { filter: variable } })
            props.setVisible(false);

        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    }

    const onChangeForm = () => {
        let filter = { ...props.task_list_param }
        filter.search = form.getFieldValue("search");
        filter.statuses = form.getFieldValue("status") ? form.getFieldValue("status") : ["FAILURE", "STOPPED"];
        if (form.getFieldValue("date_range")?.length == 2) {
            filter.start_date = form.getFieldValue("date_range")[0].format("YYYY-MM-DDTHH:mm:ssZ");
            filter.end_date = form.getFieldValue("date_range")[1].format("YYYY-MM-DDTHH:mm:ssZ")
        }
        getCountJob({ variables: { filter: filter } })
    }

    if (!countJob.called) {
        let filter = { ...props.task_list_param }
        filter.statuses = props.task_list_param.statuses?.length > 0 ? props.task_list_param.statuses : ["FAILURE", "STOPPED"];
        getCountJob({ variables: { filter: filter } })
    }

    let searchTimer;
    const [countLoading, setCountLoading] = useState<boolean>(countJob.loading);

    return (
        <Modal
            title="Select filter:"
            visible={props.visible}
            onCancel={handleCancel}
            width={700}
            okText={props.action}
            onOk={handleSubmit}
            okButtonProps={{ disabled: countLoading || countJob?.data?.get_count_job == 0 }}
        >
            <Row>
                <Form form={form} layout="vertical" name="formAddJob"
                    initialValues={{
                        'search': props.task_list_param.search,
                        'status': props.task_list_param.statuses?.length > 0 ? props.task_list_param.statuses : ["FAILURE", "STOPPED"],
                        'date_range': props.task_list_param.start_date && props.task_list_param.end_date ? [
                            moment(new Date(props.task_list_param.start_date)), moment(new Date(props.task_list_param.end_date))
                        ] : []
                    }}
                >
                    <Form.Item name="search" label="Search:" initialValue={props.task_list_param.search}>
                        <Input.Search allowClear
                            onChange={() => {
                                setCountLoading(true);
                                clearTimeout(searchTimer);
                                searchTimer = setTimeout(() => {
                                    onChangeForm();
                                    setCountLoading(false);
                                }, 1500)
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="status" label="Status:" rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Select status"
                            onChange={onChangeForm}
                        >
                            <Select.Option key='SUCCESS' value='SUCCESS'>SUCCESS</Select.Option>
                            <Select.Option key='FAILURE' value='FAILURE'>FAILURE</Select.Option>
                            <Select.Option key='STOPPED' value='STOPPED'>STOPPED</Select.Option>
                            <Select.Option key='HOLD' value='HOLD'>HOLD</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="date_range" label="Created At:">
                        <DatePicker.RangePicker
                            style={{ minWidth: 650, maxWidth: 650 }}
                            showTime={{
                                format: 'HH:mm:ss',
                                defaultValue: [moment().startOf('day'), moment().endOf('day')],
                            }}
                            format="YYYY-MM-DDTHH:mm:ssZ"
                            onChange={onChangeForm}
                        />
                    </Form.Item>
                </Form>
            </Row>
            <Row justify='end'>
                {countLoading ?
                    (<><LoadingOutlined spin={true} /> </>)
                    :
                    (<b>Found {countJob?.data?.get_count_job} jobs</b>)
                }
            </Row>
        </Modal>
    );
}
