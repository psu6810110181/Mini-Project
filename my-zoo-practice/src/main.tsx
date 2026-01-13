import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext.tsx' // 👈 นำเข้าตัว Provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 👈 เพิ่มตรงนี้ */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
