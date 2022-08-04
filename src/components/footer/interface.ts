
export interface IFooterComponentProps {
    server_started_at: string;
    version: string;
    go_version: string;
    build_number: string;
    loading?: boolean;
    queue: string;
    persistent: string;
    queue_error: boolean;
    persistent_error: boolean;
}
