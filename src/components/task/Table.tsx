import Table, { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Space, Button, Input, Modal, Tooltip, } from 'antd';
import {
    SyncOutlined,
    StopOutlined, SearchOutlined, DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { TableProps } from './interface';
import { RetryJobGraphQL, StopJobGraphQL, DeleteJobGraphQL } from './graphql';
import Moment from 'react-moment';
import { StatusLayout, StatusLayoutProps } from 'src/utils/helper';
import { useRouter } from 'next/router';
import DetailData from 'src/components/job/DetailData';
import PaginationComponent from 'src/components/shared/PaginationComponent';
import { GetDetailConfiguration } from 'src/components/menu/graphql';

const TableComponent = (props: TableProps) => {
    const router = useRouter();

    const { retryJob } = RetryJobGraphQL();
    const { stopJob } = StopJobGraphQL();
    const { deleteJob } = DeleteJobGraphQL();
    const traceURLConfig = GetDetailConfiguration("trace_detail_url");

    const showAlertDeleteJob = (job_id: string) => {
        Modal.confirm({
            title: `Are you sure to delete this job?`,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteJob({ variables: { job_id: job_id } });
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
                            page: 1,
                            limit: props?.meta?.limit,
                            task_name: props.params.task_name,
                            search: props.params.search,
                            job_id: selectedKeys[0],
                            statuses: props.params.statuses,
                            start_date: props.params.start_date,
                            end_date: props.params.end_date,
                        });
                    }}
                    onSearch={value => {
                        if (value === "") { value = null }
                        props.setParam({
                            page: 1,
                            limit: props?.meta?.limit,
                            task_name: props.params.task_name,
                            search: props.params.search,
                            job_id: value,
                            statuses: props.params.statuses,
                            start_date: props.params.start_date,
                            end_date: props.params.end_date,
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

    let columns: ColumnsType<any> = [
        {
            dataIndex: 'id',
            key: 'id',
            title: 'Job ID',
            width: 130,
            fixed: 'left',
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
            render: (args: string, row: any) => {
                return (
                    <DetailData
                        title={"Arguments / Message:"}
                        jobId={row?.id}
                        initialValue={args}
                        search={props?.params?.search}
                        keyData={"arguments"}
                        isShowMore={row?.meta?.is_show_more_args}
                    />
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
                    <Moment format="DD MMMM YYYY, HH:mm:ssZ">{date}</Moment>
                )
            }
        },
        {
            dataIndex: 'error',
            key: 'error',
            title: 'Error',
            width: 120,
            ellipsis: true,
            render: (error: string, row: any) => {
                if (!error) { return "" };
                return (
                    <DetailData
                        title={"Error:"}
                        jobId={row?.id}
                        initialValue={error}
                        search={props?.params?.search}
                        keyData={"error"}
                        isShowMore={row?.meta?.is_show_more_error}
                    />
                );
            }
        },
        {
            dataIndex: 'trace_id',
            key: 'trace_id',
            title: 'Trace URL',
            width: 100,
            render: (trace_id: string) => {
                if (trace_id == "") {
                    return (<></>);
                }
                const traceURL = traceURLConfig?.value?.replace(/\/?(\?|#|$)/, '/$1') + trace_id;
                return (
                    <a href={traceURL} target="blank">{traceURL}</a>
                );
            }
        },
        {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 100,
            fixed: 'right',
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
            fixed: 'right',
            render: (status: string, row: any) => {
                return (
                    <Space direction="vertical" align="center">
                        {
                            (status == "RETRYING" || status == "QUEUEING") ?
                                <Button icon={<StopOutlined />} type="primary" danger size="small" onClick={() => {
                                    stopJob({ variables: { job_id: row?.id } })
                                    if (props.meta?.is_freeze_broadcast) {
                                        router.push({
                                            pathname: "/job",
                                            query: { id: row.id }
                                        })
                                    }
                                }}>Stop<span>&nbsp;&nbsp;&nbsp;</span></Button>
                                :
                                <Button icon={<SyncOutlined />} type="primary" size="small" onClick={() => {
                                    retryJob({ variables: { job_id: row?.id } });
                                    if (props.meta?.is_freeze_broadcast) {
                                        router.push({
                                            pathname: "/job",
                                            query: { id: row.id }
                                        })
                                    }
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

    if (!props.task_name_param) {
        columns.unshift(
            {
                dataIndex: 'task_name',
                key: 'task_name',
                title: 'Task Name',
                width: 90,
                render: (task_name: string) => {
                    return (
                        <a onClick={() => {
                            router.push({
                                pathname: "/task",
                                query: { task_name: task_name }
                            })
                        }}><b>{task_name}</b></a>
                    )
                }
            })
    }


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
        } else {
            statusList = props.params.statuses;
        }

        props.setParam({
            page: current,
            limit: pageSize,
            task_name: props.params.task_name,
            search: props.params.search,
            statuses: statusList,
            job_id: props.params.job_id,
            start_date: props.params.start_date,
            end_date: props.params.end_date,
        })
    };

    return (
        <div className="ic-table">
            <Table
                columns={columns}
                dataSource={props.data}
                loading={props.loading || props.meta?.is_loading}
                onChange={handleOnChange}
                pagination={false}
                scroll={{ x: 1300 }}
            />
            <PaginationComponent
                page={props?.meta?.page}
                limit={props?.params?.limit}
                totalRecord={props?.meta?.total_records}
                detail={"jobs"}
                onChangePage={(incrPage: number) => {
                    props.setParam({
                        page: props?.meta?.page + incrPage,
                        limit: 10,
                        task_name: props.params.task_name,
                        search: props.params.search,
                        statuses: props.params.statuses,
                        job_id: props.params.job_id,
                        start_date: props.params.start_date,
                        end_date: props.params.end_date,
                    })
                }} />
        </div>
    );
};

export default TableComponent;