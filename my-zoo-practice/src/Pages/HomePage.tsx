import { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Spin } from 'antd';
import ZoneCard from '../Components/ZoneCard'; // 👈 นำเข้าตรายางอันใหม่
import mapImage from '../assets/zoo-map.png'; // สมมติว่าคุณมีรูปแผนที่ใน assets
import ZoneList from '../Components/ZoneList'; // 👈 เรียกใช้ ZoneList ที่เพิ่งสร้าง
import { type ZoneData } from '../types';
import api from '../api';

const { Title } = Typography

const HomePage = () => {
    const [zones, setZones] = useState<ZoneData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ดึงข้อมูลโซนจาก API
        api.get('/zones')
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
      
      {/* ส่วนหัว: รูปแผนที่ใหญ่ */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2}>🗺️ แผนที่สวนสัตว์ (Zoo Map)</Title>
        <img 
          src={mapImage} // (ใช้รูปตัวอย่าง map หรือรูปที่คุณมี)
          alt="Zoo Map"
          style={{ width: '80%', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
      </div>

      <Title level={4} style={{ textAlign: 'center' }}>📍 เลือกโซนที่ต้องการเข้าชม</Title>
      
{/* 👇 ตรงนี้!! โค้ดสั้นลงเยอะมาก */}
      {/* ส่งข้อมูล zones (Array) ไปให้ ZoneList จัดการต่อ */}
      <ZoneList zones={zones} />

    </div>
  );
};

export default HomePage;