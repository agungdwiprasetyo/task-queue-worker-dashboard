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

export const setQueryVariable = (obj): string => {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export const toPrettyJSON = (obj): string => {
    try {
        return JSON.stringify(JSON.parse(obj), null, 2)
    } catch (error) {
        return obj
    }
}

export const toMinifyJSON = (obj): string => {
    try {
        return JSON.stringify(JSON.parse(obj))
    } catch (error) {
        return obj
    }
}

export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export const copyToClipboard = (val) => {
    const el = document.createElement('textarea');
    el.value = val;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

export const getSize = (val): string => {
    const size = new Blob([val]).size
    return convertToByteSize(size);
}

export const convertToByteSize = (size: number): string => {

    if (!size) {
        size = 0;
    }
    const b = 1;
    const k = b * 1024;
    const m = k * 1024;
    const g = m * 1024;
    const t = g * 1024;
    const p = t * 1024;

    if (size > p) {
        return `${Math.round((size / p) * 100) / 100} PB`
    }
    if (size > t) {
        return `${Math.round((size / t) * 100) / 100} TB`
    }
    if (size > g) {
        return `${Math.round((size / g) * 100) / 100} GB`
    }
    if (size > m) {
        return `${Math.round((size / m) * 100) / 100} MB`
    }
    if (size > k) {
        return `${Math.round((size / k) * 100) / 100} KB`
    }
    return `${size} Byte`
}

export const removeElement = (arr, value) => {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr = arr.splice(index, 1);
    }
    return arr;
}

export const roundN = (num: number, precision: number): number => {
    var factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}