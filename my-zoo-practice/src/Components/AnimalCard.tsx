import React from 'react';
import { Card } from 'antd';
import { type Animal } from '../types';
import LikeWidget from './LikeWidget';

interface AnimalCardProps extends Animal {}

const AnimalCard = (props: AnimalCardProps) => {
  const { id, name, characteristics, image_url, like_count } = props;

  return (
    <Card
      hoverable
      style={{ borderRadius: '10px', overflow: 'hidden' }}
      cover={
        <div style={{ position: 'relative', height: '200px' }}>
          <img
            alt={name}
            src={image_url || "https://placehold.co/400?text=No+Image"}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      }
    >
      <Card.Meta
        title={<span style={{ fontSize: '18px' }}>{name}</span>}
        description={
          <div>
            <p style={{ 
               minHeight: '45px', 
               overflow: 'hidden', 
               textOverflow: 'ellipsis', 
               display: '-webkit-box', 
               WebkitLineClamp: 2, 
               WebkitBoxOrient: 'vertical' 
            }}>
               {characteristics || 'ไม่มีข้อมูลนิสัย'}
            </p>
            
            <div style={{ marginTop: '15px', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
               <LikeWidget 
                  animalId={id} 
                  initialLikeCount={like_count || 0}
               />
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default AnimalCard;