import React from 'react';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Row, Space } from "antd";
import { IPropsPagination } from 'src/components/shared/interface';

const PaginationComponent = (props: IPropsPagination) => {

    const totalPage = Math.ceil((props.totalRecord > 0 ? props.totalRecord : 0) / props.limit);

    if (totalPage == 0) {
        return (<></>)
    }

    return (
        <Row justify="end" style={{ marginTop: "15px" }}>
            <Space>
                <span>Total <b>{props.totalRecord}</b> {props.detail} </span>
                <Button icon={<LeftOutlined />} onClick={() => props.onChangePage(-1)} disabled={props.page === 1} />
                <span>page <b>{props.page}</b> of <b>{totalPage}</b></span>
                <Button icon={<RightOutlined />} onClick={() => props.onChangePage(1)} disabled={props.page === totalPage} />
            </Space>
        </Row>
    )
}

export default PaginationComponent;
