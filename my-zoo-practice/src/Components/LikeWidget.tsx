import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../api';

interface LikeWidgetProps {
  animalId: string;
  initialLikeCount: number;
}

export default function LikeWidget({ animalId, initialLikeCount }: LikeWidgetProps) {
  const [likeCount, setLikeCount] = useState<number>(Number(initialLikeCount) || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [messageApi, contextHolder] = message.useMessage();

  // ดึง userId และ token
  const userId = localStorage.getItem('userId'); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    // 1. ล้างสถานะเก่าทิ้งก่อนเสมอ!
    setIsLiked(false); 

    const checkLikeStatus = async () => {
        // ถ้าไม่มี Token หรือ userId (คือไม่ได้ Login) ก็จบเลย เป็นสีขาว
        if (!token || !userId) {
             return; 
        }

        try {
            // 👇✅ แก้จุดนี้: เติม ?t=... ต่อท้าย เพื่อแก้ปัญหา Browser จำค่าเก่า (Cache)
            // พอ URL ไม่ซ้ำเดิม Browser จะถูกบังคับให้วิ่งไปถาม Server ใหม่จริงๆ
            const res = await api.get(`/likes/status/${animalId}?t=${new Date().getTime()}`);
            
            if (res.data.isLiked) {
                setIsLiked(true);
            }
        } catch (error) {
            console.error("เช็คสถานะไลค์ไม่ได้:", error);
            setIsLiked(false); 
        }
    };

    checkLikeStatus();
  }, [animalId, userId]); // userId เปลี่ยน -> โหลดใหม่

  const handleVote = async () => {
    if (loading) return;
    
    const prevCount = likeCount;
    const prevLiked = isLiked;

    // Optimistic Update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setLoading(true);

    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        messageApi.warning('กรุณาเข้าสู่ระบบก่อนโหวตครับ');
        // Rollback
        setIsLiked(prevLiked);
        setLikeCount(prevCount);
        setLoading(false);
        return;
      }

      const res = await api.post('/likes', { animalId });
      
      // Update with server data
      setLikeCount(res.data.currentLikeCount);
      setIsLiked(res.data.status === 'liked');

    } catch (error: any) {
      // Rollback on error
      setLikeCount(prevCount);
      setIsLiked(prevLiked);
      messageApi.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหวต');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {contextHolder}

      <button
        onClick={handleVote}
        disabled={loading}
        style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        }}
        className="transition-transform active:scale-90 hover:opacity-80"
      >
        {isLiked ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="24px" height="24px">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.75 3c1.99 0 3.751.984 4.75 2.499A5.89 5.89 0 0 1 17.25 3c3.036 0 5.5 2.322 5.5 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" width="24px" height="24px">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        )}

        <span style={{ color: 'red', fontWeight: 'bold', fontSize: '14px' }}>
            {isLiked ? 'Voted' : 'Vote'}
        </span>
      </button>
      
      <span style={{ color: '#666', fontSize: '14px', marginLeft: '5px' }}>
        {likeCount} คะแนน
      </span>
    </div>
  );
}