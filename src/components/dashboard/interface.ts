import { Dispatch, SetStateAction } from 'react';

export interface Task {
    name: string
    total_jobs: string
}

export interface TableProps {
    retryAllJob: any;
    loading: boolean;
    data: any;
    defaultSort: any;
    defaultOrder: any;
    loadData: any;
}

export interface ModalConfirmProps {
    taskName: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}
