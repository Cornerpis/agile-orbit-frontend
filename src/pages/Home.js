import { useState } from "react";
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
} from "antd";
import { PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import MyModal from "../pages/create-project";
import { list } from "./data"; // Import the list array

// Destructure Paragraph from Typography
const { Title, Text, Paragraph } = Typography;

function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory(); // Initialize useHistory

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

  const dollor = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      {/* SVG path for dollar icon */}
    </svg>,
  ];
  const profile = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      {/* SVG path for profile icon */}
    </svg>,
  ];
  const heart = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      {/* SVG path for heart icon */}
    </svg>,
  ];
  const cart = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      {/* SVG path for cart icon */}
    </svg>,
  ];

  const count = [
    {
      today: "Total Projects",
      title: "53,000",
      icon: dollor,
      bnb: "bnb2",
    },
    {
      today: "Total Users",
      title: "3,200",
      icon: profile,
      bnb: "bnb2",
    },
    {
      today: "Project Completed",
      title: "15",
      icon: heart,
      bnb: "redtext",
    },
    {
      today: "Projects Ongoing",
      title: "13,200",
      icon: cart,
      bnb: "bnb2",
    },
  ];
  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <span>{c.today}</span>
                  <Title level={3}>
                    {c.title} <small className={c.bnb}>{c.persent}</small>
                  </Title>
                </div>
              </Card>
            </Col>
          ))}
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
                  <Title level={5}>Most Recent Projects </Title>
                </div>
                <div className="ant-filtertabs">
                  <Button
                    type="primary"
                    className="width-100"
                    onClick={() => setIsModalVisible(true)}
                  >
                    {<PlusOutlined />} Create New Project
                  </Button>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
                <table className="width-100">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>BUDGET</th>
                      <th>ASSIGNED TO</th>
                      <th>DEADLINE</th>
                      <th>PRIORITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((d, index) => {
                      let priorityColor;
                      switch (d.priority.toLowerCase()) {
                        case "low":
                          priorityColor = "green";
                          break;
                        case "medium":
                          priorityColor = "orange";
                          break;
                        case "high":
                          priorityColor = "red";
                          break;
                        default:
                          priorityColor = "black";
                      }

                      return (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(d.id)} // Make the row clickable
                          style={{ cursor: "pointer" }} // Add pointer cursor
                        >
                          <td>{d.Title}</td>
                          <td>{d.budget}</td>
                          <td>{d.assignedto}</td>
                          <td>{d.deadline}</td>
                          <td>
                            <span
                              style={{
                                color: priorityColor,
                                fontWeight: "bold",
                              }}
                            >
                              {d.priority}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
