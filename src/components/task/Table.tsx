import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { Tag, Space, Button } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import RETRY_JOB from './graphql_retry_job';

export const TableComponent = (props: any) => {
    const [retryJob, { data }] = useMutation(RETRY_JOB);

    const columns: Array<ColumnProps<any>> = [
        {
            dataIndex: 'id',
            key: 'id',
            title: 'ID',
        },
        {
            dataIndex: 'task_name',
            key: 'task_name',
            title: 'Task Name',
        },
        {
            dataIndex: 'args',
            key: 'args',
            title: 'Arguments',
        },
        {
            dataIndex: 'retries',
            key: 'retries',
            title: 'Retries',
        },
        {
            dataIndex: 'max_retry',
            key: 'max_retry',
            title: 'Max Retry',
        },
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Created At',
        },
        {
            dataIndex: 'error',
            key: 'error',
            title: 'Error',
        },
        {
            dataIndex: 'trace_id',
            key: 'trace_id',
            title: 'Trace ID',
        },
        {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            render: (status: string, row: any) => {
                let tag: any;
                if (status == "Give Up") tag = (<Tag icon={<CloseCircleOutlined />} color="red">{status} </Tag>);
                else if (status == "Retrying") tag = (<Tag icon={<SyncOutlined spin />} color="orange">{status}</Tag>);
                else if (status == "Success") tag = (<Tag icon={<CheckCircleOutlined />} color="green">{status}</Tag>);
                else if (status == "") tag = (<Tag icon={<ClockCircleOutlined />} color="default">Queueing</Tag>);
                return (
                    <Space>
                        {tag}
                        {
                            status == "Retrying" ?
                                <Space>
                                    <Button type="primary" size="small" disabled>Retry</Button>
                                    <Button type="dashed" danger size="small">Stop</Button>
                                </Space> :
                                <Space>
                                    <Button type="primary" size="small" onClick={() => {
                                        retryJob({ variables: { jobId: row?.id } });
                                    }}>Retry</Button>
                                    <Button type="dashed" danger size="small" disabled>Stop</Button>
                                </Space>

                        }
                    </Space>
                );
            }
        },
    ];

    const handleOnChange = (pagination: any, filters: any, sorter: any) => {
        const { current, pageSize } = pagination;
        const { field, order } = sorter;

        let orderBy: string = '';
        const sortBy: string = field || props.defaultSort;

        if (!order && props.defaultOrder) {
            orderBy = props.defaultOrder;
        }

        if (order) {
            orderBy = order.replace('end', '');
        }

        props.loadData({
            task_name: props.task_name,
            page: current,
            limit: pageSize,
        });
    };

    const loading: boolean = false;

    return (
        <div className="ic-table">
            <Table
                columns={columns}
                dataSource={props.data}
                loading={loading}
                onChange={handleOnChange}
                pagination={{
                    current: props?.meta?.page,
                    total: props?.meta?.total_records,
                }}
                scroll={{ x: 560 }}
            />
        </div>
    );
};

export default TableComponent;