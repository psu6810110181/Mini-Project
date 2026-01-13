import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ZoneDetailPage from './Pages/ZoneDetailPage';
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import MainLayout from "./Layout/MainLayout"; // 👈 อย่าลืม import
import AdminPage from "./Pages/AdminPage";
import AdminRoute from "./Components/AdminRoute";

// ตัวเช็ค Login (เหมือนเดิม)
const PrivateRoute = () => {
  const token = localStorage.getItem('token'); 
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div>
      <Routes>
        {/* --- โซนคนนอก --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- โซนคนใน (Protected) --- */}
        <Route element={<PrivateRoute />}>
          
          {/* 👇 เพิ่ม MainLayout ครอบไว้ตรงนี้! */}
          <Route element={<MainLayout />}>
             <Route path="/" element={<HomePage />} />
             <Route path="/zone/:id" element={<ZoneDetailPage />} />
             <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } 
              />
             </Route>

        </Route>

      </Routes>
    </div>
  );
}

export default App;