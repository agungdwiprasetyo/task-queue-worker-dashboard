import React, { useState } from 'react';
import TableComponent from './Table';
import { useRouter } from 'next/router';
import { SubscribeTaskList } from './graphql';
import { TableProps, ITaskListParam } from './interface';

const TaskComponent = (props: any) => {
    const content = {
        marginTop: '30px',
        marginLeft: '50px',
        marginRight: '50px',
    };

    const router = useRouter();
    const { task_name } = router.query;

    const [paramsTaskList, setParamsTaskList] = useState<ITaskListParam>({
        page: 1,
        limit: 10,
        taskName: task_name as string,
    });


    const { data, loading } = SubscribeTaskList(paramsTaskList);

    const propsTable: TableProps = {
        data: data?.listen_task?.data,
        meta: data?.listen_task?.meta,
        loadData: setParamsTaskList,
        loading: loading,
        defaultSort: "desc",
        defaultOrder: "",
        taskName: paramsTaskList.taskName,
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
