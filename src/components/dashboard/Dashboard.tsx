import { SubscribeTaskList, CleanJobGraphQL, GetTagLine } from './graphql';
import TableComponent from './Table';
import { TableProps } from './interface';
import { Modal, Layout } from 'antd';

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
            <Layout style={{ height: "100vh" }}>
                <div>
                    <div className="text-center mb-5">
                        <pre>{dataTagline?.tagline?.banner}</pre>
                        <pre>{dataTagline?.tagline?.tagline}</pre>
                        <pre>Memory Alloc: <b>{memStats?.alloc}</b>, Total Alloc: <b>{memStats?.total_alloc}</b>, Num Goroutines: <b>{memStats?.num_goroutines}</b></pre>
                    </div>
                </div>
                <div style={content}>
                    <div className="text-center mb-5">
                        <TableComponent {...propsTable} />
                    </div>
                </div>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Candi version <b>{dataTagline?.tagline?.version}</b></Footer>
        </>
    );
};

export default DashboardComponent;