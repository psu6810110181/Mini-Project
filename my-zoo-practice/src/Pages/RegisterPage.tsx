import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // ใช้ api ตัวเก่งของเรา
import { type RegisterRequest } from '../types'; // ดึง Type มาใช้

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish = async (values: RegisterRequest & { confirmPassword?: string }) => {
    // 1. เช็คว่ารหัสผ่านตรงกันไหม (เช็คหน้าบ้านก่อนส่ง)
    if (values.password !== values.confirmPassword) {
      setErrorMsg("รหัสผ่านยืนยันไม่ตรงกันครับ ❌");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 2. ยิง API (ใช้ /users ตามที่คุณเคยแจ้งไว้ในแชทเก่า)
      await api.post('/users', { 
        username: values.username, 
        password: values.password 
      });
      
      message.success("สมัครสมาชิกสำเร็จ! กรุณาล็อกอินครับ 🦁");
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'สมัครไม่ผ่าน กรุณาลองใหม่';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={2}>🦁 สมัครสมาชิก Zoo</Title>
        </div>

        {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'กรุณาใส่ชื่อผู้ใช้' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'กรุณาใส่รหัสผ่าน' }, { min: 6, message: 'ขั้นต่ำ 6 ตัวอักษร' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true, message: 'กรุณายืนยันรหัสผ่าน' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            สมัครสมาชิก
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: 15 }}>
            มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบที่นี่</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;