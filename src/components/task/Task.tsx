import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Divider, Space, Modal, Tooltip, Layout } from 'antd';
import { LeftOutlined, PlusOutlined, ClearOutlined, StopOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TableComponent from './Table';
import ModalAddJob from './AddJob';
import { SubscribeTaskJobList, StopAllJob, RetryAllJob } from './graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import { TableProps, ITaskListParam, ModalProps, MetaProps, ITaskComponentProps, IFormFilterProps } from './interface';
import Meta from './Meta';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import { getQueryVariable, setQueryVariable } from '../../utils/helper';
import FormFilter from 'src/components/task/FormFilter';
import { Content } from 'antd/lib/layout/layout';

const TaskComponent = (props: ITaskComponentProps) => {
    const router = useRouter();

    const task_name = getQueryVariable("task_name");
    const page = parseInt(getQueryVariable("page")) > 0 ? parseInt(getQueryVariable("page")) : 1;
    const search = getQueryVariable("search") || null;
    const statuses = getQueryVariable("statuses") != "" ? getQueryVariable("statuses").split(",") : [];
    const start_date = getQueryVariable("start_date") || "";
    const end_date = getQueryVariable("end_date") || "";
    const job_id = getQueryVariable("job_id") || null;

    const [modalAddJobVisible, setModalAddJobVisible] = useState(false);
    const [paramsTaskList, setParamsTaskList] = useState<ITaskListParam>({
        page: page,
        limit: 10,
        task_name: task_name,
        job_id: job_id,
        search: search,
        statuses: statuses,
        start_date: start_date != "" ? start_date : null,
        end_date: end_date != "" ? end_date : null
    });

    const { cleanJob } = CleanJobGraphQL();
    const { stopAllJob } = StopAllJob();
    const { retryAllJob } = RetryAllJob();
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
    const meta = data?.listen_all_job?.meta;
    if (meta?.is_close_session) {
        router.push({
            pathname: "/expired"
        })
    }

    const showAlertConfirm = (title: string, task_name: string, action: string) => {
        const actionMap = {
            CLEAN: cleanJob,
            STOP: stopAllJob
        }
        Modal.confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() { actionMap[action]({ variables: { task_name: task_name } }) },
            onCancel() {
            },
        });
    }

    const onChangeParam = (param: ITaskListParam) => {
        let queryParam = {}
        if (param.task_name && param.task_name != "") {
            queryParam["task_name"] = param.task_name
        }
        if (param.page > 0) {
            queryParam["page"] = param.page
        }
        if (param.search && param.search != "") {
            queryParam["search"] = encodeURI(param.search)
        }
        if (param.start_date && param.start_date != "") {
            queryParam["start_date"] = param.start_date
        }
        if (param.end_date && param.end_date != "") {
            queryParam["end_date"] = param.end_date
        }
        if (param.statuses?.length > 0) {
            queryParam["statuses"] = param.statuses?.join(",")
        }
        if (param.job_id && param.job_id != "") {
            queryParam["job_id"] = param.job_id
        }
        setParamsTaskList(param);
        window.history.replaceState(null, "", `task?${setQueryVariable(queryParam)}`);
    }

    const propsMeta: MetaProps = {
        loading: loading,
        params: paramsTaskList,
        meta: meta,
        setParam: onChangeParam,
    }

    const propsTable: TableProps = {
        data: data?.listen_all_job?.data,
        meta: meta,
        loading: loading,
        params: paramsTaskList,
        show_job_id: getQueryVariable("job_id"),
        task_name_param: props.task_name,
        setParam: onChangeParam,
    };

    const propsModal: ModalProps = {
        task_name: paramsTaskList.task_name,
        visible: modalAddJobVisible,
        setVisible: setModalAddJobVisible,
    }

    const propsFooter: IFooterComponentProps = null;

    const propsFormFilter: IFormFilterProps = {
        totalRecords: meta?.total_records,
        params: paramsTaskList,
        setParam: onChangeParam,
    }

    return (
        <Layout>
            <Content style={{ minHeight: "87vh", padding: '10px 50px' }}>
                <Row>
                    <Col span={24}>
                        <div className="text-center">
                            {props.task_name ?
                                (<><h3>Task Name:</h3> <h2><pre><b>{props.task_name}</b></pre></h2></>)
                                :
                                (<h1><pre><b>All Task</b></pre></h1>)
                            }
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
                    <Col span={9}>
                        <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                            router.push({
                                pathname: "/",
                            })
                        }}>Back to dashboard</Button>
                    </Col>
                    <Col span={6}>
                        {meta?.is_freeze_broadcast ? (
                            <div className="text-center" style={{ color: "#f5222d" }}>Freeze Mode</div>
                        ) : (<></>)
                        }
                    </Col>
                    {props.task_name ?
                        <Col span={8}>
                            <Row justify="end" gutter={[48, 16]}>
                                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                                    <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                        disabled={loading || meta?.is_loading}
                                        icon={<PlusOutlined />}
                                        size="middle"
                                        type="primary"
                                        onClick={() => { setModalAddJobVisible(true) }}>Add Job<span>&nbsp;&nbsp;</span></Button>
                                    <Tooltip title="Retry all failure and stopped job">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            disabled={loading || meta?.is_loading}
                                            icon={<SyncOutlined />}
                                            size="middle"
                                            type="primary"
                                            onClick={() => {
                                                retryAllJob({ variables: { task_name: paramsTaskList.task_name } });
                                            }}>Retry All<span>&nbsp;&nbsp;</span></Button>
                                    </Tooltip>
                                </Space>
                            </Row>
                            <Row justify="end" gutter={48}>
                                <Space style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }} align="baseline">
                                    <Tooltip title="Clear all success, failure, and stopped job" placement="bottom">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            disabled={loading || meta?.is_loading}
                                            icon={<ClearOutlined />}
                                            danger
                                            size="middle"
                                            onClick={() => {
                                                showAlertConfirm(
                                                    "Are you sure clear all success, failure, and stopped job in this task?",
                                                    paramsTaskList.task_name,
                                                    "CLEAN"
                                                );
                                            }}>Clear Job</Button>
                                    </Tooltip>
                                    <Tooltip title="Stop all running and queued job" placement="bottom">
                                        <Button style={{ marginBottom: "2px", marginTop: "2px" }}
                                            disabled={loading || meta?.is_loading}
                                            icon={<StopOutlined />}
                                            danger
                                            size="middle"
                                            onClick={() => {
                                                showAlertConfirm(
                                                    "Are you sure stop all running and queued job in this task?",
                                                    paramsTaskList.task_name,
                                                    "STOP"
                                                );
                                            }}>Stop All<span>&nbsp;&nbsp;&nbsp;</span></Button>
                                    </Tooltip>
                                </Space>
                            </Row>
                        </Col>
                        : ""
                    }
                </Row>

                <Row justify="center">
                    <Divider orientation="left" />
                    <FormFilter {...propsFormFilter} />
                </Row>

                <Row>
                    <Divider orientation="left" />
                    <Col span={24}>
                        <ModalAddJob {...propsModal} />
                        <TableComponent {...propsTable} />
                    </Col>
                </Row>
            </Content>
            <FooterComponent {...propsFooter} />
        </Layout>
    );
};

export default TaskComponent;
