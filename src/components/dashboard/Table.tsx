import Table, { ColumnProps } from 'antd/lib/table';
import React, { useState } from 'react';
import { Task, TableProps } from './interface';
import { Button, Col, Dropdown, Input, Menu, Modal, Row, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { Tag, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    ClearOutlined,
    ExclamationCircleOutlined,
    MoreOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { FilterPagination } from '../../utils/helper';

const { confirm } = Modal;

export const TableComponent = (props: TableProps) => {
    const router = useRouter();

    let searchFilterValue = [];
    if (props.search != "") {
        searchFilterValue = [props.search]
    }
    const [filterValueState, setFilterValueState] = useState(searchFilterValue);
    const [filterModuleState, setFilterModuleState] = useState([]);
    const [searchState, setSearchState] = useState(searchFilterValue.length > 0);
    const [filterPagination, setFlterPagination] = useState<FilterPagination>({
        page: props.page, limit: props.limit, search: props.search,
    });

    const showAlertConfirm = (title: string, taskName: string, action: string) => {
        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if (action === "CLEAN") {
                    props.cleanJob({ variables: { taskName: taskName } });
                } else if (action === "STOP") {
                    props.stopAllJob({ variables: { taskName: taskName } });
                }
            },
            onCancel() {
            },
        });
    }

    const getFilterValues = (source, key) => {
        let res = [];
        source?.forEach(el => {
            res.push({
                text: el[key],
                value: el[key],
            })
        });
        return res.filter((v, i, a) => a.findIndex(v2 => (v2.value === v.value)) === i);
    }

    const changeFilterPagination = (filter: FilterPagination) => {
        setFlterPagination(filter)

        router.push({
            pathname: "",
            query: { page: filter.page, limit: filter.limit, search: encodeURIComponent(filter.search) }
        },
            undefined,
            { shallow: true }
        )
    }

    const onFilterName = (value, record): boolean => searchState ?
        record["name"] ? record["name"].toString().toLowerCase().includes(value.toLowerCase()) : ''
        : record["name"] ? record["name"] == value : false

    const columns: Array<ColumnProps<Task>> = [
        {
            dataIndex: 'name',
            key: 'name',
            title: 'Task Name',
            filteredValue: filterValueState,
            filters: getFilterValues(props.data, 'name'),
            onFilter: onFilterName,
            render: (text) => {
                return (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={filterValueState}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                )
            },
        },
        {
            dataIndex: 'module_name',
            key: 'module_name',
            title: 'Module Name',
            filteredValue: filterModuleState,
            filters: getFilterValues(props.data, 'module_name'),
            onFilter: (value, record) => record['module_name'] == value,
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
            render: (name: string, row: any) => {
                if (props.metaTagline?.config?.with_persistent) {
                    return (
                        <Space>
                            <Dropdown.Button type="primary" size="large"
                                icon={row?.is_loading ? <LoadingOutlined spin={row?.is_loading} /> : <MoreOutlined />}
                                disabled={row?.is_loading}
                                onClick={() => {
                                    router.push({
                                        pathname: "/task",
                                        query: { task_name: name }
                                    })
                                }} overlay={(
                                    <Menu>
                                        <Menu.Item>
                                            <Tooltip title="Retry all failure and stopped job" placement="left">
                                                <Button icon={<SyncOutlined />} size="middle"
                                                    onClick={() => {
                                                        props.retryAllJob({ variables: { taskName: name } });
                                                    }}>Retry All<span>&nbsp;&nbsp;</span></Button>
                                            </Tooltip>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Tooltip title="Stop all running and queued job" placement="left">
                                                <Button icon={<StopOutlined />} danger size="middle"
                                                    onClick={() => {
                                                        showAlertConfirm(
                                                            `Are you sure stop all running and queued job in task "${name}"?`,
                                                            name,
                                                            "STOP"
                                                        );
                                                    }}>Stop All<span>&nbsp;&nbsp;&nbsp;&nbsp;</span></Button>
                                            </Tooltip>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Tooltip title="Clear all success, failure, and stopped job" placement="left">
                                                <Button icon={<ClearOutlined />} danger size="middle"
                                                    onClick={() => {
                                                        showAlertConfirm(
                                                            `Are you sure clear all success, failure, and stopped job in task "${name}"?`,
                                                            name,
                                                            "CLEAN"
                                                        );
                                                    }}>Clear Job</Button>
                                            </Tooltip>
                                        </Menu.Item>
                                    </Menu>
                                )}>
                                {row?.is_loading ? "Processing..." : "View Jobs"}
                            </Dropdown.Button>
                        </Space>
                    )
                }
            },
        },
    ];

    const handleOnChange = (pagination: any, filters: any, sorter: any) => {
        const { current, pageSize } = pagination;
        const { field, order } = sorter;

        if (filters?.name != null && filters?.name != "") {
            if (!searchState) {
                setSearchState(false)
                setFilterValueState(filters?.name)
            }
        } else {
            setFilterValueState([])
        }

        setFilterModuleState(filters?.module_name)
        changeFilterPagination({
            page: current, limit: pageSize, search: filterPagination.search
        })

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
        <>
            <Row justify="end">
                <Input.Search allowClear
                    placeholder={`Search Task...`}
                    defaultValue={filterPagination.search}
                    onSearch={value => {
                        if (value != "") {
                            setSearchState(true)
                            setFilterValueState([value])
                        } else {
                            setSearchState(false)
                            setFilterValueState([])
                        }
                        changeFilterPagination({
                            page: filterPagination.page,
                            limit: filterPagination.limit,
                            search: value
                        })
                    }}
                    style={{ width: 250, marginBottom: 8, display: 'block' }}
                />
            </Row>
            <Row>
                <Col span={24}>
                    <div className="ic-table">
                        <Table
                            columns={columns}
                            dataSource={props.data}
                            loading={props.loading}
                            onChange={handleOnChange}
                            scroll={{ x: 560 }}
                            pagination={{
                                defaultCurrent: filterPagination.page,
                                defaultPageSize: filterPagination.limit,
                                pageSizeOptions: ['7', '14', '28', '56'],
                                showSizeChanger: true,
                                showTotal: (total, range) => {
                                    return (
                                        <Space>
                                            <h4>Total all jobs: <b>{props.data?.reduce((n, { total_jobs }) => n + total_jobs, 0)}</b>,</h4>
                                            <h4>Queueing: <b>{props.data?.reduce((n, { detail }) => n + detail?.queueing, 0)}</b>,</h4>
                                            <h4>Running: <b>{props.data?.reduce((n, { detail }) => n + detail?.retrying, 0)}</b>,</h4>
                                            <h4>Success: <b>{props.data?.reduce((n, { detail }) => n + detail?.success, 0)}</b>,</h4>
                                            <h4>Failure: <b>{props.data?.reduce((n, { detail }) => n + detail?.failure, 0)}</b>,</h4>
                                            <h4>Stopped: <b>{props.data?.reduce((n, { detail }) => n + detail?.stopped, 0)}</b></h4>
                                            <h4>|</h4>
                                            <h4>Showing {range[0]}-{range[1]} of <b>{total}</b> tasks</h4>
                                        </Space>
                                    )
                                }
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default TableComponent;