import React from 'react';
import { Layout, Button, Typography, Space, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      background: '#001529', 
      padding: '0 20px' 
    }}>
      {/* โลโก้หรือชื่อแอป */}
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
        🦁 Zoo System
      </div>

      {/* ส่วนขวา: แสดงชื่อ User และปุ่ม Logout */}
      {user && (
        <Space>
          <Text style={{ color: 'white' }}>
            <UserOutlined style={{ marginRight: 8 }} />
            {user.username} ({user.role})
          </Text>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            size="small"
          >
            Logout
          </Button>
        </Space>
      )}
    </Header>
  );
};

export default Navbar;