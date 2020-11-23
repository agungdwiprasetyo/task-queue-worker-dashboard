import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import Task from './interface';
import { Button } from 'antd';
import { useRouter } from 'next/router';

export const TableComponent = (props: any) => {
    const router = useRouter()
    const columns: Array<ColumnProps<Task>> = [
        {
            dataIndex: 'name',
            key: 'name',
            title: 'Task Name',
        },
        {
            dataIndex: 'total_jobs',
            key: 'total_jobs',
            title: 'Total Jobs',
        },
        {
            dataIndex: 'name',
            key: 'action',
            render: (name: string) => {
                return (
                    <span>
                        <Button type="primary" size="middle" onClick={() => {
                            router.push({
                                pathname: "/task",
                                query: { task_name: name }
                            })
                        }}>
                            View jobs
                            </Button>
                    </span>
                )
            },
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