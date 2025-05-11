import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Space,
  Tag,
  Grid,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import CreateUserModal from "../pages/create-user";
import { fetchUsers } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";
import UpdateUser from "../pages/update-user";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CreateUsers = () => {
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = useSelector((state) => state.users || []);
  const loading = useSelector((state) => state.loading); // Optional: if using loading in Redux

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [sorter, setSorter] = useState({});

  useEffect(() => {
    dispatch(fetchUsers(localStorage.getItem("token")));
  }, [dispatch]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: users.length,
    }));
  }, [users]);

  const handleCreate = (values) => {
    console.log("User created successfully:", values);
    setIsModalVisible(false);
    dispatch(fetchUsers(localStorage.getItem("token"))); // Refresh user list
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalVisible(true);
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    setFilters(filters);
    setSorter(sorter);
  };

  const columns = [
    {
      title: "USER NAME",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {`${record.first_name || ""} ${record.last_name || ""}`}
          </div>
          {isMobile && <Text type="secondary">{record.email || ""}</Text>}
        </div>
      ),
      sorter: true,
      responsive: ["xs", "sm", "md"],
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      sorter: true,
      responsive: ["md"],
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      sorter: true,
      responsive: ["sm"],
    },
    {
      title: "DEPARTMENT",
      dataIndex: "department",
      key: "department",
      render: (dept) =>
        dept ? dept.charAt(0).toUpperCase() + dept.slice(1) : "",
      sorter: true,
      responsive: ["md"],
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "todo" ? "green" : "red"}>
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status?.includes(value),
      sorter: true,
      responsive: ["xs", "sm", "md"],
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size={isMobile ? "small" : "middle"}
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
      responsive: ["xs", "sm", "md"],
    },
  ];

  const mobileColumns = [
    {
      title: "USER",
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {`${record.first_name || ""} ${record.last_name || ""}`}
          </div>
          <Text type="secondary">{record.email || ""}</Text>
          <div style={{ marginTop: 8 }}>
            <Tag color="blue">
              {record.role
                ? record.role
                    .split("_")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")
                : "active"}
            </Tag>
            <Tag
              color={record.status === "active" ? "green" : "blue"}
              style={{ marginLeft: 4 }}
            >
              {record.status
                ? record.status.charAt(0).toUpperCase() +
                  record.status.slice(1)
                : "Inactive"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
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

      <UpdateUser
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        userData={selectedUser}
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
          rowKey={(record) => record.id || record._id}
          columns={isMobile ? mobileColumns : columns}
          dataSource={users}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "80", "100"],
            showTotal: (total) => `Total ${total} users`,
          }}
          onChange={handleTableChange}
        />
      </Spin>
    </Card>
  );
};

export default CreateUsers;
