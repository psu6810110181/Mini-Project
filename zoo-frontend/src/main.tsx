import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 👇 1. ต้องเรียก 2 ตัวนี้มาด้วยครับ
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 2. ต้องหุ้มด้วย BrowserRouter ก่อน (เพื่อให้เปลี่ยนหน้าได้) */}
    <BrowserRouter>
      {/* 👇 3. แล้วหุ้มด้วย AuthProvider (เพื่อให้ Login ได้) */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)