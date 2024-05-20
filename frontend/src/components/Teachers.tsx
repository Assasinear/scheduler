import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../api';

interface Teacher {
    _id: string;
    name: string;
    position: string;
}

const Teachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
    const [form] = Form.useForm();

    const fetchTeachers = async () => {
        const { data } = await getTeachers();
        setTeachers(data);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleAdd = () => {
        setCurrentTeacher(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: Teacher) => {
        setCurrentTeacher(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        await deleteTeacher(id);
        await fetchTeachers();
    };

    const handleSubmit = async (values: any) => {
        if (currentTeacher) {
            await updateTeacher(currentTeacher._id, values);
        } else {
            await createTeacher(values);
        }
        setIsModalVisible(false);
        await fetchTeachers();
    };

    const columns = [
        { title: 'Имя', dataIndex: 'name', key: 'name' },
        { title: 'Должность', dataIndex: 'position', key: 'position' },
        {
            title: 'Действие', key: 'action', render: (text: any, record: Teacher) => (
                <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </span>
            )
        }
    ];

    return (
        <Card title="Преподаватели">
            <Button type="primary" onClick={handleAdd}>Добавить преподавателя</Button>
            <Table columns={columns} dataSource={teachers} rowKey="_id" />
            <Modal title={currentTeacher ? "Редактировать преподавателя" : "Добавить преподавателя"} open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Пожалуйста, введите имя преподавателя!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="position" label="Должность" rules={[{ required: true, message: 'Пожалуйста, введите должность преподавателя!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Teachers;