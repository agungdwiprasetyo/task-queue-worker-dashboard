
export interface IJobComponentProps {
    id: string;
}

export interface IFilterJobHistoryParam {
    page: number;
    limit: number;
    start_date?: string;
    end_date?: string;
}

export interface DetailDataProps {
    title: string;
    jobId: string;
    isShowMore: boolean;
    initialValue: string;
    search: string;
    keyData: string
}
