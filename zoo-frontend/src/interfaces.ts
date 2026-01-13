export interface LoginRequest {
  username: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserProfile {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

export interface RegisterRequest {
  username: string;
  password: string;
}

// --- 🦁 Zoo Data ---

export interface Zone {
  id: string;      // 👈 แก้เป็น string
  name: string;
  species?: Species[];
}

export interface Species {
  id: string;      // 👈 แก้เป็น string
  name: string;
  zoneId?: string; // 👈 Foreign Key ก็ต้องเป็น string ตาม
  zone?: Zone;
  animals?: Animal[];
}

export interface Animal {
  id: string;      // 👈 แก้เป็น string
  name: string;
  characteristics: string;
  image_url?: string;
  speciesId?: string; // 👈 Foreign Key ก็ต้องเป็น string ตาม
  species?: Species;
}

// --- ❤️ Interaction ---

export interface LikeResponse {
  message: string;
  status: 'liked' | 'unliked';
}