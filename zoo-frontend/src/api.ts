// src/api.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';

// 1. สร้าง Instance ของ Axios และกำหนด Base URL ของ Backend เรา
const api = axios.create({
  baseURL: 'http://localhost:3000', // 👈 ตรวจสอบด้วยนะครับว่า Backend รันที่พอร์ต 3000 ไหม
});

// 2. ทำ Interceptor (ด่านตรวจก่อนส่ง Request)
// หน้าที่: แอบยัด Token ใส่กระเป๋าไปให้ทุกครั้ง ถ้ามี Token อยู่
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ดึง Token จาก LocalStorage (ที่เราจะเก็บตอน Login)
    const token = localStorage.getItem('token');
    
    if (token) {
      // ถ้ามี Token ให้แนบไปใน Header ชื่อ Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;