import React from 'react';
import { Tag } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    StopOutlined

} from '@ant-design/icons';
import { MetaProps } from './interface';

const Meta = (props: MetaProps) => {
    const pointerHover = {
        cursor: 'pointer'
    }

    const onTagClicked = (status: string) => {
        props.setJobStatus(status ? [status] : [])
        props.setIsFilterActive(status != null && status != "")
        props.setParam({
            loading: props.params.loading,
            page: 1,
            limit: props.params.limit,
            taskName: props.params.taskName,
            search: props.params.search,
            status: status ? [status] : [],
            jobId: props.params.jobId,
            startDate: props.params.startDate,
            endDate: props.params.endDate
        })
    }

    return (
        <div className="text-center">
            <Tag style={pointerHover}
                icon={<CheckCircleOutlined />} color="magenta"
                onClick={() => { onTagClicked(null) }}>
                <b>Total Jobs: {props?.meta?.total_records}</b>
            </Tag>
            <Tag style={pointerHover}
                className={props?.meta?.detail?.queueing > 0 ? "fade-in-default" : "fade-out"}
                icon={<ClockCircleOutlined />} color="default"
                onClick={() => { onTagClicked('QUEUEING') }}>
                <b>Queueing: {props?.meta?.detail?.queueing}</b>
            </Tag>
            <Tag style={pointerHover}
                className={props?.meta?.detail?.retrying > 0 ? "fade-in-running" : "fade-out"}
                icon={<SyncOutlined spin={props?.meta?.detail?.retrying != undefined && props?.meta?.detail?.retrying !== 0} />}
                color="geekblue" onClick={() => { onTagClicked('RETRYING') }}>
                <b>Running: {props?.meta?.detail?.retrying}</b>
            </Tag>
            <Tag style={pointerHover}
                icon={<CheckCircleOutlined />} color="green"
                onClick={() => { onTagClicked('SUCCESS') }}>
                <b>Success: {props?.meta?.detail?.success}</b>
            </Tag>
            <Tag style={pointerHover}
                className={props?.meta?.detail?.failure > 0 ? "fade-in-failure" : "fade-out"}
                icon={<CloseCircleOutlined />} color="error"
                onClick={() => { onTagClicked('FAILURE') }}>
                <b>Failure: {props?.meta?.detail?.failure}</b>
            </Tag>
            <Tag style={pointerHover}
                icon={<StopOutlined />} color="warning"
                onClick={() => { onTagClicked('STOPPED') }}>
                <b>Stopped: {props?.meta?.detail?.stopped}</b>
            </Tag>
        </div>
    )
}

export default Meta;