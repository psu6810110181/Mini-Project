import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { type LoginRequest } from '../types';

// 👇 1. เพิ่มบรรทัดนี้เพื่อนำเข้าตัวแกะรหัส
import { jwtDecode } from "jwt-decode"; 

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.post('/auth/login', values);
      const token = res.data.access_token;
      
      const userRole = res.data.role || 'user'; 

      if (token) {
        // 👇 2. จุดเปลี่ยนสำคัญ: แกะรหัส Token ตรงนี้เลย!
        try {
            const decoded: any = jwtDecode(token);
            console.log("🔓 ข้อมูลที่แกะได้จาก Token:", decoded); // ดู Console ว่า ID ชื่ออะไร

            // โดยปกติ ID จะอยู่ในชื่อ 'sub', 'id', หรือ 'userId'
            const userId = decoded.sub || decoded.id || decoded.userId;

            if (userId) {
                localStorage.setItem('userId', userId); // ✅ บันทึกสำเร็จ!
                console.log("✅ Save userId เรียบร้อย:", userId);
            } else {
                 console.error("⚠️ แกะ Token แล้วแต่ไม่เจอ ID (ลองดู Console ว่ามันชื่อ key อะไร)");
            }
        } catch (e) {
            console.error("แกะ Token ไม่สำเร็จ:", e);
        }

        // Login ตามปกติ
        login(token); 
        localStorage.setItem('role', userRole); 
        message.success(`ยินดีต้อนรับ!`);
        navigate('/'); 

      } else {
        setErrorMsg('ไม่พบ Token ในการตอบกลับ');
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'เข้าสู่ระบบล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (ส่วน UI เหมือนเดิม ไม่ต้องแก้)
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={2}>🔐 เข้าสู่ระบบ</Title>
        </div>

        {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'กรุณาใส่ชื่อผู้ใช้' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'กรุณาใส่รหัสผ่าน' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            เข้าสู่ระบบ
          </Button>

          <div style={{ textAlign: 'center', marginTop: 15 }}>
            ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกเลย</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;