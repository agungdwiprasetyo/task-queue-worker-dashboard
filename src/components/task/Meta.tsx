import React from 'react';
import { Tag, Space } from 'antd';
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
        props.loadData({
            page: props.params.page,
            limit: props.params.limit,
            taskName: props.params.taskName,
            search: null,
            status: status ? [status] : [],
        });
    }

    return (
        <div className="text-center">
            <Space>
                <Tag style={pointerHover}
                    icon={<CheckCircleOutlined />} color="magenta"
                    onClick={() => { onTagClicked(null) }}>
                    <b>Total Jobs: {props?.meta?.total_records}</b>
                </Tag>
                <Tag style={pointerHover}
                    icon={<CheckCircleOutlined />} color="green"
                    onClick={() => { onTagClicked('SUCCESS') }}>
                    <b>Success: {props?.meta?.detail?.success}</b>
                </Tag>
                <Tag style={pointerHover}
                    icon={<ClockCircleOutlined />} color="default"
                    onClick={() => { onTagClicked('QUEUEING') }}>
                    <b>Queueing: {props?.meta?.detail?.queueing}</b>
                </Tag>
                <Tag style={pointerHover}
                    icon={<SyncOutlined spin={props?.meta?.detail?.retrying != 0} />}
                    color="geekblue" onClick={() => { onTagClicked('RETRYING') }}>
                    <b>Retrying: {props?.meta?.detail?.retrying}</b>
                </Tag>
                <Tag style={pointerHover}
                    icon={<CloseCircleOutlined />} color="error"
                    onClick={() => { onTagClicked('FAILURE') }}>
                    <b>Failure: {props?.meta?.detail?.give_up}</b>
                </Tag>
                <Tag style={pointerHover}
                    icon={<StopOutlined />} color="red"
                    onClick={() => { onTagClicked('STOPPED') }}>
                    <b>Stopped: {props?.meta?.detail?.stopped}</b>
                </Tag>
            </Space>
        </div>
    )
}

export default Meta;