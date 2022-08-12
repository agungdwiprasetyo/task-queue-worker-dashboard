import { useRouter } from 'next/router';
import { SubscribeTaskList, GetDashboard, ClearAllClientSubscriber } from './graphql';
import { StopAllJob, RetryAllJob } from '../task/graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import TableComponent from './Table';
import { TableProps } from './interface';
import { Modal, Layout, Tag, Space, Tooltip, Row, Col, notification, Skeleton } from 'antd';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import { Content } from 'antd/lib/layout/layout';
import { getQueryVariable } from '../../utils/helper';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, LoadingOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { useState } from 'react';
import MenuOption from 'src/components/menu/MenuOption';

const DashboardComponent = (props: any) => {
    const router = useRouter();

    const [searchTask, setSearchTask] = useState(null);
    const { data, loading, error } = SubscribeTaskList(1, 10, searchTask);
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
    const { retryAllJob } = RetryAllJob();
    const { cleanJob } = CleanJobGraphQL();
    const { stopAllJob } = StopAllJob();
    const { clearClient } = ClearAllClientSubscriber();

    const page = parseInt(getQueryVariable("page")) > 0 ? parseInt(getQueryVariable("page")) : 1;
    const limit = parseInt(getQueryVariable("limit")) > 0 ? parseInt(getQueryVariable("limit")) : 7;
    const search = getQueryVariable("search") || "";

    const dashboardData = GetDashboard({ pollInterval: 15000 });
    const dataDashboard = dashboardData?.data;
    const memStats = dataDashboard?.dashboard?.memory_statistics;

    const content = {
        marginTop: '30px',
        marginLeft: '50px',
        marginRight: '50px',
    };

    const loadData = (params: any) => {
        // console.log(params)
    }

    const meta = data?.listen_task_dashboard?.meta;
    if (meta?.is_close_session) {
        router.push({
            pathname: "/expired"
        })
    }

    const propsTable: TableProps = {
        data: data?.listen_task_dashboard?.data,
        loading: loading,
        defaultOrder: "",
        defaultSort: "desc",
        retryAllJob: retryAllJob,
        cleanJob: cleanJob,
        stopAllJob: stopAllJob,
        loadData: loadData,
        page: page,
        limit: limit,
        search: search,
        metaTagline: dataDashboard?.dashboard,
        setSearchTask: setSearchTask
    };

    const propsFooter: IFooterComponentProps = {
        server_started_at: dataDashboard?.dashboard?.start_at,
        version: dataDashboard?.dashboard?.version,
        build_number: dataDashboard?.dashboard?.build_number,
        go_version: dataDashboard?.dashboard?.go_version,
        loading: dashboardData.loading,
        queue: dataDashboard?.dashboard?.dependency_detail?.queue_type,
        persistent: dataDashboard?.dashboard?.dependency_detail?.persistent_type,
        queue_error: dataDashboard?.dashboard?.dependency_health?.queue,
        persistent_error: dataDashboard?.dashboard?.dependency_health?.persistent,
    }

    if (dataDashboard?.dashboard?.dependency_health?.persistent) {
        notification.error({
            message: "Dependency Error!",
            description: dataDashboard?.dashboard?.dependency_health?.persistent,
            duration: 10
        })
    }
    if (dataDashboard?.dashboard?.dependency_health?.queue) {
        notification.error({
            message: "Dependency Error!",
            description: dataDashboard?.dashboard?.dependency_health?.queue,
            duration: 10
        })
    }

    const onTagClicked = (status: string) => {
        router.push({
            pathname: "/task",
            query: { statuses: status }
        })
    }

    return (
        <Layout>
            <Content style={{ minHeight: "87vh" }}>
                <Row justify="center">
                    <Col span={2}></Col>
                    <Col span={20}>
                        <div className="text-center mb-5">
                            {dashboardData.loading ? (
                                <div style={{ width: "50%", margin: "0 auto" }}>
                                    <Skeleton active />
                                </div>
                            ) : (
                                <>
                                    <pre>{dataDashboard?.dashboard?.banner}</pre>
                                    <pre>{dataDashboard?.dashboard?.tagline}</pre>
                                    <pre>
                                        Memory Alloc: <b>{memStats?.alloc}</b> |
                                        Total Alloc: <b>{memStats?.total_alloc}</b> |
                                        Num Goroutines: <b>{memStats?.num_goroutines}</b>
                                    </pre>
                                    <pre>
                                        <Space>
                                            Total Client Subscriber:<b>{data?.listen_task_dashboard?.meta?.total_client_subscriber}</b>
                                            <Tooltip title="close all client subscriber session"><Tag style={{
                                                cursor: 'pointer'
                                            }} color="default" onClick={() => { clearClient() }}>clear</Tag></Tooltip>
                                        </Space>
                                    </pre>
                                </>
                            )}
                        </div>
                    </Col>
                    <Col span={2} style={{ marginTop: "10px" }}>
                        <MenuOption />
                    </Col>
                </Row>
                <Row>
                    <Col span={24} >
                        <div className="text-center" style={{ fontWeight: "bold" }}>
                            <Space>
                                <Tag style={{ cursor: 'pointer' }} key={"all_job"} icon={<CheckCircleOutlined />} color="magenta"
                                    onClick={() => { onTagClicked("") }}>
                                    Total All Jobs:  {props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { total_jobs }) => n + total_jobs, 0)}
                                </Tag>
                                <Tag style={{ cursor: 'pointer' }} key={"queueing"} icon={<ClockCircleOutlined />} color="default"
                                    onClick={() => { onTagClicked("QUEUEING") }}>
                                    All Queued:  {props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.queueing, 0)}
                                </Tag>
                                <Tag style={{ cursor: 'pointer' }} key={"retrying"} color="geekblue" icon={<SyncOutlined />}
                                    onClick={() => { onTagClicked("RETRYING") }}>
                                    All Running:  {props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.retrying, 0)}
                                </Tag>
                                <Tag style={{ cursor: 'pointer' }} key={"success"} icon={<CheckCircleOutlined />} color="green"
                                    onClick={() => { onTagClicked("SUCCESS") }}>
                                    All Succeeded:  {props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.success, 0)}
                                </Tag>
                                <Tag style={{ cursor: 'pointer' }} key={"failure"} icon={<CloseCircleOutlined />} color="error"
                                    onClick={() => { onTagClicked("FAILURE") }}>
                                    All Failed:  {props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.failure, 0)}
                                </Tag>
                                <Tag style={{ cursor: 'pointer' }} key={"stopped"} icon={<StopOutlined />} color="warning"
                                    onClick={() => { onTagClicked("STOPPED") }}>
                                    All Stopped:  {props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.stopped, 0)}
                                </Tag>
                            </Space>
                        </div>
                    </Col>
                </Row>
                <div style={content}>
                    <div className="text-center mb-5">
                        <TableComponent {...propsTable} />
                    </div>
                </div>
            </Content>
            <FooterComponent {...propsFooter} />
        </Layout>
    );
};

export default DashboardComponent;