import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'; // 👈 เอา MailOutlined ออก
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
// import { RegisterRequest } from '../interfaces'; // ไม่ต้องใช้ก็ได้ สร้าง payload ตรงๆ เลยง่ายกว่า

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    // 1. เช็คความยาวรหัสผ่าน (Backend กำหนดขั้นต่ำ 6 ตัว)
    if (values.password.length < 6) {
      setErrorMsg("รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษรครับ 🔒");
      return;
    }

    // 2. เช็คว่ารหัสผ่านตรงกัน
    if (values.password !== values.confirmPassword) {
      setErrorMsg("รหัสผ่านไม่ตรงกันครับ! ❌");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 3. เตรียมข้อมูล (Backend รับแค่ username, password)
      const payload = {
        username: values.username,
        password: values.password
      };
      
      // 4. ยิงไปที่ /users (ตาม UsersController ใน Backend)
      await api.post('/users', payload);

      alert("สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน 🦁");
      navigate('/login');
      
    } catch (error: any) {
      // ดึง Error Message จาก Backend (ถ้ามี)
      const message = error.response?.data?.message || 'สมัครไม่สำเร็จ ชื่อนี้อาจมีคนใช้แล้ว';
      
      // แปลง error เป็น string ถ้ามันมาเป็น array (NestJS ชอบส่งมาเป็น array)
      const displayMsg = Array.isArray(message) ? message.join(', ') : message;
      setErrorMsg(displayMsg);
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
      backgroundColor: '#f0f2f5' 
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={2}>🦁 สร้างบัญชีใหม่</Title>
        </div>

        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'กรุณาตั้งชื่อผู้ใช้!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>

          {/* ❌ ลบช่อง Email ออกครับ Backend ไม่ได้รับ */}

          <Form.Item
            label="Password (ขั้นต่ำ 6 ตัว)"
            name="password"
            rules={[{ required: true, message: 'กรุณาตั้งรหัสผ่าน!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: 'กรุณายืนยันรหัสผ่าน!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              สมัครสมาชิก
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            มีบัญชีอยู่แล้ว? <Link to="/login">ล็อกอินที่นี่</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;