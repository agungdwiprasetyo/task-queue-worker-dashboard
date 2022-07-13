import { useRouter } from 'next/router';
import { SubscribeTaskList, GetTagLine, ClearAllClientSubscriber } from './graphql';
import { StopAllJob, RetryAllJob } from '../task/graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import TableComponent from './Table';
import { TableProps } from './interface';
import { Modal, Layout, Tag, Space, Tooltip, Row, Col, notification } from 'antd';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import { Content } from 'antd/lib/layout/layout';
import { getQueryVariable } from '../../utils/helper';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, LoadingOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';

const DashboardComponent = (props: any) => {
    const router = useRouter();

    const { data, loading, error } = SubscribeTaskList(1, 10, null);
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

    const dataTagline = GetTagLine({ pollInterval: 15000 });
    const memStats = dataTagline?.tagline?.memory_statistics;

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
        metaTagline: dataTagline?.tagline
    };

    const propsFooter: IFooterComponentProps = {
        serverStartedAt: dataTagline?.tagline?.start_at,
        version: dataTagline?.tagline?.version,
        buildNumber: dataTagline?.tagline?.build_number,
        go_version: dataTagline?.tagline?.go_version,
    }

    if (dataTagline?.tagline?.dependency_health?.persistent) {
        notification.error({
            message: "Dependency Error!",
            description: dataTagline?.tagline?.dependency_health?.persistent,
            duration: 10
        })
    }
    if (dataTagline?.tagline?.dependency_health?.queue) {
        notification.error({
            message: "Dependency Error!",
            description: dataTagline?.tagline?.dependency_health?.queue,
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
            <Content style={{ minHeight: "88vh" }}>
                <Row justify="center">
                    <Col span={24}>
                        <div className="text-center mb-5">
                            <pre>{dataTagline?.tagline?.banner}</pre>
                            <pre>{dataTagline?.tagline?.tagline}</pre>
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
                        </div>
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