import { SubscribeTaskList, CleanJobGraphQL, GetTagLine, ClearAllClientSubscriber } from './graphql';
import TableComponent from './Table';
import { TableProps } from './interface';
import { Modal, Layout, Tag, Space, Tooltip } from 'antd';

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
    const { cleanJob } = CleanJobGraphQL();
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
        cleanJob: cleanJob,
        loading: loading,
        defaultOrder: "",
        defaultSort: "desc",
        loadData: loadData,
    };

    return (
        <>
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
            <Footer style={{ textAlign: 'center' }}>candi version <b>{dataTagline?.tagline?.version}</b></Footer>
        </>
    );
};

export default DashboardComponent;