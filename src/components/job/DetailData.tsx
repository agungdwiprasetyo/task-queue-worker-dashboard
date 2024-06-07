import React, { useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { DetailDataProps } from './interface';
import { toPrettyJSON, toMinifyJSON, getSize } from '../../utils/helper';
import Paragraph from 'antd/lib/typography/Paragraph';
import Highlighter from 'react-highlight-words';
import { LoadingOutlined } from '@ant-design/icons';
import CopyComponent from 'src/components/shared/CopyComponent';
import { GetDetailJob } from 'src/graphql';

const DetailData = (props: DetailDataProps) => {
    const [getDetailJob, { data, called, loading }] = GetDetailJob();
    const [visible, setVisible] = useState(false);

    if (called && loading) return (
        <Row justify='center'>
            <LoadingOutlined spin={true} />
        </Row>
    );

    if (!called) {
        return (
            <Paragraph style={{ cursor: 'pointer' }} >
                <pre style={props?.isError ? { color: "#f5222d", fontWeight: "bold" } : {}} onClick={() => {
                    getDetailJob({ variables: { job_id: props.jobId } });
                    setVisible(true);
                }}>
                    {toMinifyJSON(props.initialValue)}{props.isShowMore ? <b>... (more)</b> : <></>}
                </pre>
            </Paragraph>
        )
    }

    return (
        <>
            <Paragraph style={{ cursor: 'pointer' }}>
                <pre style={props?.isError ? { color: "#f5222d", fontWeight: "bold" } : {}} onClick={() => {
                    getDetailJob({ variables: { job_id: props.jobId } });
                    setVisible(true);
                }}>
                    {toMinifyJSON(props.initialValue)}{props.isShowMore ? <b>... (more)</b> : <></>}
                </pre>
            </Paragraph>
            <Modal
                title={props.title}
                visible={visible}
                onOk={() => { setVisible(false) }}
                onCancel={() => { setVisible(false) }}
                footer={null}
                maskClosable={true}
                width={1000}
            >
                <Row >
                    <Col span={20}>Size: <b>{getSize(data?.get_detail_job[props.keyData])}</b></Col>
                    <Col span={4}>
                        <Row justify="end" gutter={10}>
                            <CopyComponent value={toPrettyJSON(data?.get_detail_job[props.keyData])} />
                        </Row>
                    </Col>
                </Row>
                <Paragraph>
                    <pre style={props?.isError ? { color: "#f5222d", fontWeight: "bold" } : {}}>
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[props.search]}
                            autoEscape
                            textToHighlight={toPrettyJSON(data?.get_detail_job[props.keyData])}
                        />
                    </pre>
                </Paragraph>
            </Modal>
        </>
    );
}

export default DetailData;