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

export interface ITaskListParam {
    page: number;
    limit: number;
    taskName: string;
    search: string;
}