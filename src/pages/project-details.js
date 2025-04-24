import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Space,
  List,
  Avatar,
  Select,
  Tag,
  Form,
  Input,
  Modal,
  DatePicker,
  Progress,
  Divider,
  Tooltip,
} from "antd";
import { Comment } from '@ant-design/compatible';
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import moment from "moment";
import InviteTeam from "../pages/invite-team";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ProjectDetails = ({ projects }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const { id } = useParams();
  const project = projects.find((p) => p.id === parseInt(id));
  const [assignedUsers, setAssignedUsers] = useState(
    project ? project.assignedUsers || [] : []
  );
  const [tasks, setTasks] = useState(project ? project.tasks || [] : []);
  const [taskForm] = Form.useForm();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const mockUsers = [
    { id: 1, name: "Alice Smith" },
    { id: 2, name: "Bob Johnson" },
    { id: 3, name: "Charlie Williams" },
    { id: 4, name: "David Brown" },
    { id: 5, name: "Eve Davis" },
  ];

  const handleCreate = (values) => {
    console.log("Project Created:", values);
    setIsModalVisible(false);
  };

  const handleAssignUser = (userIds) => {
    setAssignedUsers(userIds);
  };

  const handleAddTask = (taskValues) => {
    setTasks([...tasks, { id: Date.now(), status: "To Do", ...taskValues }]);
    setIsTaskModalVisible(false);
    taskForm.resetFields();
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { text: newComment, author: "You", date: new Date() },
      ]);
      setNewComment("");
    }
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Card
      style={{
        margin: 24,
        border: "1px solid #e8e8e8",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <InviteTeam
        visible={isModalVisible}
        onCreate={handleCreate}
        onCancel={() => setIsModalVisible(false)}
      />
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            {project.Title}
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{ marginRight: 8 }}
          >
            Invite Team
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsTaskModalVisible(true)}
          >
            Add Task
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Project Details" bordered={false}>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex", width: "100%" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Description:</Text>
                  <Paragraph>{project.description}</Paragraph>
                </Col>
                <Col span={12}>
                  <Text strong>Budget:</Text>
                  <Text>{project.budget}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Priority:</Text>
                  <Tag
                    color={
                      project.priority === "High"
                        ? "red"
                        : project.priority === "Medium"
                        ? "orange"
                        : "green"
                    }
                  >
                    {project.priority}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Deadline:</Text>
                  <Text>{project.deadline}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Start Date:</Text>
                  <Text>{project.startDate}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>End Date:</Text>
                  <Text>{project.endDate}</Text>
                </Col>
              </Row>
              <Progress percent={progress} style={{ marginTop: 16 }} />
            </Space>
          </Card>

          <Card title="Tasks" bordered={false} style={{ marginTop: 24 }}>
            <List
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item
                  actions={[
                    <Select
                      defaultValue={task.status}
                      style={{ width: 120 }}
                      onChange={(value) =>
                        setTasks(
                          tasks.map((t) =>
                            t.id === task.id ? { ...t, status: value } : t
                          )
                        )
                      }
                    >
                      <Option value="To Do">To Do</Option>
                      <Option value="In Progress">In Progress</Option>
                      <Option value="Done">Done</Option>
                    </Select>,
                  ]}
                >
                  <List.Item.Meta
                    title={task.title}
                    description={
                      <>
                        <Text>
                          Due:{" "}
                          {task.dueDate
                            ? moment(task.dueDate).format("YYYY-MM-DD")
                            : "N/A"}
                        </Text>
                        <Text>
                          {" "}
                          Assigned:{" "}
                          {mockUsers.find((user) => user.id === task.assignee)
                            ?.name || "N/A"}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Comments" bordered={false} style={{ marginTop: 24 }}>
            {comments.map((comment, index) => (
              <Comment
                key={index}
                author={comment.author}
                content={<p>{comment.text}</p>}
                datetime={
                  <Tooltip
                    title={moment(comment.date).format("YYYY-MM-DD HH:mm:ss")}
                  >
                    <span>{moment(comment.date).fromNow()}</span>
                  </Tooltip>
                }
              />
            ))}
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{ marginTop: 16 }}
            />
            <Button
              type="primary"
              onClick={handleCommentSubmit}
              style={{ marginTop: 8 }}
            >
              Post Comment
            </Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Team Members" bordered={false}>
            <Select
              mode="multiple"
              style={{ width: "100%", marginBottom: 16 }}
              placeholder="Assign team members"
              value={assignedUsers}
              onChange={handleAssignUser}
            >
              {mockUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>

            <List
              itemLayout="horizontal"
              dataSource={mockUsers.filter((user) =>
                assignedUsers.includes(user.id)
              )}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
                    }
                    title={user.name}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Add Task"
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddTask} layout="vertical" form={taskForm}>
          <Form.Item
            label="Task Title"
            name="title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea />
          </Form.Item>
          <Form.Item label="Due Date" name="dueDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Assignee" name="assignee">
            <Select>
              {mockUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProjectDetails;