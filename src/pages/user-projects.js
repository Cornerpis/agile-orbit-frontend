// src/pages/UserProjectsPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Spin, Typography, message, Row, Col, Button, Empty } from "antd";
// import { useNavigate } from "react-router-dom";
import { fetchUserProjects } from "../redux/action";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import "./UserProjectsPage.css";
import { Link, useHistory } from "react-router-dom"; // Create this CSS file for custom styles

const { Title, Text } = Typography;

const UserProjects = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  //   const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await dispatch(fetchUserProjects(token));
        console.log("Response from fetchUserProjects:", response);

        if (response?.message === "Projects fetched successfully.") {
          setProjects(response.data);
        } else {
          message.error(response?.message || "Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        message.error("Error loading projects");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [dispatch, token]);

  const goToProject = (projectId) => {
    history.push(`/kanbanboard/${projectId}`);
  };

  return (
    <div className="user-projects-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Your Projects
          </Title>
          <Text type="secondary">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </Text>
        </Col>
      </Row>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <Empty
          description={<span>You don't have any projects yet.</span>}
        ></Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col key={project._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                className="project-card"
                cover={
                  <div className="project-card-cover">
                    <Text strong style={{ fontSize: 18 }}>
                      {project.name.charAt(0).toUpperCase()}
                    </Text>
                  </div>
                }
                hoverable
                onClick={() => goToProject(project._id)}
              >
                <Card.Meta
                  title={project.name}
                  description={
                    <Text ellipsis={{ tooltip: project.description }}>
                      {project.description || "No description"}
                    </Text>
                  }
                />
                <div className="project-footer">
                  <Text type="secondary">
                    Last updated:{" "}
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default UserProjects;
