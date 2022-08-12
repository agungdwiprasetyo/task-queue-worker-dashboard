import { Form, Input, InputNumber, Modal, Switch, Table, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useState } from "react";
import { SetConfiguration } from "src/components/menu/graphql";
import { IConfiguration, IPropsConfiguration } from "src/components/menu/interface";

export const Configuration = (props: IPropsConfiguration) => {
    const { setConfiguration } = SetConfiguration();

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: IConfiguration) => record.key === editingKey;
    const edit = (record: Partial<IConfiguration> & { key: React.Key }) => {
        form.setFieldsValue({ key: record.key, name: record.name, value: record.value, is_active: record.is_active, ...record });
        setEditingKey(record.key);
    };
    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as IConfiguration;
            const index = props.data?.findIndex(item => key === item.key);
            setConfiguration({
                variables: {
                    param: {
                        key: props.data[index]?.key,
                        name: props.data[index]?.name,
                        value: row.value,
                        is_active: row.is_active,
                    }
                }
            })
            setEditingKey('');
            props.getData();
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            dataIndex: 'key',
            key: 'key',
            title: 'Key',
            editable: false,
            render: (key) => {
                return (
                    <Paragraph><pre>{key}</pre></Paragraph>
                )
            },
        },
        {
            dataIndex: 'name',
            key: 'name',
            title: 'Name',
            editable: false,
            render: (name: string) => {
                return (
                    <div>{name}</div>
                );
            }
        },
        {
            dataIndex: 'value',
            key: 'value',
            title: 'Value',
            editable: true,
            render: (value: string) => {
                return (
                    <div>{value}</div>
                );
            }
        },
        {
            dataIndex: 'is_active',
            key: 'is_active',
            title: 'Is Active',
            editable: true,
            render: (is_active: boolean, record: IConfiguration) => {
                return (
                    <div><Switch defaultChecked={is_active} disabled={!isEditing(record)} /></div>
                );
            }
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_: any, record: IConfiguration) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Typography.Link onClick={() => setEditingKey('')}>
                            Cancel
                        </Typography.Link>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        }
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: IConfiguration) => ({
                record,
                inputType: col.dataIndex === 'is_active' ? 'checkbox' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Modal title="Configuration"
            visible={props.visible}
            onCancel={() => { setEditingKey(''); props.setVisible(false) }}
            maskClosable={true}
            footer={null}
            width={1000}
        >
            <div className="ic-table">
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        columns={mergedColumns}
                        dataSource={props.data}
                        loading={props.loading}
                        pagination={false}
                    />
                </Form>
            </div>
        </Modal>
    )
}

export default Configuration;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'checkbox';
    record: IConfiguration;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> :
        inputType == 'text' ? <Input /> : <Switch defaultChecked={record?.is_active} />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
