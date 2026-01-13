import React from 'react';
import { Tabs } from 'antd';
// Import Component ที่เราแยกออกมา
import ManageZones from '../Components/Admin/ManageZones';
import ManageSpecies from '../Components/Admin/ManageSpecies';
import ManageAnimals from '../Components/Admin/ManageAnimals';

const AdminPage = () => {
  const items = [
    { key: '1', label: 'จัดการโซน (Zones)', children: <ManageZones /> },
    { key: '2', label: 'จัดการสายพันธุ์ (Species)', children: <ManageSpecies /> },
    { key: '3', label: 'จัดการสัตว์ (Animals)', children: <ManageAnimals /> },
  ];

  return (
    <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
      <h1>⚙️ จัดการข้อมูลสวนสัตว์ (Admin Dashboard)</h1>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default AdminPage;