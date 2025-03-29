import React, {useState} from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Button, Row, Col, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import InviteTeam from "../pages/invite-team";


const { Title, Text } = Typography;

const ProjectDetails = ({ projects }) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = useParams();
  const project = projects.find((p) => p.id === parseInt(id));


  const handleCreate = (values) => {
    console.log("Project Created:", values);
    setIsModalVisible(false);
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <Card 
      style={{ margin: 24, border: 'none', boxShadow: 'none' }}
      bodyStyle={{ padding: 24 }}
    >

        <InviteTeam
          visible={isModalVisible}
          onCreate={handleCreate}
          onCancel={() => setIsModalVisible(false)}
        />
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>Project Details</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} >
            Invite Team Member
          </Button>
        </Col>
      </Row>

      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Row gutter={[16, 16]} style={{arginBottom: 16 }}>
        <Col span={4}>
          <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 12 }}>Name</Text>
          <Text>{project.Title}</Text>
        </Col>
        <Col span={4}>
          <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 12}}>Budget</Text>
          <Text>{project.budget}</Text>
        </Col>
        <Col span={6}>
          <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 12 }}>Description</Text>
          <Text>{project.desscription}</Text>
        </Col>
        <Col span={4}>
          <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 12 }}>Priority</Text>
          <Text>{project.priority}</Text>
        </Col>
        <Col span={4}>
          <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 12 }}>Deadline</Text>
          <Text>{project.priority}</Text>
        </Col>

        {/* <Col span={4}>
          <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 12 }}>Assigned To</Text>
          <Text>{project.bud}</Text>
        </Col> */}

        </Row>
        
      </Space>
    </Card>
  );
};

export default ProjectDetails;