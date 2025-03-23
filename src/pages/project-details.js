import React from "react";
import { useParams } from "react-router-dom";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const ProjectDetails = ({ projects }) => {
  const { id } = useParams(); // Get the project ID from the URL
  const project = projects.find((p) => p.id === parseInt(id)); // Find the project by ID

  // If the project is not found, display a message
  if (!project) {
    return <div>Project not found</div>;
  }

  // Render the project details
  return (
    <Card style={{ margin: 24 }}>
      <Title level={2}>Project Details</Title>
      <Text strong>Name:</Text> {project.Title} <br />
      <Text strong>Budget:</Text> {project.budget} <br />
      <Text strong>Description:</Text> {project.desscription} <br />
      <Text strong>Deadline:</Text> {project.bud} <br />
      <Text strong>Priority:</Text> {project.priority} <br />
    </Card>
  );
};

export default ProjectDetails;