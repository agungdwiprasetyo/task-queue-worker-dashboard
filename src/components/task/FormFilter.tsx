import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import moment from 'moment';
import { ITaskListParam, IFormFilterProps } from 'src/components/task/interface';

const FormFilter = (props: IFormFilterProps) => {

    const [isFilterActive, setIsFilterActive] = useState(
        (props.params?.search?.length > 0) ||
        (props.params?.startDate?.length > 0 && props.params?.endDate?.length > 0) ||
        (props.params?.status?.length > 0) ||
        (props.params?.jobId?.length > 0)
    );

    useEffect(() => {
        setIsFilterActive(
            (props.params?.search?.length > 0) ||
            (props.params?.startDate?.length > 0 && props.params?.endDate?.length > 0) ||
            (props.params?.status?.length > 0) ||
            (props.params?.jobId?.length > 0)
        )
    }, [props.params])

    const [form] = Form.useForm();
    const onApplyFilter = () => {
        form.validateFields().then(values => {
            let startDate, endDate: string;
            if (values?.dateRange?.length == 2) {
                startDate = values?.dateRange[0].format("YYYY-MM-DDTHH:mm:ssZ");
                endDate = values?.dateRange[1].format("YYYY-MM-DDTHH:mm:ssZ")
            }

            const param: ITaskListParam = {
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
            setIsFilterActive(
                (param.search?.length > 0) ||
                (param.startDate?.length > 0 && param.endDate?.length > 0) ||
                (param.status?.length > 0) ||
                (param.jobId?.length > 0)
            )
        });
    }

    const getFilterWording = (obj) => {
        console.log(obj?.search)
    }

    return (
        <Space direction='vertical'>
            <Form form={form} layout="inline" name="formFilterJob" >
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
                        onClear={onApplyFilter}
                    >
                        <Select.Option key='SUCCESS' value='SUCCESS'>Success</Select.Option>
                        <Select.Option key='RETRYING' value='RETRYING'>Running</Select.Option>
                        <Select.Option key='QUEUEING' value='QUEUEING'>Queueing</Select.Option>
                        <Select.Option key='FAILURE' value='FAILURE'>Failure</Select.Option>
                        <Select.Option key='STOPPED' value='STOPPED'>Stopped</Select.Option>
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
                    <Button type="ghost" size="middle" onClick={() => { onApplyFilter() }}>
                        Apply Filter
                    </Button>
                </Form.Item>
            </Form>
            {isFilterActive ?
                <>
                    <Row>
                        <Col span={18}>
                            <div style={{ marginTop: "5px" }}>
                                <b>{props.totalRecords}</b> results for <b>{
                                    props.params?.status?.length > 0 ? props.params?.status?.join(", ") : "ALL"
                                }</b> status {
                                    props.params?.search?.length > 0 ? <>matching <b>{props.params?.search}</b></> : ""
                                } {
                                    (props.params?.startDate?.length > 0 && props.params?.endDate?.length > 0) ?
                                        <>when created at between <b>{props.params?.startDate}</b> and <b>{props.params?.endDate}</b></>
                                        : ""
                                }
                            </div>
                        </Col>
                        <Col span={3} offset={3} className="text-center">
                            <Button type="link" size="middle" onClick={() => {
                                form.resetFields();
                                onApplyFilter();
                            }}>
                                Clear Filter
                            </Button>
                        </Col>
                    </Row>
                </>
                : <></>}
        </Space>
    )
}

export default FormFilter;
