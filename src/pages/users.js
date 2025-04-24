import { useState, useEffect } from "react";
import { Table, Card, Typography, Button, Row, Col, Space, Tag, Grid, Spin } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import CreateUserModal from "../pages/create-user";
import axios from "axios";
import { fetchUsers } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";


const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CreateUsers = () => {
  const projects = useSelector((state) => state.projects);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [sorter, setSorter] = useState({});
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers(localStorage.getItem("token")));
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(); // Replace with your actual API
        setUsers(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.length, // Update total users count for pagination
        }));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = (values) => {
    console.log("User created successfully:", values);
    setIsModalVisible(false);
    // Optionally refetch user list here
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    setFilters(filters);
    setSorter(sorter);
    // Fetch data again with the updated filters and sorter
  };

  const columns = [
    {
      title: "USER NAME",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{`${record.first_name} ${record.last_name}`}</div>
          {isMobile && <Text type="secondary">{record.email}</Text>}
        </div>
      ),
      sorter: true, // Add sorting to Name column
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      sorter: true, // Add sorting to Email column
      responsive: ['md'],
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      responsive: ['sm'],
      sorter: true,
    },
    {
      title: "DEPARTMENT",
      dataIndex: "department",
      key: "department",
      render: (dept) => dept.charAt(0).toUpperCase() + dept.slice(1),
      responsive: ['md'],
      sorter: true, // Add sorting to Department column
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status.includes(value),
      responsive: ['xs', 'sm', 'md'],
      sorter: true,
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: () => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size={isMobile ? "small" : "middle"}
          />
        </Space>
      ),
      responsive: ['xs', 'sm', 'md'],
    },
  ];

  const mobileColumns = [
    {
      title: "USER",
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{`${record.first_name} ${record.last_name}`}</div>
          <Text type="secondary">{record.email}</Text>
          <div style={{ marginTop: 8 }}>
            <Tag color="blue">
              {record.role
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Tag>
            <Tag
              color={record.status === "active" ? "green" : "red"}
              style={{ marginLeft: 4 }}
            >
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        margin: screens.xs ? 12 : 24,
        border: "none",
        boxShadow: "none",
      }}
      bodyStyle={{ padding: screens.xs ? 12 : 24 }}
    >
      <CreateUserModal
        visible={isModalVisible}
        onCreate={handleCreate}
        onCancel={() => setIsModalVisible(false)}
      />
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={screens.xs ? 4 : 2} style={{ marginBottom: 0 }}>
            User Management
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            size={screens.xs ? "small" : "middle"}
          >
            New User
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={users}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Total ${total} users`,
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => console.log(`Row clicked: ${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </Spin>
    </Card>
  );
};

export default CreateUsers;
