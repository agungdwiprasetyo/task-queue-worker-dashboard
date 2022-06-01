import React from 'react';
import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import moment from 'moment';
import { ITaskListParam, IFormFilterProps } from 'src/components/task/interface';

const FormFilter = (props: IFormFilterProps) => {

    const [form] = Form.useForm();
    const onApplyFilter = () => {
        form.validateFields().then(values => {
            let startDate, endDate: string;
            if (values?.dateRange?.length == 2) {
                startDate = values?.dateRange[0].format("YYYY-MM-DDTHH:mm:ssZ");
                endDate = values?.dateRange[1].format("YYYY-MM-DDTHH:mm:ssZ")
            }

            const param: ITaskListParam = {
                loading: props.params.loading,
                page: 1,
                limit: props.params.limit,
                taskName: props.params.taskName,
                search: values?.search,
                jobId: null,
                status: values?.status ? values?.status : [],
                startDate: startDate,
                endDate: endDate
            }
            props.setParam(param)

        }).catch(info => { });
    }

    return (
        <Form form={form} layout="inline" name="formFilterJob">
            <Form.Item name="search" label="Search:">
                <Input.Search allowClear
                    placeholder="Search args/error..."
                    onSearch={onApplyFilter}
                />
            </Form.Item>
            <Form.Item name="status" label="Status:">
                <Select
                    style={{ minWidth: 140, maxWidth: 140 }}
                    mode="multiple"
                    allowClear
                    placeholder="Select status"
                >
                    <Select.Option value='SUCCESS'>Success</Select.Option>
                    <Select.Option value='RETRYING'>Running</Select.Option>
                    <Select.Option value='QUEUEING'>Queueing</Select.Option>
                    <Select.Option value='FAILURE'>Failure</Select.Option>
                    <Select.Option value='STOPPED'>Stopped</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="dateRange" label="Created At:">
                <DatePicker.RangePicker
                    showTime={{
                        format: 'HH:mm:ss',
                        defaultValue: [moment().startOf('day'), moment().endOf('day')],
                    }}
                    format="YYYY-MM-DDTHH:mm:ssZ"
                    style={{ minWidth: 330, maxWidth: 330 }}
                />
            </Form.Item>
            <Form.Item>
                <Space direction='vertical'>
                    <Button type="ghost" size="middle" onClick={() => { onApplyFilter() }}>
                        Apply Filter
                    </Button>
                    {props.isFilterActive ?
                        <Button type="link" size="middle" onClick={() => {
                            form.resetFields();
                            onApplyFilter();
                        }}>
                            Clear Filter
                        </Button> : <></>}
                </Space>
            </Form.Item>
        </Form>
    )
}

export default FormFilter;
