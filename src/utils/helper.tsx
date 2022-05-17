import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, StopOutlined, SyncOutlined } from "@ant-design/icons";
import { Space, Tag } from "antd";

export interface StatusLayoutProps {
    status: string;
    retry: number;
}

export interface FilterPagination {
    page: number;
    limit: number;
    search: string;
    statuses?: [string];
    start_date?: string;
    end_date?: string;
}

export const StatusLayout = (props: StatusLayoutProps) => {
    let tag: any;
    if (props.status == "RETRYING") tag = (
        <Tag
            icon={<SyncOutlined spin />}
            color="geekblue">
            {props.retry > 1 ? props.status : "RUNNING"}
        </Tag>);
    else if (props.status == "SUCCESS") tag = (<Tag icon={<CheckCircleOutlined />} color="green">{props.status}</Tag>);
    else if (props.status == "QUEUEING") tag = (<Tag icon={<ClockCircleOutlined />} color="default">{props.status}...</Tag>);
    else if (props.status == "FAILURE") tag = (<Tag icon={<CloseCircleOutlined />} color="error">{props.status} </Tag>);
    else if (props.status == "STOPPED") tag = (<Tag icon={<StopOutlined />} color="warning">{props.status} </Tag>);
    return (
        <Space>
            {tag}
        </Space>
    );
}

export const getQueryVariable = (variable) => {
    if (typeof window === "undefined") {
        return "";
    }
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return decodeURIComponent(pair[1]) }
    }
    return "";
}

export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}