import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

// 1. กำหนดสเปคกล่อง props 📦
interface ZoneCardProps {
  id: string;         // ต้องรับ ID เพื่อเอาไว้ทำลิ้งก์
  name: string;       // ชื่อโซน
  description: string;// คำอธิบาย
  image_url: string;  // รูปภาพ
}

// 2. สร้าง Component รับ props
const ZoneCard = (props: ZoneCardProps) => {
  const navigate = useNavigate(); // ตัวช่วยเปลี่ยนหน้า

  return (
    <Card
      hoverable
      style={{ width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden' }}
      cover={
        <img 
          alt={props.name} 
          src={props.image_url} 
          style={{ height: '200px', objectFit: 'cover' }} 
        />
      }
    >
      {/* หยิบของออกจากกล่อง props มาใช้ */}
      <h3>{props.name}</h3>
      <p style={{ color: '#666' }}>{props.description}</p>
      
      {/* ปุ่มกดแล้วไปหน้า Detail */}
      <Button 
        type="primary" 
        block 
        onClick={() => navigate(`/zone/${props.id}`)}
      >
        ดูสัตว์ในโซนนี้ 👉
      </Button>
    </Card>
  );
};

export default ZoneCard;