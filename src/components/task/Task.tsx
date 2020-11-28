import TableComponent from './Table';
import { useRouter } from 'next/router';
import { RetryJobGraphQL, SubscribeTaskList } from './graphql';
import { TableProps } from './interface';

const TaskComponent = (props: any) => {
    const content = {
        marginTop: '30px',
        marginLeft: '50px',
        marginRight: '50px',
    };

    const router = useRouter();
    const { task_name } = router.query;

    const loadData = (params: any) => {
        console.log("hahaha load data", params);
        return SubscribeTaskList(task_name as string, params?.page, params?.limit);
    }

    const { data, loading } = loadData({ page: 1, limit: 10 });
    const { retryJob } = RetryJobGraphQL();

    const propsTable: TableProps = {
        data: data?.listen_task?.data,
        meta: data?.listen_task?.meta,
        loadData: loadData,
        loading: loading,
        retryJob: retryJob,
        defaultSort: "desc",
        defaultOrder: "",
    };

    return (
        <div style={content}>
            <div className="text-center mb-5">
                <div className="text-right">
                    {/* <Button type="primary" size='large' onClick={() => {
    
              }}>
                Clean Job
              </Button> */}
                </div>
                <TableComponent {...propsTable} />
            </div>
        </div>
    );
};

export default TaskComponent;
