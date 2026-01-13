import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Image, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';

const ManageAnimals = () => {
  // State พื้นฐาน
  const [animals, setAnimals] = useState([]);
  const [speciesList, setSpeciesList] = useState([]); // เอาไว้ใส่ Dropdown
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // เก็บ ID ตัวที่กำลังแก้ (ถ้าเป็น null แปลว่าเพิ่มใหม่)
  const [editingId, setEditingId] = useState<number | null>(null); 
  const [editingName, setEditingName] = useState(""); // เก็บชื่อไว้โชว์หัวข้อ Modal สวยๆ
  
  const [form] = Form.useForm();

  // 1. ดึงข้อมูลสัตว์และสายพันธุ์
  const fetchData = async () => {
    try {
      const [resAnimals, resSpecies] = await Promise.all([
          api.get('/animals'), 
          api.get('/species')
      ]);
      setAnimals(resAnimals.data);
      setSpeciesList(resSpecies.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. ฟังก์ชันเปิด Modal แก้ไข (Logic เดียวกับ AnimalCard เป๊ะ!)
  const showEditModal = (record: any) => {
    setEditingId(record.id);
    setEditingName(record.name);
    
    // ✨ ยัดค่าใส่ฟอร์มทันทีเหมือนใน Card
    form.setFieldsValue({
      name: record.name,
      characteristics: record.characteristics, // ใช้ตัวแปรเดียวกับ Card
      image_url: record.image_url,
      speciesId: record.species?.id // เพิ่มแค่อันนี้เพื่อระบุสายพันธุ์
    });

    setIsModalOpen(true);
  };

  // 3. ฟังก์ชันเปิด Modal เพิ่มใหม่
  const showAddModal = () => {
    setEditingId(null);
    setEditingName("");
    form.resetFields(); // ล้างค่าเก่าทิ้ง
    setIsModalOpen(true);
  };

  // 4. บันทึกข้อมูล (รวม Add และ Edit)
  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        // Edit
        await api.patch(`/animals/${editingId}`, values);
        message.success('แก้ไขข้อมูลสำเร็จ!');
      } else {
        // Add
        await api.post('/animals', values);
        message.success('เพิ่มสัตว์ตัวใหม่สำเร็จ!');
      }
      
      setIsModalOpen(false);
      fetchData(); // โหลดตารางใหม่
    } catch (error) {
      console.error(error);
      message.error('บันทึกข้อมูลล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  // 5. ลบข้อมูล
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/animals/${id}`);
      message.success('ลบข้อมูลเรียบร้อย');
      fetchData();
    } catch (error) {
      message.error('ลบไม่สำเร็จ');
    }
  };

  // ตารางแสดงผล
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'ชื่อสัตว์', dataIndex: 'name' },
    { title: 'นิสัย', dataIndex: 'characteristics', ellipsis: true },
    { title: 'สายพันธุ์', dataIndex: ['species', 'name'] },
    { title: 'รูปภาพ', dataIndex: 'image_url', render: (url: string) => <Image src={url} width={50} fallback="https://placehold.co/50" /> },
    {
      title: 'จัดการ',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm title="ลบข้อมูล?" onConfirm={() => handleDelete(record.id)} okText="ลบ" cancelText="ยกเลิก" okButtonProps={{ danger: true }}>
             <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: 16 }}>
        เพิ่มสัตว์ตัวใหม่
      </Button>
      
      <Table dataSource={animals} columns={columns} rowKey="id" />

      {/* Modal */}
      <Modal 
        title={editingId ? `แก้ไขข้อมูล: ${editingName}` : "เพิ่มสัตว์ตัวใหม่"} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          
          <Form.Item label="ชื่อสัตว์" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item label="ลักษณะนิสัย" name="characteristics">
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item label="URL รูปภาพ" name="image_url">
            <Input />
          </Form.Item>

          {/* ส่วนที่เพิ่มมาสำหรับ Admin: เลือกสายพันธุ์ */}
          <Form.Item label="สายพันธุ์" name="speciesId" rules={[{ required: true }]}>
            <Select>
              {speciesList.map((s: any) => (
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 20 }}>
             <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 10 }}>ยกเลิก</Button>
             <Button type="primary" htmlType="submit" loading={loading}>บันทึก</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAnimals;