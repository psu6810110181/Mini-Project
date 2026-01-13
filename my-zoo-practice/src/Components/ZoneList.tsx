import { Row, Col } from 'antd';
import ZoneCard from './ZoneCard';

// เราก๊อป Interface มาวางที่นี่ด้วย (หรือจะแยกไฟล์กลางก็ได้ แต่ตอนนี้ก๊อปมาก่อน)
interface ZoneData {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

// ⭐ จุดสำคัญ: Props ของ List คือ "รับมาเป็นก้อน Array"
interface ZoneListProps {
  zones: ZoneData[]; 
}

const ZoneList = ({ zones }: ZoneListProps) => {
  return (
    // ย้ายส่วนจัดแถวมาไว้ที่นี่
    <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
      {zones.map((zone) => (
        <Col xs={24} sm={12} md={8} lg={6} key={zone.id}>
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