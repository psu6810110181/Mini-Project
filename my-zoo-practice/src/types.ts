// src/types.ts

// --- 🦁 ข้อมูลเกี่ยวกับสัตว์และโซน ---
export interface Animal {
  id: string;
  name: string;
  image_url: string;
  characteristics: string;
  like_count: number;
}

export interface Species {
  id: string;
  name: string;
  animals: Animal[];
}

export interface ZoneData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  species: Species[]; 
}

// --- 👤 ข้อมูล User ---
export interface User {
  id: string;
  email: string;
  name: string;
}

// src/interfaces.ts

// --- สำหรับสมัครสมาชิก (Register) ---
export interface RegisterRequest {
  username: string;     // Backend ใช้ตัวนี้เป็น Unique
  password: string;     // ขั้นต่ำ 6 ตัวตาม DTO
  confirmPassword: string; // ✅ เพิ่มไว้สำหรับเช็คหน้าบ้านตามไอเดียคุณ
}

// --- สำหรับเข้าสู่ระบบ (Login) ---
export interface LoginRequest {
  username: string;     // ใช้ username ตาม AuthService
  password: string;
}

// --- สำหรับรับบัตรผ่าน (Response) ---
export interface AuthResponse {
  access_token: string; // Backend ส่งคืนมาเป็นก้อนนี้
}