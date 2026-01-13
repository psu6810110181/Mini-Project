import React, { createContext, useState, useEffect,type ReactNode,useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { type UserProfile } from './interfaces';

// กำหนดหน้าตาของ Context ว่าจะมีฟังก์ชันอะไรให้เรียกใช้บ้าง
interface AuthContextType {
  user: UserProfile | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// สร้าง Context (ค่าเริ่มต้นเป็น null)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// สร้าง Provider (ตัวหุ้มแอพ)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ฟังก์ชันเช็ค Token เมื่อเปิดหน้าเว็บใหม่
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // แกะข้อมูลจาก Token มาเก็บไว้ใน State
        const decoded = jwtDecode<UserProfile>(token);
        setUser(decoded);
      } catch (error) {
        // ถ้า Token เสียหรือหมดอายุ ให้ลบทิ้ง
        console.error("Invalid token", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // ฟังก์ชัน Login (รับ Token มาแล้วบันทึก)
  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<UserProfile>(token);
    setUser(decoded);
  };

  // ฟังก์ชัน Logout (ลบทุกอย่าง)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook สำหรับเรียกใช้ Context ง่ายๆ (Custom Hook)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};