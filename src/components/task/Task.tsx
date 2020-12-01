import React, { useState } from 'react';
import TableComponent from './Table';
import { useRouter } from 'next/router';
import { SubscribeTaskList } from './graphql';
import { CleanJobGraphQL } from '../dashboard/graphql';
import { TableProps, ITaskListParam } from './interface';
import { Row, Col, Button, Divider, Space } from 'antd';
import {
    PlusOutlined, ClearOutlined, LeftOutlined
} from '@ant-design/icons';

const TaskComponent = (props: any) => {
    const router = useRouter();
    const { task_name } = router.query;

    const [paramsTaskList, setParamsTaskList] = useState<ITaskListParam>({
        page: 1,
        limit: 10,
        taskName: task_name as string,
        search: null,
        status: [],
    });

    const { cleanJob } = CleanJobGraphQL();
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
        <Row justify="end">
            <Divider orientation="left" />
            <Col span={20}>
                <Button icon={<LeftOutlined />} size="middle" onClick={() => {
                    router.push({
                        pathname: "/",
                    })
                }}>Back to dashboard</Button>
            </Col>
            <Col span={4}>
                <Space>
                    <Button icon={<PlusOutlined />} size="middle" type="primary">Add Job</Button>
                    <Button icon={<ClearOutlined />} danger size="middle" type="primary" onClick={() => {
                        cleanJob({ variables: { taskName: paramsTaskList.taskName } });
                    }}>Clear Job</Button>
                </Space>
            </Col>
            <Divider orientation="left" />
            <Col span={24}>
                <TableComponent {...propsTable} />
            </Col>
            <Divider orientation="left" />
        </Row>
    );
};

export default TaskComponent;
