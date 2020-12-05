import Table, { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { Tag, Space, Button, Input, Modal, Typography } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined, SearchOutlined
} from '@ant-design/icons';
import { TableProps } from './interface';
import { RetryJobGraphQL, StopJobGraphQL } from './graphql';
import Highlighter from 'react-highlight-words';

const { Paragraph } = Typography;

const TableComponent = (props: TableProps) => {
    const { retryJob } = RetryJobGraphQL();
    const { stopJob } = StopJobGraphQL();

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
                            search: selectedKeys[0],
                            status: props.params.status,
                        });
                    }}
                    onSearch={value => {
                        if (value === "") { value = null }
                        props.loadData({
                            page: props?.meta?.page,
                            limit: props?.meta?.limit,
                            taskName: props.params.taskName,
                            search: value,
                            status: props.params.status,
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
                <Paragraph copyable={{ text: args }}>
                    <pre onClick={() => Modal.info({
                        title: 'Arguments:',
                        content: (
                            <Paragraph copyable={{ text: args }}><pre>{args}</pre></Paragraph>
                        ),
                        onOk() { },
                        onCancel() { },
                        maskClosable: true,
                        width: 1000
                    })}>
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[props.params.search]}
                            autoEscape
                            textToHighlight={args.length > 100 ? `${args.slice(0, 100)} ...(more)` : args}
                        />
                    </pre>
                </Paragraph>
            );
        },
    })

    const columns: Array<ColumnProps<any>> = [
        {
            dataIndex: 'id',
            key: 'id',
            title: 'Job ID',
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
            dataIndex: 'next_retry_at',
            key: 'next_retry_at',
            title: 'Next Retry',
            width: 150,
            render: (next_retry_at: string) => {
                return (
                    <>
                        {next_retry_at == "" ? "-" : next_retry_at}
                    </>
                );
            }
        },
        {
            dataIndex: 'finished_at',
            key: 'finished_at',
            title: 'Finished At',
            width: 150,
        },
        {
            dataIndex: 'error',
            key: 'error',
            title: 'Error',
            width: 120,
            ellipsis: true,
            render: (error: string) => {
                if (!error) { return "" };
                return (
                    <Paragraph copyable={{ text: error }}>
                        <pre onClick={() => Modal.info({
                            title: 'Error:',
                            content: (
                                <Paragraph copyable={{ text: error }}><pre>{error}</pre></Paragraph>
                            ),
                            onOk() { },
                            maskClosable: true,
                        })}>{error.length > 30 ? `${error.slice(0, 30)} ...(more)` : error}</pre>
                    </Paragraph>
                );
            }
        },
        {
            dataIndex: 'trace_id',
            key: 'trace_id',
            title: 'Trace URL',
            width: 100,
            render: (trace_id: string) => {
                return (
                    <>
                        <a href={trace_id} target="blank">{trace_id}</a>
                    </>
                );
            }
        },
        {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 120,
            filters: [
                { text: 'Success', value: 'SUCCESS' },
                { text: 'Retrying', value: 'RETRYING' },
                { text: 'Queueing', value: 'QUEUEING' },
                { text: 'Failure', value: 'FAILURE' },
                { text: 'Stopped', value: 'STOPPED' },
            ],
            render: (status: string, row: any) => {
                let tag: any;
                if (status == "RETRYING") tag = (<Tag icon={<SyncOutlined spin />} color="geekblue">{status}</Tag>);
                else if (status == "SUCCESS") tag = (<Tag icon={<CheckCircleOutlined />} color="green">{status}</Tag>);
                else if (status == "QUEUEING") tag = (<Tag icon={<ClockCircleOutlined />} color="default">{status}...</Tag>);
                else if (status == "FAILURE") tag = (<Tag icon={<CloseCircleOutlined />} color="red">{status} </Tag>);
                else if (status == "STOPPED") tag = (<Tag icon={<StopOutlined />} color="red">{status} </Tag>);
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
            render: (status: string, row: any) => {
                return (
                    <Space direction="vertical">
                        {
                            (status == "RETRYING" || status == "QUEUEING") ?
                                <Button icon={<StopOutlined />} type="primary" danger size="small" disabled={status == "RETRYING"} onClick={() => {
                                    stopJob({ variables: { jobId: row?.id } })
                                }}>Stop</Button>
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
            search: null,
            status: filters?.status || [],
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