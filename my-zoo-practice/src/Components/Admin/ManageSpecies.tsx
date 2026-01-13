import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';

const ManageSpecies = () => {
  const [speciesList, setSpeciesList] = useState([]);
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const [resSpecies, resZones] = await Promise.all([api.get('/species'), api.get('/zones')]);
      setSpeciesList(resSpecies.data);
      setZones(resZones.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const showEditModal = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue({
        name: record.name,
        description: record.description,
        zoneId: record.zone?.id // ดึง ID โซนมาใส่
    });
    setIsModalOpen(true);
  };

  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        await api.patch(`/species/${editingId}`, values);
        message.success('แก้ไขสำเร็จ!');
      } else {
        await api.post('/species', values);
        message.success('เพิ่มสำเร็จ!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) { message.error('บันทึกไม่สำเร็จ'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/species/${id}`);
      message.success('ลบสำเร็จ');
      fetchData();
    } catch (error) { message.error('ลบไม่สำเร็จ'); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'ชื่อสายพันธุ์', dataIndex: 'name' },
    { title: 'โซน', dataIndex: ['zone', 'name'] },
    {
      title: 'จัดการ',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm title="ยืนยันการลบ?" onConfirm={() => handleDelete(record.id)} okText="ลบ" cancelText="ยกเลิก" okButtonProps={{ danger: true }}>
             <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: 16 }}>เพิ่มสายพันธุ์</Button>
      <Table dataSource={speciesList} columns={columns} rowKey="id" />

      <Modal title={editingId ? "แก้ไขสายพันธุ์" : "เพิ่มสายพันธุ์ใหม่"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item label="ชื่อสายพันธุ์" name="name" rules={[{ required: true }]}>
             <Input />
          </Form.Item>
          
          <Form.Item label="โซนที่อยู่" name="zoneId" rules={[{ required: true }]}>
            <Select>
              {zones.map((z: any) => <Select.Option key={z.id} value={z.id}>{z.name}</Select.Option>)}
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

export default ManageSpecies;