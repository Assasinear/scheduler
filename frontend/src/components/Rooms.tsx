import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../api';

interface Room {
    _id: string;
    number: string;
}

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [form] = Form.useForm();

    const fetchRooms = async () => {
        const { data } = await getRooms();
        setRooms(data);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleAdd = () => {
        setCurrentRoom(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: Room) => {
        setCurrentRoom(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        await deleteRoom(id);
        await fetchRooms();
    };

    const handleSubmit = async (values: any) => {
        if (currentRoom) {
            await updateRoom(currentRoom._id, values);
        } else {
            await createRoom(values);
        }
        setIsModalVisible(false);
        await fetchRooms();
    };

    const columns = [
        { title: 'Номер', dataIndex: 'number', key: 'number' },
        {
            title: 'Действия', key: 'action', render: (text: any, record: Room) => (
                <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </span>
            )
        },
    ];

    return (
        <Card title="Аудитории">
            <p>Здесь вы можете управлять аудиториями, добавлять новые, редактировать и удалять старые. Убедитесь, что все данные актуальны.</p>
            <Button type="primary" onClick={handleAdd}>Добавить аудиторию</Button>
            <Table columns={columns} dataSource={rooms} rowKey="_id" />
            <Modal title={currentRoom ? "Редактировать аудиторию" : "Добавить аудиторию"} open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="number" label="Номер" rules={[{ required: true, message: 'Пожалуйста, введите номер аудитории!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Rooms;