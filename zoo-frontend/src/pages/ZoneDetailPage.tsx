import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Typography, Spin, Divider, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

// ✅ เรียกใช้ Component ย่อยที่เราเพิ่งสร้าง
import AnimalCard from '../components/animals/AnimalCard';

const { Title, Paragraph } = Typography;

// --- กำหนด Interfaces สำหรับรับข้อมูลจาก API ---
interface Animal {
  id: string;
  name: string;
  characteristics: string;
  image_url: string;
}

interface Species {
  id: string;
  name: string;
  animals: Animal[];
}

interface ZoneDetail {
  id: string;
  name: string;
  description: string;
  image_url: string;
  species: Species[];
}

const ZoneDetailPage = () => {
  const { id } = useParams(); // รับ id จาก URL
  const navigate = useNavigate(); // ตัวช่วยเปลี่ยนหน้า
  
  // ✅ กำหนด Type ให้ State เสมอ
  const [zone, setZone] = useState<ZoneDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // ยิง API ไปขอข้อมูลโซน + สัตว์ข้างใน
    axios.get(`http://localhost:3000/zones/${id}`)
      .then((res) => {
        setZone(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching zone:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" /></div>;
  if (!zone) return <div style={{ textAlign: 'center', marginTop: 100 }}><Empty description="ไม่พบข้อมูลโซนนี้" /></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* 🔙 ปุ่มย้อนกลับ */}
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')} 
        style={{ marginBottom: 20, fontSize: '16px' }}
      >
        กลับไปหน้าแผนที่
      </Button>

      {/* 🖼️ ส่วนหัว: รูปและชื่อโซน */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <img 
          src={zone.image_url} 
          alt={zone.name} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '15px', marginBottom: 20 }}
        />
        <Title level={1}>{zone.name}</Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>{zone.description}</Paragraph>
      </div>

      <Divider>🐾 สัตว์ในโซนนี้</Divider>

      {/* 🦁 Loop แสดงสัตว์ (แบ่งตามสายพันธุ์) */}
      {zone.species && zone.species.length > 0 ? (
        zone.species.map((specie) => (
          <div key={specie.id} style={{ marginBottom: '40px' }}>
            
            {/* หัวข้อสายพันธุ์ */}
            <Title level={3} style={{ borderLeft: '5px solid #1890ff', paddingLeft: '10px' }}>
              {specie.name}
            </Title>
            
            {/* Grid การ์ดสัตว์ */}
            <Row gutter={[16, 16]}>
              {specie.animals.map((animal) => (
                <Col xs={24} sm={12} md={8} lg={6} key={animal.id}>
                  
                  {/* 👇 เรียกใช้ AnimalCard ที่นี่! */}
                  <AnimalCard 
                    name={animal.name}
                    characteristics={animal.characteristics}
                    image_url={animal.image_url}
                  />

                </Col>
              ))}
            </Row>
          </div>
        ))
      ) : (
        <Empty description="ยังไม่มีสัตว์ในโซนนี้" />
      )}
    </div>
  );
};

export default ZoneDetailPage;