import { Dispatch, SetStateAction } from 'react';

export interface TableProps {
    loading: boolean;
    data: any;
    meta: any;
    defaultSort: any;
    defaultOrder: any;
    params: ITaskListParam;
    loadData: Dispatch<SetStateAction<ITaskListParam>>;
}

export interface ModalProps {
    taskName: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export interface MetaProps {
    params: ITaskListParam;
    meta: any;
    loadData: Dispatch<SetStateAction<ITaskListParam>>;
}

export interface ITaskListParam {
    loading: boolean;
    page: number;
    limit: number;
    taskName: string;
    search: string;
    status: string[];
}

export interface ViewJobDetailProps {
    param: IJobDetailParam;
    setParam: Dispatch<SetStateAction<IJobDetailParam>>;
}

export interface IJobDetailParam {
    job_id: string;
    visible: boolean;
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
    created_at; string;
}

export interface IJobRetryHistory {
    status: string;
    trace_id: string;
    error: string;
    timestamp: string;
}