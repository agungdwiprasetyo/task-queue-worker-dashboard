import { SubscribeTaskList, CleanJobGraphQL } from './graphql';
import TableComponent from './Table';
import { TableProps } from './interface';
import { Modal } from 'antd';

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

    const content = {
        marginTop: '30px',
        marginLeft: '50px',
        marginRight: '50px',
    };

    const loadData = (params: any) => {
        console.log(params)
    }

    const propsTable: TableProps = {
        data: data?.subscribe_all_task,
        cleanJob: cleanJob,
        loading: loading,
        defaultOrder: "",
        defaultSort: "desc",
        loadData: loadData,
    };

    return (
        <>
            <div style={content}>
                <div className="text-center mb-5">
                    <TableComponent {...propsTable} />
                </div>
            </div>
        </>
    );
};

export default DashboardComponent;