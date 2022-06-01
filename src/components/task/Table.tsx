import Table, { ColumnProps } from 'antd/lib/table';
import React, { useState, useEffect } from 'react';
import { Space, Button, Input, Modal, Typography, Tooltip } from 'antd';
import {
    SyncOutlined,
    StopOutlined, SearchOutlined, DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { TableProps } from './interface';
import { RetryJobGraphQL, StopJobGraphQL, DeleteJobGraphQL } from './graphql';
import Highlighter from 'react-highlight-words';
import JSONPretty from 'react-json-pretty';
import Moment from 'react-moment';
import { StatusLayout, StatusLayoutProps } from 'src/utils/helper';
import { useRouter } from 'next/router';

const { Paragraph } = Typography;

const TableComponent = (props: TableProps) => {
    const router = useRouter();

    const { retryJob } = RetryJobGraphQL();
    const { stopJob } = StopJobGraphQL();
    const { deleteJob } = DeleteJobGraphQL();

    const showAlertDeleteJob = (jobId: string) => {
        Modal.confirm({
            title: `Are you sure to delete this job?`,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteJob({ variables: { jobId: jobId } });
            },
            onCancel() {
            },
        });
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input.Search allowClear
                    placeholder={`Find ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }}
                    onPressEnter={() => {
                        props.setParam({
                            loading: props.params.loading,
                            page: 1,
                            limit: props?.meta?.limit,
                            taskName: props.params.taskName,
                            search: props.params.search,
                            jobId: selectedKeys[0],
                            status: props.params.status,
                            startDate: props.params.startDate,
                            endDate: props.params.endDate,
                        });
                    }}
                    onSearch={value => {
                        if (value === "") { value = null }
                        props.setParam({
                            loading: props.params.loading,
                            page: 1,
                            limit: props?.meta?.limit,
                            taskName: props.params.taskName,
                            search: props.params.search,
                            jobId: value,
                            status: props.params.status,
                            startDate: props.params.startDate,
                            endDate: props.params.endDate,
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
    })

    const columns: Array<ColumnProps<any>> = [
        {
            dataIndex: 'id',
            key: 'id',
            title: 'Job ID',
            width: 130,
            ...getColumnSearchProps('id'),
            render: (id: string) => {
                return (
                    <>
                        <Tooltip title="View job detail">
                            <a onClick={() => {
                                router.push({
                                    pathname: "/job",
                                    query: { id: id }
                                })
                            }}>{id}</a>
                        </Tooltip>
                    </>
                )
            }
        },
        {
            dataIndex: 'args',
            key: 'args',
            title: 'Arguments',
            width: 250,
            render: (args: string) => {
                return (
                    <Paragraph style={{ cursor: 'pointer' }} copyable={{ text: args }}>
                        <pre onClick={() => Modal.info({
                            title: 'Arguments:',
                            content: (
                                <Paragraph copyable={{ text: args }}>
                                    <JSONPretty id="json-pretty" data={args} />
                                </Paragraph>
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
        },
        {
            dataIndex: 'retries',
            key: 'retries',
            title: 'Retries',
            width: 70,
        },
        {
            dataIndex: 'max_retry',
            key: 'max_retry',
            title: 'Max Retry',
            width: 70,
        },
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Created At',
            width: 120,
            render: (date: string) => {
                return (
                    <>
                        <Moment format="DD MMMM YYYY, HH:mm:ssZ">{date}</Moment>
                    </>
                )
            }
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
                    <Paragraph style={{ cursor: 'pointer' }}>
                        <pre onClick={() => Modal.info({
                            title: 'Error:',
                            content: (
                                <Paragraph copyable={{ text: error }}>
                                    <pre>
                                        <Highlighter
                                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                            searchWords={[props.params.search]}
                                            autoEscape
                                            textToHighlight={error}
                                        />
                                    </pre>
                                </Paragraph>
                            ),
                            onOk() { },
                            maskClosable: true,
                            width: 1000
                        })}>
                            <Highlighter
                                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                searchWords={[props.params.search]}
                                autoEscape
                                textToHighlight={error.length > 70 ? `${error.slice(0, 70)} ...(more)` : error}
                            />
                        </pre>
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
            width: 100,
            filters: [
                { text: 'Success', value: 'SUCCESS' },
                { text: 'Running/Retrying', value: 'RETRYING' },
                { text: 'Queueing', value: 'QUEUEING' },
                { text: 'Failure', value: 'FAILURE' },
                { text: 'Stopped', value: 'STOPPED' },
            ],
            render: (status: string, row: any) => {
                const statusProps: StatusLayoutProps = {
                    status: status, retry: row?.retries
                }
                return (
                    <StatusLayout {...statusProps} />
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
                    <Space direction="vertical" align="center">
                        {
                            (status == "RETRYING" || status == "QUEUEING") ?
                                <Button icon={<StopOutlined />} type="primary" danger size="small" onClick={() => {
                                    stopJob({ variables: { jobId: row?.id } })
                                }}>Stop<span>&nbsp;&nbsp;&nbsp;</span></Button>
                                :
                                <Button icon={<SyncOutlined />} type="primary" size="small" onClick={() => {
                                    retryJob({ variables: { jobId: row?.id } });
                                }}>Retry<span>&nbsp;&nbsp;</span></Button>

                        }
                        <Button danger size="small"
                            disabled={status == "QUEUEING" || status == "RETRYING"}
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                showAlertDeleteJob(row?.id);
                            }}>Delete</Button>
                    </Space>
                );
            }
        },
    ];

    const handleOnChange = (pagination: any, filters: any, sorter: any) => {
        const { current, pageSize } = pagination;
        // const { field, order } = sorter;

        // let orderBy: string = '';
        // const sortBy: string = field || props.defaultSort;

        // if (!order && props.defaultOrder) {
        //     orderBy = props.defaultOrder;
        // }

        // if (order) {
        //     orderBy = order.replace('end', '');
        // }

        let statusList = [];
        if (filters?.status) {
            statusList = statusList.concat(filters?.status);
            props.setJobStatus(statusList);
        } else {
            statusList = props.params.status;
        }

        props.setParam({
            loading: props.params.loading,
            page: current,
            limit: pageSize,
            taskName: props.params.taskName,
            search: props.params.search,
            status: statusList,
            jobId: props.params.jobId,
            startDate: props.params.startDate,
            endDate: props.params.endDate,
        })
    };

    return (
        <div className="ic-table">
            <Table
                columns={columns}
                dataSource={props.data}
                loading={props.loading || props.meta?.is_loading}
                onChange={handleOnChange}
                pagination={{
                    current: props?.meta?.page,
                    total: props?.meta?.total_records,
                    showSizeChanger: false,
                    showTotal: (total, range) => { return (<>{range[0]}-{range[1]} of <b>{total}</b> jobs</>) }
                }}
                scroll={{ x: 560 }}
            />
        </div>
    );
};

export default TableComponent;