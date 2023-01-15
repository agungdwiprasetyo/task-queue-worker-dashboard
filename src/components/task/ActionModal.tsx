import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { IModalMutateJobProps, ModalProps } from './interface';
import { AddJob, RetryAllJob } from './graphql';
import { toMinifyJSON } from '../../utils/helper';
import { CleanJobGraphQL } from 'src/components/dashboard/graphql';
import moment from 'moment';

export const ModalAddJob = (props: ModalProps) => {
    const { addJob } = AddJob();
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        props.setVisible(false);
    };
    const onCreate = (values: any) => {
        addJob({
            variables: {
                param: {
                    task_name: props.task_name, max_retry: values?.max_retry, args: toMinifyJSON(values?.args)
                }
            }
        });
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
            <Form form={form} layout="vertical" name="formAddJob"
                initialValues={{
                    'max_retry': 1,
                }} >
                <Form.Item name="max_retry" label="Max Retry:" rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name="args" label="Argument / Message:" rules={[{ required: true }]}>
                    <Input.TextArea rows={15} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export const ModalMutateJob = (props: IModalMutateJobProps) => {

    if (!props.visible) {
        return (<></>);
    }

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

    const [okText, setOkText] = useState<string>(`${props.action} ${props.count_job} jobs`);

    return (
        <Modal
            title="Select filter:"
            visible={props.visible}
            onCancel={handleCancel}
            width={700}
            okText={okText}
            onOk={handleSubmit}
        >
            <Form form={form} layout="vertical" name="formAddJob"
                initialValues={{
                    'search': props.task_list_param.search,
                    'status': props.task_list_param.statuses?.length > 0 ? props.task_list_param.statuses : ["FAILURE", "STOPPED"],
                    'date_range': props.task_list_param.start_date && props.task_list_param.end_date ? [
                        moment(new Date(props.task_list_param.start_date)), moment(new Date(props.task_list_param.end_date))
                    ] : []
                }}
                onChange={() => { setOkText(props.action) }}
            >
                <Form.Item name="search" label="Search:" initialValue={props.task_list_param.search}>
                    <Input />
                </Form.Item>
                <Form.Item name="status" label="Status:" rules={[{ required: true }]}>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Select status"
                        onChange={() => { setOkText(props.action) }}
                    >
                        <Select.Option key='SUCCESS' value='SUCCESS'>SUCCESS</Select.Option>
                        <Select.Option key='FAILURE' value='FAILURE'>FAILURE</Select.Option>
                        <Select.Option key='STOPPED' value='STOPPED'>STOPPED</Select.Option>
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
                        onChange={() => { setOkText(props.action) }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
