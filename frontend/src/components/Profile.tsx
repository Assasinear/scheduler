import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Button, Card, Col, Row, Avatar, List } from 'antd';
import { getGroups, getTeachers, getRooms, getSchedules } from '../api';

const Profile: React.FC = () => {
    const [user, setUser] = useState<{ email: string, name: string }>({ email: '', name: '' });
    const [groupsCount, setGroupsCount] = useState(0);
    const [teachersCount, setTeachersCount] = useState(0);
    const [roomsCount, setRoomsCount] = useState(0);
    const [schedulesCount, setSchedulesCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userResponse = await axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: token } });
                    setUser(userResponse.data);
                    const groupsResponse = await getGroups();
                    setGroupsCount(groupsResponse.data.length);
                    const teachersResponse = await getTeachers();
                    setTeachersCount(teachersResponse.data.length);
                    const roomsResponse = await getRooms();
                    setRoomsCount(roomsResponse.data.length);
                    const schedulesResponse = await getSchedules();
                    setSchedulesCount(schedulesResponse.data.length);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    };

    return (
        <Layout.Content style={{ padding: '50px' }}>
            <Card title="Профиль пользователя" bordered={false}>
                <Row gutter={16} align="middle">
                    <Col span={4}>
                        <Avatar size={64}>{user.name[0]}</Avatar>
                    </Col>
                    <Col span={20}>
                        <p>Имя: {user.name}</p>
                        <p>Email: {user.email}</p>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card title="Количество групп" bordered={false} style={{ height: '100%' }}>
                            <p>{groupsCount}</p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Количество преподавателей" bordered={false} style={{ height: '100%' }}>
                            <p>{teachersCount}</p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Количество аудиторий" bordered={false} style={{ height: '100%' }}>
                            <p>{roomsCount}</p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Количество расписаний" bordered={false} style={{ height: '100%' }}>
                            <p>{schedulesCount}</p>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '30px' }}>
                    <Col span={12}>
                        <Card title="Последние действия" bordered={false}>
                            <List
                                dataSource={[
                                    'Вход в систему',
                                    'Редактирование группы',
                                    'Создание расписания',
                                    'Удаление преподавателя'
                                ]}
                                renderItem={item => <List.Item>{item}</List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Button type="primary" onClick={handleLogout} style={{ marginTop: '20px' }}>Выйти</Button>
                    </Col>
                </Row>
            </Card>
        </Layout.Content>
    );
};

export default Profile;