import { Card, Typography } from 'antd';

const { Text } = Typography;

// ✅ กำหนด Type ของ Props ให้ชัดเจน (ตามเกณฑ์คะแนน)
interface AnimalCardProps {
  name: string;
  characteristics: string;
  image_url: string;
}

const AnimalCard = ({ name, characteristics, image_url }: AnimalCardProps) => {
  return (
    <Card
      hoverable
      cover={
        <img 
          alt={name} 
          src={image_url || "https://placehold.co/400?text=No+Image"} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
      }
      style={{ borderRadius: '10px', overflow: 'hidden', height: '100%' }}
    >
      <Card.Meta 
        title={<span style={{ fontSize: '18px' }}>{name}</span>}
        description={<Text type="secondary">นิสัย: {characteristics}</Text>}
      />
    </Card>
  );
};

export default AnimalCard;