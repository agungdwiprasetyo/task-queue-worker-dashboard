import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { Tag, Space, Button, Input, Layout, Typography } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined, SearchOutlined
} from '@ant-design/icons';
import { TableProps } from './interface';
import { RetryJobGraphQL } from './graphql';
import Highlighter from 'react-highlight-words';

const { Paragraph } = Typography;

export const TableComponent = (props: TableProps) => {
    const { retryJob } = RetryJobGraphQL();

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input.Search allowClear
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => {
                        props.loadData({
                            page: props?.meta?.page,
                            limit: props?.meta?.limit,
                            taskName: props.params.taskName,
                            search: selectedKeys[0]
                        });
                    }}
                    onSearch={value => {
                        if (value === "") { value = null }
                        props.loadData({
                            page: props?.meta?.page,
                            limit: props?.meta?.limit,
                            taskName: props.params.taskName,
                            search: value
                        });
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
        render: (args: string) => {
            return (
                <Layout>
                    <Paragraph copyable>
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[props.params.search]}
                            autoEscape
                            textToHighlight={args ? args.toString() : ''}
                        />
                    </Paragraph>
                </Layout>
            );
        },
    })

    const columns: Array<ColumnProps<any>> = [
        {
            dataIndex: 'id',
            key: 'id',
            title: 'ID',
            width: 100
        },
        {
            dataIndex: 'task_name',
            key: 'task_name',
            title: 'Task Name',
            width: 100
        },
        {
            dataIndex: 'args',
            key: 'args',
            title: 'Arguments',
            width: 250,
            ...getColumnSearchProps('args'),
        },
        {
            dataIndex: 'retries',
            key: 'retries',
            title: 'Retries',
            width: 80,
        },
        {
            dataIndex: 'max_retry',
            key: 'max_retry',
            title: 'Max Retry',
            width: 80,
        },
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Created At',
            width: 150,
        },
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Next Retry',
            width: 150,
        },
        {
            dataIndex: 'error',
            key: 'error',
            title: 'Error',
            width: 100,
        },
        {
            dataIndex: 'trace_id',
            key: 'trace_id',
            title: 'Trace ID',
            width: 150,
        },
        {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 100,
            fixed: 'right',
            render: (status: string, row: any) => {
                let tag: any;
                if (status == "Give Up") tag = (<Tag icon={<CloseCircleOutlined />} color="red">{status} </Tag>);
                else if (status == "Retrying") tag = (<Tag icon={<SyncOutlined spin />} color="orange">{status}</Tag>);
                else if (status == "Success") tag = (<Tag icon={<CheckCircleOutlined />} color="green">{status}</Tag>);
                else if (status == "") tag = (<Tag icon={<ClockCircleOutlined />} color="default">Queueing</Tag>);
                return (
                    <Space>
                        {tag}
                    </Space>
                );
            }
        },
        {
            dataIndex: 'status',
            key: 'status',
            title: 'Action',
            width: 100,
            fixed: 'right',
            render: (status: string, row: any) => {
                return (
                    <Space direction="vertical">
                        {
                            (status == "Retrying" || status == "") ?
                                <Button icon={<StopOutlined />} type="primary" danger size="small">Stop</Button>
                                :
                                <Button icon={<SyncOutlined />} type="primary" size="small" onClick={() => {
                                    retryJob({ variables: { jobId: row?.id } });
                                }}>Retry</Button>

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
            page: current,
            limit: pageSize,
            taskName: props.params.taskName,
            search: null
        });
    };

    return (
        <div>
            <Table
                columns={columns}
                dataSource={props.data}
                loading={props.loading}
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