// src/Components/Navbar.tsx
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  // เช็คว่าเป็น Admin หรือไม่
  const isAdmin = localStorage.getItem('role')?.toUpperCase() === 'ADMIN';

  const handleLogout = () => {
      // 1. เรียกฟังก์ชัน logout เดิม (ที่เคลียร์ token)
      logout();

      // 2. ✅ เพิ่ม: ลบ userId และ role ออกให้เกลี้ยง (กันพลาด)
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('token'); // เผื่อใน useAuth ลบไม่หมด

      // 3. ✅ เปลี่ยนจาก navigate เป็น window.location.href
      // เพื่อบังคับ Browser ให้โหลดใหม่ ล้างค่า State ทุกอย่างทิ้ง
      // วิธีนี้ชัวร์ที่สุดสำหรับการ Logout ครับ
      window.location.href = '/login'; 
    };

  const items = [
    { key: '/', label: <Link to="/">หน้าแรก</Link> },
    // 👇 เพิ่มเมนู Admin ตรงนี้ (แสดงเฉพาะ Admin)
    ...(isAdmin ? [{ 
      key: '/admin', 
      label: <Link to="/admin" style={{ color: '#ffec3d' }}>⚙️ จัดการข้อมูล</Link> 
    }] : []),
  ];

  return (
    <Header style={{ display: 'flex',height:'100px',  alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ color: 'white',fontSize: '32px', fontWeight: 'bold', marginRight: '20px' }}>
        🦁 Zoo App
      </div>
      
      <Menu 
        theme="dark" 
        mode="horizontal" 
        selectedKeys={[location.pathname]} 
        items={items} 
        style={{ flex: 1, minWidth: 0 }} 
      />

      <div>
        {isAuthenticated ? (
          <Button type="primary" danger onClick={handleLogout}>ออกจากระบบ</Button>
        ) : (
          <Link to="/login"><Button type="primary">เข้าสู่ระบบ</Button></Link>
        )}
      </div>
    </Header>
  );
};

export default Navbar;