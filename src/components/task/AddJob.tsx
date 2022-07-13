import * as React from 'react';
import { Modal, Form, Input, InputNumber, } from 'antd';
import { ModalProps } from './interface';
import { AddJob } from './graphql';
import { toMinifyJSON } from '../../utils/helper';

const ModalAddJob = (props: ModalProps) => {
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

    const modalTitle = `Add job for task "${props.task_name}"`;
    return (
        <Modal
            title={modalTitle}
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
            <Form
                form={form} layout="vertical" name="formAddJob">
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

export default ModalAddJob;