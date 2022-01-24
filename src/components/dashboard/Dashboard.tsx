import { SubscribeTaskList, GetTagLine, ClearAllClientSubscriber } from './graphql';
import { RetryAllJob } from '../task/graphql';
import TableComponent from './Table';
import { TableProps } from './interface';
import { Modal, Layout, Tag, Space, Tooltip, Row } from 'antd';
import { IFooterComponentProps } from 'src/components/footer/interface';
import FooterComponent from 'src/components/footer/Footer';
import { Content } from 'antd/lib/layout/layout';

const { Footer } = Layout;

const DashboardComponent = (props: any) => {
    const { data, loading, error } = SubscribeTaskList();
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
    const { clearClient } = ClearAllClientSubscriber();

    const dataTagline = GetTagLine();
    const memStats = dataTagline?.tagline?.memory_statistics;

    const content = {
        marginTop: '30px',
        marginLeft: '50px',
        marginRight: '50px',
    };

    const loadData = (params: any) => {
        console.log(params)
    }

    const meta = data?.listen_task?.meta;
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
        data: data?.listen_task?.data,
        retryAllJob: retryAllJob,
        loading: loading,
        defaultOrder: "",
        defaultSort: "desc",
        loadData: loadData,
    };

    const propsFooter: IFooterComponentProps = {
        serverStartedAt: dataTagline?.tagline?.start_at,
        version: dataTagline?.tagline?.version,
        buildNumber: dataTagline?.tagline?.build_number,
    }

    return (
        <Layout>
            <Content style={{ minHeight: "88vh" }}>
                <div>
                    <div className="text-center mb-5">
                        <pre>{dataTagline?.tagline?.banner}</pre>
                        <pre>{dataTagline?.tagline?.tagline}</pre>
                        <pre>Memory Alloc: <b>{memStats?.alloc}</b>, Total Alloc: <b>{memStats?.total_alloc}</b>, Num Goroutines: <b>{memStats?.num_goroutines}</b></pre>
                        <pre>
                            <Space>Total Client Subscriber:<b>{data?.listen_task?.meta?.total_client_subscriber}</b>
                                <Tooltip title="close all client subscriber session"><Tag style={{
                                    cursor: 'pointer'
                                }} color="default" onClick={() => { clearClient() }}>clear</Tag></Tooltip>
                            </Space>
                        </pre>
                    </div>
                </div>
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