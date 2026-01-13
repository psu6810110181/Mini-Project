import { Card, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

// กำหนด Type ของข้อมูลที่จะรับเข้ามา (Props)
interface ZoneCardProps {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const ZoneCard = ({ id, name, description, image_url }: ZoneCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      style={{ height: '100%', borderRadius: '10px', overflow: 'hidden' }}
      cover={
        <img 
          alt={name} 
          src={image_url || 'https://placehold.co/400x250?text=No+Image'} 
          style={{ height: '180px', objectFit: 'cover' }}
        />
      }
      actions={[
        <Button type="primary" onClick={() => navigate(`/zone/${id}`)}>
          ดูสัตว์ในโซนนี้ 👉
        </Button>
      ]}
    >
      <Card.Meta
        title={<span style={{ fontSize: '18px' }}>{name}</span>}
        description={
          <Paragraph ellipsis={{ rows: 2, expandable: false }}>
            {description || "ยังไม่มีคำอธิบาย..."}
          </Paragraph>
        }
      />
    </Card>
  );
};

export default ZoneCard;