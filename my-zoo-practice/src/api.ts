import axios from 'axios';

// สร้าง instance ของ axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // หรือ URL backend ของคุณ
});

// ✅ 1. Request Interceptor: แนบ Token ทุกครั้งที่ยิง
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅✅ 2. Response Interceptor: จัดการเมื่อเกิด Error
api.interceptors.response.use(
  (response) => {
    // ถ้าสำเร็จ ให้ส่งข้อมูลกลับไปปกติ
    return response;
  },
  (error) => {
    // ถ้า Error เป็น 401 (Unauthorized) แปลว่า Token หมดอายุ หรือ ผิดคน
    if (error.response && error.response.status === 401) {
      
      console.warn("Session หมดอายุ หรือ Token ไม่ถูกต้อง -> กำลัง Logout...");

      // 👇👇👇 จุดสำคัญที่ต้องเพิ่ม: ล้างข้อมูลให้เกลี้ยง! 👇👇👇
      localStorage.removeItem('token');
      localStorage.removeItem('role'); 
      localStorage.removeItem('userId'); // 👈 เพิ่มบรรทัดนี้! เพื่อไม่ให้จำ user เก่า

      // 2. ดีดกลับไปหน้า Login
      // การใช้ window.location.href จะช่วยเคลียร์ State ของ React ทั้งหมดด้วย (ดีมากสำหรับเคสนี้)
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;