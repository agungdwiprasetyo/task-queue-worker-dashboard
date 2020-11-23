import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';

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
            dataIndex: 'interval',
            key: 'interval',
            title: 'Interval',
        },
        {
            dataIndex: 'action',
            key: 'action',
            title: 'Action',
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
            limit: pageSize,
            orderBy,
            page: current,
            sortBy,
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
                scroll={{ x: 560 }}
            />
        </div>
    );
};

export default TableComponent;