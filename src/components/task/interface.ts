import { Dispatch, SetStateAction } from 'react';

export interface ITaskComponentProps {
    taskName: string;
}

export interface TableProps {
    loading: boolean;
    data: any;
    meta: any;
    defaultSort: any;
    defaultOrder: any;
    params: ITaskListParam;
    showJobId: string | null;
    setLoadData: Dispatch<SetStateAction<ITaskListParam>>;
    setJobStatus: Dispatch<SetStateAction<string[]>>;
    setParam?: any;
}

export interface ModalProps {
    taskName: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export interface MetaProps {
    params: ITaskListParam;
    meta: any;
    setLoadData: Dispatch<SetStateAction<ITaskListParam>>;
    setJobStatus: Dispatch<SetStateAction<string[]>>;
    setParam?: any;
}

export interface ITaskListParam {
    loading: boolean;
    page: number;
    limit: number;
    taskName: string;
    jobId: string;
    search: string;
    status: string[];
    startDate: string;
    endDate: string;
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

export interface IFormFilterProps {
    params: ITaskListParam;
    isFilterActive: boolean;
    setParam?: any;
}
