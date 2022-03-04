import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Divider, Space, Modal, Tooltip, Layout, Input, DatePicker, Select, Form } from 'antd';
import { LeftOutlined, PlusOutlined, ClearOutlined, StopOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TableComponent from './Table';
import ModalAddJob from './AddJob';
import { SubscribeTaskJobList, StopAllJob, RetryAllJob } from './graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import { TableProps, ITaskListParam, ModalProps, MetaProps, ITaskComponentProps } from './interface';
import Meta from './Meta';
import { GetTagLine } from "../dashboard/graphql";
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import moment from 'moment';
import { getQueryVariable } from '../../utils/helper';

const { confirm } = Modal;

const { Content } = Layout;

const TaskComponent = (props: ITaskComponentProps) => {
    const router = useRouter();
    let task_name = router.query["task_name"];
    if (!task_name) {
        task_name = getQueryVariable("task_name") || null;
    }
    const [modalAddJobVisible, setModalAddJobVisible] = useState(false);
    const [jobStatus, setJobStatus] = useState<string[]>([]);
    const [paramsTaskList, setParamsTaskList] = useState<ITaskListParam>({
        loading: false,
        page: 1,
        limit: 10,
        taskName: task_name as string,
        search: null,
        status: jobStatus,
        startDate: null,
        endDate: null
    });

    const { cleanJob } = CleanJobGraphQL();
    const { stopAllJob } = StopAllJob();
    const { retryAllJob } = RetryAllJob();
    const dataTagline = GetTagLine();
    const { data, loading, error } = SubscribeTaskJobList(paramsTaskList);
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
    const meta = data?.listen_task_job_detail?.meta;
    if (meta?.is_close_session) {
        Modal.error({
            title: 'Session expired, refresh page',
            content: (
                <p>Please refresh page</p>
            ),
            onOk() {
                router.push({
                    pathname: "/"
                })
            },
            maskClosable: true,
        })
    }

    const showAlertConfirm = (title: string, taskName: string, action: string) => {
        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if (action === "CLEAN") {
                    cleanJob({ variables: { taskName: taskName } });
                } else if (action === "STOP") {
                    stopAllJob({ variables: { taskName: taskName } });
                }
            },
            onCancel() {
            },
        });
    }

    const propsMeta: MetaProps = {
        params: paramsTaskList,
        meta: meta,
        setLoadData: setParamsTaskList,
        setJobStatus: setJobStatus,
    }

    const propsTable: TableProps = {
        data: data?.listen_task_job_detail?.data,
        meta: meta,
        setLoadData: setParamsTaskList,
        setJobStatus: setJobStatus,
        loading: loading,
        defaultSort: "desc",
        defaultOrder: "",
        params: paramsTaskList,
        showJobId: getQueryVariable("job_id"),
    };

    const propsModal: ModalProps = {
        taskName: paramsTaskList.taskName,
        visible: modalAddJobVisible,
        setVisible: setModalAddJobVisible,
    }

    const propsFooter: IFooterComponentProps = {
        serverStartedAt: dataTagline?.tagline?.start_at,
        version: dataTagline?.tagline?.version,
        buildNumber: dataTagline?.tagline?.build_number,
    }

    const [form] = Form.useForm();
    const onApplyFilter = () => {
        form.validateFields().then(values => {
            let startDate, endDate: string;
            if (values?.dateRange?.length == 2) {
                startDate = values?.dateRange[0].format("YYYY-MM-DDTHH:mm:ssZ");
                endDate = values?.dateRange[1].format("YYYY-MM-DDTHH:mm:ssZ")
            }
            setParamsTaskList({
                loading: paramsTaskList.loading,
                page: 1,
                limit: paramsTaskList.limit,
                taskName: paramsTaskList.taskName,
                search: values?.search,
                status: values?.status ? [values?.status] : [],
                startDate: startDate,
                endDate: endDate
            })
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    }

    const { Option } = Select;

    return (
        <>
            <Layout style={{ minHeight: "88vh" }}>
                <Content style={{ padding: '10px 50px' }}>
                    <Row>
                        <Col span={24}>
                            <div className="text-center">
                                <h3>Task Name:</h3> <h2><pre><b>{props.taskName}</b></pre></h2>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Divider orientation="left" />
                        <Col span={24}>
                            <Meta {...propsMeta} />
                        </Col>
                    </Row>

                    <Row>
                        <Divider orientation="left" />
                        <Col span={14}>
                            <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                                router.push({
                                    pathname: "/",
                                })
                            }}>Back to dashboard</Button>
                        </Col>
                        <Col span={9}>
                            <Row justify="end" gutter={[48, 16]}>
                                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                                    <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                        icon={<PlusOutlined />}
                                        size="middle"
                                        type="primary"
                                        onClick={() => { setModalAddJobVisible(true) }}>Add Job<span>&nbsp;&nbsp;</span></Button>
                                    <Tooltip title="Retry all failure and stopped job">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            icon={<SyncOutlined />}
                                            size="middle"
                                            type="primary"
                                            onClick={() => {
                                                retryAllJob({ variables: { taskName: paramsTaskList.taskName } });
                                            }}>Retry All<span>&nbsp;&nbsp;</span></Button>
                                    </Tooltip>
                                </Space>
                            </Row>
                            <Row justify="end" gutter={48}>
                                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                                    <Tooltip title="Clear all success, failure, and stopped job" placement="bottom">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            icon={<ClearOutlined />}
                                            danger
                                            size="middle"
                                            onClick={() => {
                                                showAlertConfirm(
                                                    "Are you sure clear all success, failure, and stopped job in this task?",
                                                    paramsTaskList.taskName,
                                                    "CLEAN"
                                                );
                                            }}>Clear Job</Button>
                                    </Tooltip>
                                    <Tooltip title="Stop all running and queued job" placement="bottom">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            icon={<StopOutlined />}
                                            danger
                                            size="middle"
                                            onClick={() => {
                                                showAlertConfirm(
                                                    "Are you sure stop all running and queued job in this task?",
                                                    paramsTaskList.taskName,
                                                    "STOP"
                                                );
                                            }}>Stop All<span>&nbsp;&nbsp;&nbsp;</span></Button>
                                    </Tooltip>
                                </Space>
                            </Row>
                        </Col>
                        <Divider orientation="left" />
                    </Row>

                    <Row justify="center">
                        <Form
                            form={form} layout="inline" name="formFilterJob">
                            <Form.Item name="search" label="Search:">
                                <Input allowClear placeholder="Search args..." />
                            </Form.Item>
                            <Form.Item name="status" label="Status:">
                                <Select
                                    allowClear
                                    placeholder="Select status"
                                >
                                    <Option value='SUCCESS' >Success</Option>
                                    <Option value='RETRYING' >Running/Retrying</Option>
                                    <Option value='QUEUEING' >Queueing</Option>
                                    <Option value='FAILURE' >Failure</Option>
                                    <Option value='STOPPED' >Stopped</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="dateRange" label="Created At:">
                                <DatePicker.RangePicker
                                    showTime={{
                                        format: 'HH:mm:ss',
                                        defaultValue: [moment().startOf('day'), moment().endOf('day')],
                                    }}
                                    format="YYYY-MM-DDTHH:mm:ssZ"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="ghost" size="middle" onClick={() => { onApplyFilter() }}>Apply Filter</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="link" size="middle" onClick={() => {
                                    form.resetFields();
                                    onApplyFilter();
                                }}>Clear Filter</Button>
                            </Form.Item>
                        </Form>
                    </Row>
                    <Row>
                        <Divider orientation="left" />
                        <Col span={24}>
                            <ModalAddJob {...propsModal} />
                            <TableComponent {...propsTable} />
                        </Col>
                    </Row>
                </Content>
            </Layout>
            <FooterComponent {...propsFooter} />
        </>
    );
};

export default TaskComponent;
