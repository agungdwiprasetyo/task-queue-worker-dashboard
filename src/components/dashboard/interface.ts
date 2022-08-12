import { Dispatch, SetStateAction } from 'react';
import { FilterPagination } from '../../utils/helper';

export interface Task {
    name: string
    total_jobs: string
}

export interface TableProps extends FilterPagination {
    retryAllJob: any;
    cleanJob: any;
    stopAllJob: any;
    loading: boolean;
    data: any;
    defaultSort: any;
    defaultOrder: any;
    loadData: any;
    metaTagline?: any;
    setSearchTask?: Dispatch<SetStateAction<boolean>>;
}

export interface ModalConfirmProps {
    task_name: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}
