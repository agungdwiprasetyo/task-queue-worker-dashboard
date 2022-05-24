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
}

export interface ModalConfirmProps {
    taskName: string;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}
