import React, { useState } from 'react';
import TableComponent from './Table';
import { useRouter } from 'next/router';
import { SubscribeTaskList } from './graphql';
import { TableProps, ITaskListParam } from './interface';
import { Row, Col } from 'antd';

const TaskComponent = (props: any) => {
    const router = useRouter();
    const { task_name } = router.query;

    const [paramsTaskList, setParamsTaskList] = useState<ITaskListParam>({
        page: 1,
        limit: 10,
        taskName: task_name as string,
        search: null
    });

    const { data, loading } = SubscribeTaskList(paramsTaskList);

    const propsTable: TableProps = {
        data: data?.listen_task?.data,
        meta: data?.listen_task?.meta,
        loadData: setParamsTaskList,
        loading: loading,
        defaultSort: "desc",
        defaultOrder: "",
        params: paramsTaskList,
    };

    return (
        <Row>
            <Col span={24}>
                <TableComponent {...propsTable} />
            </Col>
        </Row>
    );
};

export default TaskComponent;
