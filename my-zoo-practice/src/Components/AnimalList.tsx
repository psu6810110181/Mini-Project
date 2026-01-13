import React from 'react';
import { Row, Col, Typography, Divider } from 'antd';
import AnimalCard from './AnimalCard';
import { type Species } from '../types';

const { Title } = Typography;

interface AnimalListProps {
  species: Species[];
  // ❌ ลบ onRefresh ออก ไม่ต้องใช้แล้ว
}

const AnimalList = ({ species }: AnimalListProps) => {
  return (
    <div>
      {species.map((specie) => (
        <div key={specie.id} style={{ marginBottom: 40 }}>
          
          <Divider style={{ borderColor: '#8c8c8c' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              ▍ {specie.name}
            </Title>
          </Divider>

          <Row gutter={[16, 16]}>
            {specie.animals.map((animal) => (
              <Col xs={24} sm={12} md={8} lg={6} key={animal.id}>
                <AnimalCard 
                  id={animal.id}
                  name={animal.name}
                  image_url={animal.image_url}
                  characteristics={animal.characteristics}
                  like_count={animal.like_count}
                  // ❌ ไม่ต้องส่ง onRefresh แล้ว
                />
              </Col>
            ))}
          </Row>

        </div>
      ))}
    </div>
  );
};

export default AnimalList;