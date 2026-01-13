import { Routes, Route, Navigate } from 'react-router-dom'; // 👈 import Navigate มาเพิ่ม
import { Layout } from 'antd';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import { useAuth } from './AuthContext';
import { type ReactNode } from 'react';
import RegisterPage from './pages/RegisterPage';
import ZoneDetailPage from './pages/ZoneDetailPage';

const { Content } = Layout;

// ตัวกันคนนอก (เหมือนเดิม)
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        {/* หน้า Login และ Register (ไม่ต้องมี Navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* หน้าที่ต้อง Login แล้ว (Private Zones) */}
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
              <>
                <Navbar /> 
                <Content style={{ padding: '24px' }}>
                  <Routes>
                    {/* 👇 1. ถ้าเข้า path "/" เฉยๆ ให้เด้งไป "/zone" */}
                    <Route path="/" element={<Navigate to="/zone" replace />} />

                    {/* 👇 2. เปลี่ยน path ของ HomePage เป็น "/zone" */}
                    <Route path="/zone" element={<HomePage />} />
                    <Route path="/zone/:id" element={<ZoneDetailPage />} />
                    
                    {/* ตรงนี้รองรับหน้าย่อยๆ ในอนาคตได้อีก เช่น /zone/:id */}
                  </Routes>
                </Content>
              </>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Layout>
  );
}

export default App;