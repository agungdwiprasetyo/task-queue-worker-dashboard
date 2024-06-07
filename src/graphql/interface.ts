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

export interface IFilterJobHistoryParam {
    page: number;
    limit: number;
    start_date?: string;
    end_date?: string;
}