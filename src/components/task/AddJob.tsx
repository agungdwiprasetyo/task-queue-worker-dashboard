import * as React from 'react';
import { Modal, Button, Form, Input, InputNumber, } from 'antd';
import { ModalProps } from './interface';
import { AddJob } from './graphql';


const ModalAddJob = (props: ModalProps) => {
    const { addJob } = AddJob();
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        props.setVisible(false);
    };
    const onCreate = (values: any) => {
        console.log(values);
        addJob({ variables: { taskName: props.taskName, maxRetry: values?.max_retry, args: values?.args } });
        props.setVisible(false);
    }

    const modalTitle = `Add job for task "${props.taskName}"`;
    return (
        <Modal
            title={modalTitle}
            visible={props.visible}
            onCancel={handleCancel}
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
            <Form
                form={form} layout="vertical" name="formAddJob">
                <Form.Item name="max_retry" label="Max Retry" rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name="args" label="Arguments" rules={[{ required: true }]}>
                    <Input.TextArea rows={7} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalAddJob;