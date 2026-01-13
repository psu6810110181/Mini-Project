import { useState, useEffect } from 'react';
import { Typography, Spin } from 'antd'; 
import axios from 'axios';
import mapImage from '../assets/zoo-map.png';

// 👇 เรียกใช้ ZoneList ตัวเดียวจบ (ไม่ต้อง import Card, Button, Row, Col แล้ว)
import ZoneList from '../components/zones/ZoneList'; 

const { Title } = Typography;

interface Zone {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const ZonesPage = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/zones')
      .then((response) => {
        setZones(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* ส่วนแผนที่ (ถ้าจะแยกเป็น InteractiveMap ก็ทำได้ในอนาคต) */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <Title level={2}>🗺️ แผนที่สวนสัตว์ (Zoo Map)</Title>
        <img 
          src={mapImage} 
          alt="Zoo Map" 
          style={{ width: '100%', maxWidth: '900px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} 
        />
      </div>

      <Title level={3} style={{ marginBottom: '20px' }}>📍 เลือกโซนที่ต้องการเข้าชม</Title>
      
      {/* 👇 โค้ดเหลือแค่นี้เอง! สั้นและอ่านง่ายมาก */}
      <ZoneList zones={zones} />

    </div>
  );
};

export default ZonesPage;