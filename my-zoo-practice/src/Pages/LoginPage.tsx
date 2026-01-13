import React, { useState } from 'react';
import { Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { jwtDecode } from "jwt-decode"; 

const { Title } = Typography;

const LoginPage = () => {
  const { login } = useAuth();
  
  // 1. กำหนด State เริ่มต้น
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2. ฟังก์ชัน Handle Change (ตามโจทย์ React.ChangeEvent)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Log ดูว่าพิมพ์แล้วค่าเข้าไหม
    // console.log(`Typing in ${e.target.name}: ${e.target.value}`);
    
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  // 3. ฟังก์ชัน Submit (ตามโจทย์ React.FormEvent)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🛑 ห้ามลืม!
    
    // 🔍 เช็คก่อนส่ง: ดูว่าใน formData มีค่าไหม?
    console.log("🚀 กำลังส่งข้อมูล:", formData);

    if (!formData.username || !formData.password) {
      setErrorMsg("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post('/auth/login', formData);
      console.log("✅ Server ตอบกลับ:", res.data);

      const token = res.data.access_token;
      
      if (token) {
        // --- ส่วนแกะ Token เพื่อเอา userId (เหมือนเดิม) ---
        try {
            const decoded: any = jwtDecode(token);
            const userId = decoded.sub || decoded.id || decoded.userId;
            if (userId) {
                localStorage.setItem('userId', userId);
                console.log("💾 Saved UserID:", userId);
            }
        } catch (err) {
            console.warn("⚠️ แกะ Token ไม่ได้ (แต่ Login ผ่าน)");
        }
        // ---------------------------------------------

        login(token); 
        localStorage.setItem('role', res.data.role || 'user'); 
        message.success(`ยินดีต้อนรับ!`);
        window.location.href = '/'; 
      } else {
        throw new Error('ไม่พบ Token');
      }

    } catch (error: any) {
      console.error("❌ Login Error:", error);
      setErrorMsg(error.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={2}>🔐 เข้าสู่ระบบ</Title>
        </div>

        {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}

        {/* ✅ ใช้ <form> HTML ปกติ */}
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Username</label>
            {/* 👇 จุดสำคัญ 1: ต้องมี name="username" และ value={formData.username} */}
            <Input 
              name="username" 
              value={formData.username}
              onChange={handleChange} 
              prefix={<UserOutlined />} 
              placeholder="Username" 
              size="large" 
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Password</label>
            {/* 👇 จุดสำคัญ 2: ต้องมี name="password" และ value={formData.password} */}
            <Input.Password 
              name="password"
              value={formData.password}
              onChange={handleChange} 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large" 
            />
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            เข้าสู่ระบบ
          </Button>

          <div style={{ textAlign: 'center', marginTop: 15 }}>
            ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกเลย</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;