import { Dispatch, SetStateAction } from 'react';

export interface ITaskComponentProps {
    task_name: string;
}

export interface TableProps {
    loading: boolean;
    data: any;
    meta: any;
    params: ITaskListParam;
    show_job_id: string | null;
    task_name_param?: string;
    setParam?: Dispatch<SetStateAction<ITaskListParam>>;
}

export interface MetaProps {
    loading: boolean;
    params: ITaskListParam;
    meta: any;
    setParam?: any;
}

export interface ITaskListParam {
    page: number;
    limit: number;
    task_name: string;
    search: string;
    statuses: string[];
    start_date: string;
    end_date: string;
    job_id: string;
}

export interface IJobDetail {
    id: string;
    task_name: string;
    arguments: string;
    retries: number;
    max_retry: number;
    interval: number;
    error: string;
    trace_id: string;
    retry_histories: IJobRetryHistory[];
    status: string;
    created_at: string;
}

export interface IJobRetryHistory {
    status: string;
    trace_id: string;
    error: string;
    timestamp: string;
}

export interface IFormFilterProps {
    totalRecords: number;
    params: ITaskListParam;
    setParam?: any;
    setLoadData?: Dispatch<SetStateAction<ITaskListParam>>;
}

export interface IActionComponentProps {
    is_loading_subscribe: boolean;
    is_loading: boolean;
    is_hold: boolean;
    task_list_param: ITaskListParam;
    total_job: number;
}
