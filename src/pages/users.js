import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Table, Card, Typography, Button, Row, Col, Space, Tag, Grid } from "antd";
import * as icons from "@ant-design/icons";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateUserModal from "../pages/create-user";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Sample user data
const users = [
  {
    key: "1",
    first_name: "Daniel",
    last_name: "Okoro",
    email: "test@email.com",
    role: "project manager",
    department: "product",
    status: "active",
  },
  {
  key: "2",
    first_name: "Timothy",
    last_name: "Shater",
    email: "example@email.com",
    role: "Product designer",
    department: "product",
    status: "active",
  },
  {
    key: "3",
      first_name: "Peace",
      last_name: "Timothy",
      email: "peace@email.com",
      role: "Nurse",
      department: "Health",
      status: "active",
    },
];

const CreateUsers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
    const history = useHistory(); // Initialize useHistory
  
    const handleCreate = (values) => {
      console.log("user Created Successfully:", values);
      setIsModalVisible(false);
    };
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{`${record.first_name} ${record.last_name}`}</div>
          {isMobile && <Text type="secondary">{record.email}</Text>}
        </div>
      ),
      responsive: ['xs', 'sm', 'md']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md']
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      responsive: ['sm']
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => dept.charAt(0).toUpperCase() + dept.slice(1),
      responsive: ['md']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      responsive: ['xs', 'sm', 'md']
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size={isMobile ? 'small' : 'middle'}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            size={isMobile ? 'small' : 'middle'}
          />
        </Space>
      ),
      responsive: ['xs', 'sm', 'md']
    },
  ];

  const mobileColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{`${record.first_name} ${record.last_name}`}</div>
          <Text type="secondary">{record.email}</Text>
          <div style={{ marginTop: 8 }}>
            <Tag color={record.role === 'project_manager' ? 'blue' : 'default'}>
              {record.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Tag>
            <Tag color={record.status === 'active' ? 'green' : 'red'} style={{ marginLeft: 4 }}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    }
  ];

  return (
    <Card 
      style={{ 
        margin: screens.xs ? 12 : 24,
        border: 'none',
        boxShadow: 'none'
      }}
      bodyStyle={{ 
        padding: screens.xs ? 12 : 24 
      }}
    >

        <CreateUserModal
          visible={isModalVisible}
          onCreate={handleCreate}
          onCancel={() => setIsModalVisible(false)}
        />
      {/* Header with title and button */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title 
            level={screens.xs ? 4 : 2} 
            style={{ marginBottom: 0 }}
          >
            User Management
          </Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            size={screens.xs ? 'small' : 'middle'}
          >
            {screens.xs ? 'New' : 'Create New User'}
          </Button>
        </Col>
      </Row>

      {/* Users Table */}
      <Table
        columns={isMobile ? mobileColumns : columns}
        dataSource={users}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          size: isMobile ? 'small' : 'default'
        }}
        scroll={{ x: true }}
        bordered={!isMobile}
        size={isMobile ? 'small' : 'middle'}
        style={{
          borderRadius: isMobile ? 0 : 8,
          overflow: 'hidden'
        }}
      />
    </Card>
  );
};

export default CreateUsers;