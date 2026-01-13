import React, { useState } from 'react';
import { Form, Input, Button, Card, Checkbox, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // เรียกใช้ axios ที่เราตั้งค่าไว้
import { useAuth } from '../AuthContext'; // เรียกใช้ระบบ Login ที่เราทำตะกี้
import { type LoginRequest, type AuthResponse } from '../interfaces'; // เรียกใช้ Type
import { Link } from 'react-router-dom';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ดึงฟังก์ชัน login จาก Context มาใช้
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ฟังก์ชันเมื่อกดปุ่ม Login
  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. ยิง API ไปที่ Backend (สังเกตว่าไม่ต้องพิมพ์ http://localhost... แล้ว)
      const {data} = await api.post<AuthResponse>('/auth/login', values);
      
      // 2. ถ้าผ่าน ให้บอก Context ว่า "เฮ้ย ล็อกอินแล้วนะ"
      // (Context จะจัดการเก็บ Token ลง LocalStorage ให้เอง ตามที่เราเขียนไว้)
      login(data.access_token);

      // 3. ดีดไปหน้าแรก
      navigate('/');
      
    } catch (error: any) {
      // ถ้าพัง ให้โชว์ Error สวยๆ
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5' // สีพื้นหลังเทาอ่อนๆ แบบ Dashboard
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={2}>🦁 Zoo Login</Title>
          <p style={{ color: '#888' }}>Welcome back, Zookeeper!</p>
        </div>

        {errorMsg && (
          <Alert 
            message="Error" 
            description={errorMsg} 
            type="error" 
            showIcon 
            style={{ marginBottom: 16 }} 
          />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="password" size="large" />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Log in
            </Button>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
                ยังไม่มีบัญชีใช่ไหม? <Link to="/register">สมัครสมาชิกเลย!</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;