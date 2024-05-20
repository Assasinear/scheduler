import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import Title from "antd/lib/typography/Title";

const AuthForm: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            window.location.href = '/';
        }
    }, []);

    const onFinish = async (values: { email: string, password: string }) => {
        try {
            const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
            const response = await axios.post(url, values);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (error) {
            message.error('Ошибка авторизации!');
        }
    };

    return (
        <Row justify="center" align="middle" style={{ height: '80vh' }}>
            <Col xs={20} sm={12} md={8}>
                <Title style={{marginLeft: '80px'}}>Конструктор расписаний</Title>
                <Form name="auth" onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ required: true, message: 'Пожалуйста, введите электронную почту!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Электронная почта" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </Button>
                        <Button type="link" onClick={() => setIsLogin(!isLogin)} block>
                            {isLogin ? 'Переключиться на регистрацию' : 'Переключиться на вход'}
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default AuthForm;