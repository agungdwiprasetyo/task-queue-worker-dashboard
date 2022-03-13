import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { Task, TableProps } from './interface';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { Tag, Space } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined
} from '@ant-design/icons';

export const TableComponent = (props: TableProps) => {
    const router = useRouter();
    const columns: Array<ColumnProps<Task>> = [
        {
            dataIndex: 'name',
            key: 'name',
            title: 'Task Name',
        },
        {
            dataIndex: 'module_name',
            key: 'module_name',
            title: 'Module Name',
            render: (module_name: number) => {
                return (
                    <div><b>{module_name}</b></div>
                );
            }
        },
        {
            dataIndex: 'total_jobs',
            key: 'total_jobs',
            title: 'Total Jobs',
            sorter: (a: any, b: any) => b?.total_jobs - a?.total_jobs,
            render: (total_jobs: number) => {
                return (
                    <div><b>{total_jobs}</b></div>
                );
            }
        },
        {
            dataIndex: 'total_jobs',
            key: 'total_jobs',
            render: (total_jobs: number, row: any) => {
                return (
                    <Space>
                        <Tag className={row?.detail?.queueing > 0 ? "fade-in-default" : "fade-out"} icon={<ClockCircleOutlined />} color="default">Queueing: <b>{row?.detail?.queueing}</b></Tag>
                        <Tag className={row?.detail?.retrying > 0 ? "fade-in-running" : "fade-out"} icon={<SyncOutlined spin={row?.detail?.retrying != 0} />} color="geekblue">Running: <b>{row?.detail?.retrying}</b></Tag>
                        <Tag icon={<CheckCircleOutlined />} color="green">Success: <b>{row?.detail?.success}</b></Tag>
                        <Tag className={row?.detail?.failure > 0 ? "fade-in-failure" : "fade-out"} icon={<CloseCircleOutlined />} color="error">Failure: <b>{row?.detail?.failure}</b></Tag>
                        <Tag icon={<StopOutlined />} color="warning">Stopped: <b>{row?.detail?.stopped}</b></Tag>
                    </Space>
                )
            },
        },
        {
            dataIndex: 'name',
            key: 'action',
            title: '',
            render: (name: string) => {
                return (
                    <Space>
                        <Button type="primary" size="large" onClick={() => {
                            router.push({
                                pathname: "/task",
                                query: { task_name: name }
                            })
                        }}>View Jobs</Button>
                    </Space>
                )
            },
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

    return (
        <div className="ic-table">
            <Table
                columns={columns}
                dataSource={props.data}
                loading={props.loading}
                onChange={handleOnChange}
                scroll={{ x: 560 }}
                pagination={false}
            />
        </div>
    );
};

export default TableComponent;