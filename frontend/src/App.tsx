import React, {JSX, useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, message, Row, Col, Card, Button } from 'antd';
import AuthForm from './components/AuthForm';
import Rooms from './components/Rooms';
import Teachers from './components/Teachers';
import Groups from './components/Groups';
import ScheduleManager from './components/ScheduleManager';
import Profile from './components/Profile';
import ScheduleEditor from './components/ScheduleEditor';
import './App.css';

const { Header, Content } = Layout;

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/auth" />;
};

const HomePage: React.FC = () => {
    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Card title="Добро пожаловать в Конструктор расписаний" bordered={false}>
                    <p>Этот сервис позволяет вам управлять расписаниями, группами, преподавателями и аудиториями. Вы можете создавать, редактировать и оптимизировать расписания, чтобы облегчить организацию учебного процесса.</p>
                </Card>
            </Col>
            <Col span={12}>
                <Card title="Новости" bordered={false}>
                    <p>01.10.2023 - Новая версия системы с улучшенными функциями и удобным интерфейсом.</p>
                    <p>15.09.2023 - Введены изменения в расписание, чтобы учесть новые группы.</p>
                </Card>
            </Col>
            <Col span={12}>
                <Card title="Быстрый доступ" bordered={false}>
                    <Button type="primary" block style={{ marginBottom: '10px' }}>
                        <Link to="/groups">Управление группами</Link>
                    </Button>
                    <Button type="primary" block style={{ marginBottom: '10px' }}>
                        <Link to="/teachers">Управление преподавателями</Link>
                    </Button>
                    <Button type="primary" block style={{ marginBottom: '10px' }}>
                        <Link to="/rooms">Управление аудиториями</Link>
                    </Button>
                    <Button type="primary" block style={{ marginBottom: '10px' }}>
                        <Link to="/schedule">Просмотр расписаний</Link>
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        message.success('Вы успешно вышли из системы');
        window.location.href = '/auth';
    };

    return (
        <Router>
            <Layout>
                <Header>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1"><Link to="/">Главная</Link></Menu.Item>
                        {isAuthenticated && (
                            <>
                                <Menu.Item key="2"><Link to="/rooms">Аудитории</Link></Menu.Item>
                                <Menu.Item key="3"><Link to="/teachers">Преподаватели</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/groups">Группы</Link></Menu.Item>
                                <Menu.Item key="5"><Link to="/schedule">Расписания</Link></Menu.Item>
                                <Menu.Item key="6"><Link to="/profile">Профиль</Link></Menu.Item>
                                <Menu.Item key="8" onClick={handleLogout}>Выйти</Menu.Item>
                            </>
                        )}
                        {!isAuthenticated && <Menu.Item key="7"><Link to="/auth">Вход</Link></Menu.Item>}
                    </Menu>
                </Header>
                <Content style={{ padding: '50px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthForm />} />
                        <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
                        <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
                        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
                        <Route path="/schedule" element={<ProtectedRoute><ScheduleManager /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/schedule/:id" element={<ProtectedRoute><ScheduleEditor /></ProtectedRoute>} />
                    </Routes>
                </Content>
            </Layout>
        </Router>
    );
};

export default App;