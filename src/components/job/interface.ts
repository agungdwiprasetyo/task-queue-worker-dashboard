
export interface IJobComponentProps {
    id: string;
}

export interface IFilterJobHistoryParam {
    page: number;
    limit: number;
    start_date?: string;
    end_date?: string;
}
