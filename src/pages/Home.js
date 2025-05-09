import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  List,
  notification,
  Table,
  Tag,
} from "antd";
import { PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import MyModal from "../pages/create-project";
import { getStats, fetchProjects } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";

const { Title } = Typography;

function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const stats = useSelector((state) => state.stats);
  const projects = useSelector((state) => state.projects); // 👈 Pulling project data from Redux

  useEffect(() => {
    dispatch(getStats(localStorage.getItem("token")));
    dispatch(fetchProjects(localStorage.getItem("token"))); // 👈 Fetch projects on mount
  }, [dispatch]);

  const handleCreate = (values) => {
    console.log("Project Created:", values);
    setIsModalVisible(false);
  };

  const handleRowClick = (id) => {
    history.push(`/project/${id}`);
  };

  const recentActivities = [
    {
      id: 1,
      text: "Sprint 3 Completed for Project Alpha",
      time: "2 hours ago",
    },
    {
      id: 2,
      text: "New backlog tasks added to Project Beta",
      time: "1 day ago",
    },
    { id: 3, text: "Project Gamma: Code review started", time: "3 days ago" },
    {
      id: 4,
      text: "User stories updated for Project Delta",
      time: "5 days ago",
    },
  ];

  const columns = [
    {
      title: "PROJECT NAME",
      dataIndex: "name", // Make sure your API returns this key
      key: "name",
      width: "25%",
    },
    {
      title: "BUDGET",
      dataIndex: "budget",
      key: "budget",
      render: (amount) =>
        amount != null
          ? new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(amount)
          : "-",
    },
    {
      title: "ASSIGNED TO",
      dataIndex: "assigned_to", // Ensure the API matches this key
      key: "assigned_to",
    },
    {
      title: "DEADLINE",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "todo"
            ? "red"
            : status === "in_progress"
            ? status ==="on_going"
            : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <span>Total Projects</span>
                <Title level={3}>{stats.totalProjects}</Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <span>Total Users</span>
                <Title level={3}>{stats.totalUsers}</Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <span>Project Completed</span>
                <Title level={3}>{stats.completedProjects}</Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <span>Project Ongoing</span>
                <Title level={3}>{stats.onGoingProjects}</Title>
              </div>
            </Card>
          </Col>
        </Row>

        <MyModal
          visible={isModalVisible}
          onCreate={handleCreate}
          onCancel={() => setIsModalVisible(false)}
        />

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <div className="project-ant">
                <div>
                  <Title level={5}>Most Recent Projects</Title>
                </div>
                <div className="ant-filtertabs">
                  <Button
                    type="primary"
                    className="width-100"
                    onClick={() => setIsModalVisible(true)}
                  >
                    <PlusOutlined /> Create New Project
                  </Button>
                </div>
              </div>

              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={projects
                    ?.slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((item) => ({
                      ...item,
                      key: item.id,
                    }))}
                  pagination={true}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record.id || record._id),
                    style: { cursor: "pointer" },
                  })}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card title="Recent Activities" bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<ClockCircleOutlined />}
                      title={item.text}
                      description={item.time}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
