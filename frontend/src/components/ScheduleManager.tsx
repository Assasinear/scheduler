import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Table, Card } from 'antd';
import { getSchedules, createSchedule, deleteSchedule } from '../api';
import { useNavigate } from 'react-router-dom';

const ScheduleManager: React.FC = () => {
    const [schedules, setSchedules] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchSchedules = async () => {
        try {
            const response = await getSchedules();
            setSchedules(response.data);
        } catch (error) {
            console.error(error);
            message.error('Ошибка при загрузке расписаний');
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            await createSchedule(values);
            message.success('Расписание создано');
            fetchSchedules();
            setIsModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Ошибка при создании расписания');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSchedule(id);
            message.success('Расписание удалено');
            fetchSchedules();
        } catch (error) {
            console.error(error);
            message.error('Ошибка при удалении расписания');
        }
    };

    const columns = [
        { title: 'Название', dataIndex: 'name', key: 'name' },
        {
            title: 'Действие', key: 'action', render: (text: any, record: any) => (
                <span>
          <Button type="link" onClick={() => navigate(`/schedule/${record._id}`)}>Редактировать</Button>
          <Button type="link" onClick={() => handleDelete(record._id)}>Удалить</Button>
        </span>
            )
        }
    ];

    return (
        <Card title="Управление расписанием">
            <p>Эта страница позволяет вам управлять всеми расписаниями. Вы можете создавать новые, редактировать и удалять существующие расписания.</p>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>Добавить расписание</Button>
            <Table columns={columns} dataSource={schedules} rowKey="_id" />
            <Modal title="Добавить расписание" open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Пожалуйста, введите название расписания!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ScheduleManager;