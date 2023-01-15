import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Divider, Modal, Layout } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import TableComponent from './Table';
import { SubscribeTaskJobList } from './graphql';
import { ITaskListParam, ITaskComponentProps } from './interface';
import Meta from './Meta';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import { getQueryVariable, setQueryVariable } from '../../utils/helper';
import FormFilter from 'src/components/task/FormFilter';
import { Content } from 'antd/lib/layout/layout';
import ActionComponent from 'src/components/task/Action';

const TaskComponent = (props: ITaskComponentProps) => {
    const router = useRouter();

    const task_name = getQueryVariable("task_name");
    const page = 1;
    const search = getQueryVariable("search") || null;
    const statuses = getQueryVariable("statuses") != "" ? getQueryVariable("statuses").split(",") : [];
    const start_date = getQueryVariable("start_date") || "";
    const end_date = getQueryVariable("end_date") || "";
    const job_id = getQueryVariable("job_id") || null;

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

    const onChangeParam = (param: ITaskListParam) => {
        let queryParam = {}
        if (param.task_name && param.task_name != "") {
            queryParam["task_name"] = param.task_name
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

    const propsFooter: IFooterComponentProps = null;

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
                        <Meta
                            loading={loading}
                            params={paramsTaskList}
                            meta={meta}
                            setParam={onChangeParam}
                        />
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
                            <ActionComponent
                                task_list_param={paramsTaskList}
                                is_loading_subscribe={loading}
                                is_loading={meta?.is_loading}
                                total_job={meta?.total_records}
                            />
                        </Col>
                        : ""
                    }
                </Row>

                <Row justify="center">
                    <Divider orientation="left" />
                    {loading ? <></> : (
                        <FormFilter
                            totalRecords={meta?.total_records}
                            params={paramsTaskList}
                            setParam={onChangeParam}
                        />
                    )}
                </Row>

                <Row justify="center">
                    <Divider orientation="left" />
                    <Col span={24}>
                        <TableComponent
                            data={data?.listen_all_job?.data}
                            meta={meta}
                            loading={loading}
                            params={paramsTaskList}
                            show_job_id={getQueryVariable("job_id")}
                            task_name_param={props.task_name}
                            setParam={onChangeParam}
                        />
                    </Col>
                </Row>
            </Content>
            <FooterComponent {...propsFooter} />
        </Layout>
    );
};

export default TaskComponent;
