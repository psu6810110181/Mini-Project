import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';

export default function MainLayout() {
  return (
    <div>
      {/* 1. เอา Navbar มาวางไว้ข้างบนสุด */}
      <Navbar />

      {/* 2. ส่วนเนื้อหาของแต่ละหน้า (Home, ZoneDetail) จะโผล่ตรงนี้ */}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}