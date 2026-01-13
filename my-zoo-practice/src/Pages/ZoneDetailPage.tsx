import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api';
import AnimalList from '../Components/AnimalList';
import { type ZoneData } from '../types';

const { Title, Paragraph } = Typography;

const ZoneDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. ฟังก์ชันดึงข้อมูล (เอาไว้ใช้ตอนโหลดหน้าเว็บครั้งแรก)
  const fetchZoneData = useCallback(() => {
    api.get<ZoneData>(`/zones/${id}`)
      .then((res) => {
        setZone(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // 2. เรียกใช้ฟังก์ชันเมื่อเข้าหน้าเว็บ
  useEffect(() => {
    fetchZoneData();
  }, [fetchZoneData]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!zone) return <div style={{ textAlign: 'center' }}>ไม่พบข้อมูลโซนนี้</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ปุ่มย้อนกลับ */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')} 
        style={{ marginBottom: 20, border: 'none', background: 'transparent' }}
      >
        กลับไปหน้าแผนที่
      </Button>

      {/* ส่วนหัวข้อมูลโซน */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
         {/* ถ้ามีรูปโซนให้โชว์ ถ้าไม่มีให้ข้ามไป หรือใส่รูป Default ก็ได้ */}
         {zone.image_url && (
             <img 
               src={zone.image_url} 
               alt={zone.name}
               style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
             />
         )}
         <Title level={1} style={{ marginTop: 20 }}>{zone.name}</Title>
         <Paragraph type="secondary" style={{ fontSize: 16 }}>{zone.description}</Paragraph>
      </div>

      {/* 3. แสดงรายการสัตว์ (ไม่ต้องส่ง onRefresh แล้ว) */}
      {zone.species && (
        <AnimalList 
            species={zone.species} 
            // ❌ ลบ onRefresh={fetchZoneData} ออกไปเลยครับ
        />
      )}

    </div>
  );
};

export default ZoneDetailPage;