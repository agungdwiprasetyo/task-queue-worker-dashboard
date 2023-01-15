import React from 'react';
import { Tag } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { MetaProps } from './interface';

const Meta = (props: MetaProps) => {
    const pointerHover = {
        cursor: 'pointer'
    }

    const onTagClicked = (status: string) => {
        props.setParam({
            page: 1,
            limit: props.params.limit,
            task_name: props.params.task_name,
            search: props.params.search,
            statuses: status ? [status] : [],
            job_id: props.params.job_id,
            start_date: props.params.start_date,
            end_date: props.params.end_date
        })
    }

    return (
        <div className="text-center" >
            <Tag style={pointerHover} key={"all_job"}
                icon={<CheckCircleOutlined />} color="magenta"
                onClick={() => { onTagClicked(null) }}>
                <b>Total Jobs: {props.loading ? <LoadingOutlined spin={true} /> : props?.meta?.total_records}</b>
            </Tag>
            <Tag style={pointerHover} key={"queueing"}
                className={props.params?.statuses?.includes("QUEUEING") && !props.loading ? "shadow-default" :
                    props?.meta?.detail?.queueing > 0 ? "fade-in-default" : "fade-out"}
                icon={<ClockCircleOutlined />} color="default"
                onClick={() => { onTagClicked('QUEUEING') }}>
                <b>Queueing: {props.loading ? <LoadingOutlined spin={true} /> : props?.meta?.detail?.queueing}</b>
            </Tag>
            <Tag style={pointerHover} key={"retrying"}
                className={props.params?.statuses?.includes("RETRYING") && !props.loading ? "shadow-running" :
                    props?.meta?.detail?.retrying > 0 ? "fade-in-running" : "fade-out"}
                icon={<SyncOutlined spin={props?.meta?.detail?.retrying != undefined && props?.meta?.detail?.retrying !== 0} />}
                color="geekblue" onClick={() => { onTagClicked('RETRYING') }}>
                <b>Running: {props.loading ? <LoadingOutlined spin={true} /> : props?.meta?.detail?.retrying}</b>
            </Tag>
            <Tag style={pointerHover}
                className={props.params?.statuses?.includes("SUCCESS") && !props.loading ? "shadow-success" : ""}
                key={"success"}
                icon={<CheckCircleOutlined />} color="green"
                onClick={() => { onTagClicked('SUCCESS') }}>
                <b>Success: {props.loading ? <LoadingOutlined spin={true} /> : props?.meta?.detail?.success}</b>
            </Tag>
            <Tag style={pointerHover} key={"failure"}
                className={props.params?.statuses?.includes("FAILURE") && !props.loading ? "shadow-failure" :
                    props?.meta?.detail?.failure > 0 ? "fade-in-failure" : "fade-out"}
                icon={<CloseCircleOutlined />} color="error"
                onClick={() => { onTagClicked('FAILURE') }}>
                <b>Failure: {props.loading ? <LoadingOutlined spin={true} /> : props?.meta?.detail?.failure}</b>
            </Tag>
            <Tag style={pointerHover}
                className={props.params?.statuses?.includes("STOPPED") && !props.loading ? "shadow-stopped" : ""}
                key={"stopped"}
                icon={<StopOutlined />} color="warning"
                onClick={() => { onTagClicked('STOPPED') }}>
                <b>Stopped: {props.loading ? <LoadingOutlined spin={true} /> : props?.meta?.detail?.stopped}</b>
            </Tag>
        </div>
    )
}

export default Meta;