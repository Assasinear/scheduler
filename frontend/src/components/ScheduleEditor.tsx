import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Table, Modal, Input, DatePicker, Card } from 'antd';
import { getGroups, getTeachers, getRooms, getScheduleById, updateScheduleItems, optimizeSchedule } from '../api';
import { Schedule, ScheduleItem, Group, Teacher, Room } from '../types';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
const timeSlots = ['08:30-10:05', '10:15-11:50', '12:10-13:45', '14:00-15:35'];

interface FormValues {
    group: string;
    teacher: string;
    room: string;
    subject: string;
    time: string[];
}

const ScheduleEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [form] = Form.useForm<FormValues>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ day: string; slot: string } | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const fetchInitialData = async () => {
        const [scheduleResponse, groupsResponse, teachersResponse, roomsResponse] = await Promise.all([
            getScheduleById(id!),
            getGroups(),
            getTeachers(),
            getRooms()
        ]);
        setSchedule(scheduleResponse.data);
        setGroups(groupsResponse.data);
        setTeachers(teachersResponse.data);
        setRooms(roomsResponse.data);
    };

    const handleCellSelect = (day: string, slot: string) => {
        setSelectedCell({ day, slot });
        setIsModalVisible(true);
        form.resetFields();
    };

    const handleSubmit = async (values: FormValues) => {
        if (!schedule || !selectedCell) return;
        const { day, slot } = selectedCell;

        const startTime = moment(slot.split('-')[0], 'HH:mm').day(weekDays.indexOf(day) + 1).toDate();
        const endTime = moment(slot.split('-')[1], 'HH:mm').day(weekDays.indexOf(day) + 1).toDate();

        const newItem: ScheduleItem = {
            group: groups.find(g => g._id === values.group) as Group,
            teacher: teachers.find(t => t._id === values.teacher) as Teacher,
            room: rooms.find(r => r._id === values.room) as Room,
            subject: values.subject,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        };

        const updatedItems = [...schedule.items];
        const existingItemIndex = updatedItems.findIndex(item =>
            moment(item.startTime).format('HH:mm') === slot.split('-')[0] &&
            moment(item.endTime).format('HH:mm') === slot.split('-')[1] &&
            moment(item.startTime).isoWeekday() === weekDays.indexOf(day) + 1
        );

        if (existingItemIndex !== -1) {
            updatedItems[existingItemIndex] = newItem;
        } else {
            updatedItems.push(newItem);
        }

        try {
            await updateScheduleItems(id!, { items: updatedItems });
            message.success('Элемент расписания добавлен');
            fetchInitialData();
            setIsModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Ошибка при добавлении элемента расписания');
        }
    };

    const handleOptimize = async () => {
        try {
            await optimizeSchedule(id!);
            message.success('Расписание оптимизировано');
            fetchInitialData();
        } catch (error) {
            console.error(error);
            message.error('Ошибка при оптимизации расписания');
        }
    };

    const renderCellContent = (day: string, slot: string) => {
        if (!schedule) return null;
        const item = schedule.items.find(item =>
            moment(item.startTime).format('HH:mm') === slot.split('-')[0] &&
            moment(item.endTime).format('HH:mm') === slot.split('-')[1] &&
            moment(item.startTime).isoWeekday() === weekDays.indexOf(day) + 1
        );
        if (item) {
            return `${item.subject}, ${item.teacher.name}, ${item.room.number}`;
        }
        return <Button type="link" onClick={() => handleCellSelect(day, slot)}>+</Button>;
    };

    const columns = [
        { title: 'Время', dataIndex: 'slot', key: 'slot' },
        ...weekDays.map(day => ({
            title: day, dataIndex: day, key: day, render: (_text: any, record: any) => renderCellContent(day, record.slot)
        }))
    ];

    return (
        <Card title={`Редактирование расписания: ${schedule?.name}`}>
            <Table bordered pagination={false} dataSource={timeSlots.map(slot => ({ key: slot, slot }))} columns={columns} />
            <Button type="primary" onClick={handleOptimize} style={{ marginTop: '20px' }}>Оптимизировать</Button>
            <Modal title="Добавить занятие" open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="group" label="Группа" rules={[{ required: true, message: 'Пожалуйста, выберите группу!' }]}>
                        <Select>{groups.map(group => (<Option key={group._id} value={group._id}>{group.number}</Option>))}</Select>
                    </Form.Item>
                    <Form.Item name="teacher" label="Преподаватель" rules={[{ required: true, message: 'Пожалуйста, выберите преподавателя!' }]}>
                        <Select>{teachers.map(teacher => (<Option key={teacher._id} value={teacher._id}>{teacher.name}</Option>))}</Select>
                    </Form.Item>
                    <Form.Item name="room" label="Аудитория" rules={[{ required: true, message: 'Пожалуйста, выберите аудиторию!' }]}>
                        <Select>{rooms.map(room => (<Option key={room._id} value={room._id}>{room.number}</Option>))}</Select>
                    </Form.Item>
                    <Form.Item name="subject" label="Предмет" rules={[{ required: true, message: 'Пожалуйста, введите предмет!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="time" label="Время" rules={[{ required: true, message: 'Пожалуйста, выберите диапазон времени!' }]}>
                        <RangePicker showTime={{ format: 'HH:mm' }} format="HH:mm" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ScheduleEditor;