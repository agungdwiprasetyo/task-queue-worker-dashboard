
export interface IPropsPagination {
    page: number;
    limit: number;
    totalRecord: number;
    detail: string;
    onChangePage: (incr: number) => void;
}

export interface IPropsCopy {
    value: string;
    title?: string;
}
