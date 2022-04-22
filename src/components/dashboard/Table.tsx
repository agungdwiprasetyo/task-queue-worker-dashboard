import Table, { ColumnProps } from 'antd/lib/table';
import React, { useState } from 'react';
import { Task, TableProps } from './interface';
import { Button, Input } from 'antd';
import { useRouter } from 'next/router';
import { Tag, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    SearchOutlined
} from '@ant-design/icons';

export const TableComponent = (props: TableProps) => {
    const router = useRouter();


    const [state, setState] = useState("");

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input.Search allowClear
                    placeholder={`Search Task Name`}
                    value={selectedKeys[0]}
                    onChange={e => { setSelectedKeys(e.target.value ? [e.target.value] : []); }}
                    onSearch={value => {
                        if (value) {
                            confirm();
                            setState(selectedKeys[0]);
                        } else {
                            clearFilters();
                            setState("");
                        }
                    }}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        render: text =>
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[state]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
    })

    const columns: Array<ColumnProps<Task>> = [
        {
            dataIndex: 'name',
            key: 'name',
            title: 'Task Name',
            ...getColumnSearchProps('name'),
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
                pagination={{
                    defaultPageSize: 7,
                    hideOnSinglePage: true,
                    showTotal: (n) => { return (<>Total <b>{n}</b> tasks</>); }
                }}
            />
        </div>
    );
};

export default TableComponent;