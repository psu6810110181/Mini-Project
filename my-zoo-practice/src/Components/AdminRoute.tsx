import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  // 👇 แก้ตรงนี้! จาก TSX.Element เป็น React.ReactNode
  children: React.ReactNode; 
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  // เช็ค Role จาก localStorage
  const role = localStorage.getItem('role')?.toUpperCase();

  // ถ้าไม่ใช่ ADMIN ให้ดีดกลับไปหน้าแรก (/) ทันที
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // ถ้าเป็น Admin อนุญาตให้เข้าไปได้
  return <>{children}</>;
};

export default AdminRoute;