import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../api';

interface Group {
    _id: string;
    number: string;
}

const Groups: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
    const [form] = Form.useForm();

    const fetchGroups = async () => {
        const { data } = await getGroups();
        setGroups(data);
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleAdd = () => {
        setCurrentGroup(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: Group) => {
        setCurrentGroup(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        await deleteGroup(id);
        await fetchGroups();
    };

    const handleSubmit = async (values: any) => {
        if (currentGroup) {
            await updateGroup(currentGroup._id, values);
        } else {
            await createGroup(values);
        }
        setIsModalVisible(false);
        await fetchGroups();
    };

    const columns = [
        { title: 'Номер', dataIndex: 'number', key: 'number' },
        {
            title: 'Действие', key: 'action', render: (text: any, record: Group) => (
                <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </span>
            )
        },
    ];

    return (
        <Card title="Группы">
            <p>Используйте эту страницу для управления группами. Добавляйте новые группы, редактируйте существующие и удаляйте ненужные.</p>
            <Button type="primary" onClick={handleAdd}>Добавить группу</Button>
            <Table columns={columns} dataSource={groups} rowKey="_id" />
            <Modal title={currentGroup ? "Редактировать группу" : "Добавить группу"} open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="number" label="Number" rules={[{ required: true, message: 'Пожалуйста, введите номер группы!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Groups;
