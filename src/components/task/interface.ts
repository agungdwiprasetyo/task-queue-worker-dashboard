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
    page: number;
    limit: number;
    taskName: string;
    search: string;
    status: string[];
}