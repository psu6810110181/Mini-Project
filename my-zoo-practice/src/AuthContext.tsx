import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from './api'; // เรียกใช้ axios ที่เราแต่งไว้

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ตรวจสอบ Token ตอนเปิดเว็บครั้งแรก
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // ฟังก์ชันล็อกอิน: รับ Token มาเก็บแล้วบอกว่า "ผ่าน!"
  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // ฟังก์ชันล็อกเอาท์: ลบ Token ทิ้ง
  const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');   // 👈 เพิ่ม: ลบ role
      localStorage.removeItem('userId'); // 👈 เพิ่ม: ลบ userId (สำคัญมากสำหรับแก้บั๊กหัวใจ)
      
      setIsAuthenticated(false);
    };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook สำหรับเรียกใช้ในหน้าอื่น (เช่น const { login } = useAuth();)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};