import { SubscribeTaskList, GetTagLine, ClearAllClientSubscriber } from './graphql';
import { StopAllJob, RetryAllJob } from '../task/graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import TableComponent from './Table';
import { TableProps } from './interface';
import { Modal, Layout, Tag, Space, Tooltip, Row, Col } from 'antd';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import { Content } from 'antd/lib/layout/layout';
import { getQueryVariable } from '../../utils/helper';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, LoadingOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';

const DashboardComponent = (props: any) => {
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

    const dataTagline = GetTagLine({ pollInterval: 10000 });
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
        Modal.error({
            title: 'Session expired, refresh page',
            content: (
                <p>Please refresh page</p>
            ),
            onOk() {
                location.reload();
            },
            maskClosable: true,
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
                        <div className="text-center" style={{ transform: "scale(1.1)" }}>
                            <Space>
                                <Tag key={"all_job"} icon={<CheckCircleOutlined />} color="magenta">
                                    Total All Jobs:  <b>{props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { total_jobs }) => n + total_jobs, 0)}</b>
                                </Tag>
                                <Tag key={"queueing"} icon={<ClockCircleOutlined />} color="default">
                                    All Queued:  <b>{props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.queueing, 0)}</b>
                                </Tag>
                                <Tag key={"retrying"} color="geekblue" icon={<SyncOutlined />} >
                                    All Running:  <b>{props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.retrying, 0)}</b>
                                </Tag>
                                <Tag key={"success"} icon={<CheckCircleOutlined />} color="green">
                                    All Succeeded:  <b>{props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.success, 0)}</b>
                                </Tag>
                                <Tag key={"failure"} icon={<CloseCircleOutlined />} color="error">
                                    All Failed:  <b>{props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.failure, 0)}</b>
                                </Tag>
                                <Tag key={"stopped"} icon={<StopOutlined />} color="warning">
                                    All Stopped:  <b>{props.loading ? <LoadingOutlined spin={true} /> :
                                        data?.listen_task_dashboard?.data?.reduce((n, { detail }) => n + detail?.stopped, 0)}</b>
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