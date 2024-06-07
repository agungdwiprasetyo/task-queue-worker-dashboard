import React, { useState } from 'react';
import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { copyToClipboard } from 'src/utils/helper';

export interface IPropsCopy {
    value: string;
    title?: string;
}

const CopyComponent = (props: IPropsCopy) => {
    const [copyWording, setCopyWording] = useState({ title: props.title ? props.title : "copy", color: "geekblue", icon: (<CopyOutlined />) });

    return (
        <Tag style={{ cursor: 'pointer' }}
            icon={copyWording.icon}
            color={copyWording.color} onClick={() => {
                copyToClipboard(props.value)
                setCopyWording({ title: "copied", color: "green", icon: (<CheckCircleOutlined />) })
                setInterval(() => {
                    setCopyWording({
                        title: props.title ? props.title : "copy", color: "geekblue", icon: (<CopyOutlined />)
                    })
                }, 3000);
            }}>
            {copyWording.title}
        </Tag>
    )
}

export default CopyComponent;
