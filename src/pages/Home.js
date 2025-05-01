import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Typography,
  Progress,
  Button,
  List,
  notification,
  Table,
  Tag,
} from "antd";
import { PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import MyModal from "../pages/create-project";
import { list } from "./data"; // Static list array
import { getStats } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text, Paragraph } = Typography;

function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const stats = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(getStats(localStorage.getItem("token")));
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
      dataIndex: "Title",
      key: "Title",
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
      dataIndex: "assignedto",
      key: "assignedto",
    },
    {
      title: "DEADLINE",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        let color =
          priority === "low"
            ? "green"
            : priority === "medium"
            ? "orange"
            : "red";
        return (
          <Tag color={color} style={{ fontWeight: 500 }}>
            {priority?.toUpperCase()}
          </Tag>
        );
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
                  dataSource={list.map((item) => ({
                    ...item,
                    key: item.id,
                  }))}
                  pagination={false}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record.id),
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
