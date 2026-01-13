import { Row, Col, Empty } from 'antd';
import ZoneCard from './ZoneCard'; // 👈 เรียกใช้ ZoneCard ที่เพิ่งสร้าง

interface Zone {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface ZoneListProps {
  zones: Zone[];
}

const ZoneList = ({ zones }: ZoneListProps) => {
  if (zones.length === 0) return <Empty description="ไม่พบข้อมูลโซน" />;

  return (
    <Row gutter={[24, 24]}>
      {zones.map((zone) => (
        <Col xs={24} sm={12} md={12} lg={6} key={zone.id}>
          {/* 👇 ส่งข้อมูลเข้าไปใน Card ทีละใบ */}
          <ZoneCard 
            id={zone.id}
            name={zone.name}
            description={zone.description}
            image_url={zone.image_url}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ZoneList;