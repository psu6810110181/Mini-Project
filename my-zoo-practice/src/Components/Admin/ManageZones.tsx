import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';

const ManageZones = () => {
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const res = await api.get('/zones');
      setZones(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const showEditModal = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record); // ยัดข้อมูลเดิมใส่ฟอร์ม
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
        await api.patch(`/zones/${editingId}`, values);
        message.success('แก้ไขโซนสำเร็จ!');
      } else {
        await api.post('/zones', values);
        message.success('เพิ่มโซนสำเร็จ!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      message.error('บันทึกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/zones/${id}`);
      message.success('ลบโซนสำเร็จ');
      fetchData();
    } catch (error) { message.error('ลบไม่สำเร็จ'); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'ชื่อโซน', dataIndex: 'name' },
    { title: 'รายละเอียด', dataIndex: 'description' },
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
      <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginBottom: 16 }}>เพิ่มโซนใหม่</Button>
      <Table dataSource={zones} columns={columns} rowKey="id" />
      
      <Modal title={editingId ? "แก้ไขโซน" : "เพิ่มโซนใหม่"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item label="ชื่อโซน" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="รายละเอียด" name="description">
            <Input.TextArea rows={3} />
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

export default ManageZones;