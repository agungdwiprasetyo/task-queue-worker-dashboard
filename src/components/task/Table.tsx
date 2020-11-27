import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { Tag } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';

export const TableComponent = (props: any) => {
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
            render: (status: string) => {
                if (status == "Give Up") return (<Tag icon={<CloseCircleOutlined />} color="red">{status} </Tag>);
                else if (status == "Retrying") return (<Tag icon={<SyncOutlined spin />} color="orange">{status}</Tag>);
                else if (status == "Success") return (<Tag icon={<CheckCircleOutlined />} color="green">{status}</Tag>);
                else if (status == "") return (<Tag icon={<ClockCircleOutlined />} color="default">Queueing</Tag>);
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