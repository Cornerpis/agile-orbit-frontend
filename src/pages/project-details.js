import React, { useState, useEffect } from "react";
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
  notification,
  Tooltip,
  Spin,
  message,
} from "antd";
import { Comment } from "@ant-design/compatible";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import InviteTeam from "../pages/invite-team";
import { assignProjectLeader, CreateTask, fetchUsers } from "../redux/action";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ProjectDetails = ({ visible, onCancel, loading }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  const { projectId } = useParams(); // Get projectId from URL

  const token = localStorage.getItem("token");
  const projects = useSelector((state) => state.projects);
  const users = useSelector((state) => state.users || []);
  const loadingUsers = useSelector((state) => state.users?.loading || false);
  const project = projects.find((p) => p._id === projectId); // Using projectId from useParams

  const [assignedUsers, setAssignedUsers] = useState(project?.assignedUsers || []);
  const [tasks, setTasks] = useState(project?.tasks || []);

  // Load users when modal is visible
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        await dispatch(fetchUsers(token));
      } catch {
        message.error("Failed to fetch users");
      } finally {
        setUsersLoading(false);
      }
    };

    if (visible) {
      loadUsers();
      form.resetFields();
    }
  }, [visible, dispatch, form, token]);

  //Assign project leader
  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(assignProjectLeader(values));
      const successMessage = response?.message?.toLowerCase?.().includes("success");

      if (response?.statusCode === 201 || response?.success || successMessage) {
        api.success({
          message: "Success",
          description: response?.message || "Leader assigned successfully!",
        });
        form.resetFields();
        onCancel?.();
      } else if (response?.statusCode === 400) {
        api.warning({ message: "Failed", description: response?.message });
      } else if (response?.statusCode === 409) {
        api.error({ message: "Duplicate", description: "User already exists." });
      } else {
        api.error({ message: "Unexpected Error", description: response?.message });
      }
    } catch (error) {
      api.error({ message: "Network Error", description: error?.message });
    }
  };

  // Create new task
  const handleTaskSubmit = async (taskValues) => {
    try {
      const response = await dispatch(CreateTask({ ...taskValues, projectId, token })); // Using projectId

      if (response?.statusCode === 201 || response?.successfully) {
        api.success({ message: "Task added to project successfully." });
        setTasks([...tasks, taskValues]);
        setIsTaskModalVisible(false);
        taskForm.resetFields();
        console.log('Project ID:', projectId);
      } else {
        api.error({ message: response?.message || "Error creating task" });
      }
    } catch (error) {
      api.error({
        message: "Form Validation Error",
        description: error?.message || "Check form fields",
      });
    }
  };

  // Create new comment
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, author: "You", date: new Date() }]);
      setNewComment("");
    }
  };

  // Update task status
  const handleTaskStatusChange = (taskId, status) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const progress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Card style={{ margin: 24, border: "1px solid #e8e8e8", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
      {contextHolder}

      <InviteTeam
        visible={isModalVisible}
        onCreate={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      />

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>{project.Title}</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsTaskModalVisible(true)}>
            Add Task
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Project Details" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Description:</Text>
                <Paragraph>{project.description}</Paragraph>
              </Col>
              <Col span={12}>
                <Text strong>Budget:</Text> <Text>{project.budget}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Priority:</Text>
                <Tag color={
                  project.priority_level === "High" ? "red" :
                  project.priority_level === "Medium" ? "orange" : "green"
                }>
                  {project.priority_level}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Deadline:</Text> <Text>{project.end_time}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Start Date:</Text> <Text>{project.startDate}</Text>
              </Col>
              <Col span={12}>
                <Text strong>End Date:</Text> <Text>{project.end_time}</Text>
              </Col>
            </Row>
            <Progress percent={progress} style={{ marginTop: 16 }} />
          </Card>

          <Card title="Tasks" style={{ marginTop: 24 }}>
            <List
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item
                  actions={[
                    <Select
                      defaultValue={task.status}
                      style={{ width: 120 }}
                      onChange={(value) => handleTaskStatusChange(task.id, value)}
                    >
                      <Option value="To Do">To Do</Option>
                      <Option value="In Progress">In Progress</Option>
                      <Option value="Done">Done</Option>
                    </Select>
                  ]}
                >
                  <List.Item.Meta
                    title={task.title}
                    description={
                      <>
                        <Text>Due: {task.due_date ? moment(task.due_date).format("YYYY-MM-DD") : "N/A"}</Text><br />
                        <Text>Assigned: {
                          users.find(u => u._id === task.assigned_to)
                            ? `${users.find(u => u._id === task.assigned_to).first_name} ${users.find(u => u._id === task.assigned_to).last_name}`
                            : "N/A"
                        }</Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Comments" style={{ marginTop: 24 }}>
            {comments.map((c, i) => (
              <Comment
                key={i}
                author={c.author}
                content={<p>{c.text}</p>}
                datetime={
                  <Tooltip title={moment(c.date).format("YYYY-MM-DD HH:mm:ss")}>
                    <span>{moment(c.date).fromNow()}</span>
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
            <Button type="primary" onClick={handleCommentSubmit} style={{ marginTop: 8 }}>
              Post Comment
            </Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Team Members" bordered={false}>
            <Select
              mode="multiple"
              placeholder="Assign team members"
              style={{ width: "100%", marginBottom: 16 }}
              value={assignedUsers}
              onChange={setAssignedUsers}
            >
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.first_name} {user.last_name}
                </Option>
              ))}
            </Select>

            <List
              itemLayout="horizontal"
              dataSource={users.filter((u) => assignedUsers.includes(u._id))}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{user.first_name.charAt(0).toUpperCase()}</Avatar>}
                    title={`${user.first_name} ${user.last_name}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Add Task"
        open={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleTaskSubmit} form={taskForm}>
          <Form.Item name="title" label="Task Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="assigned_to" label="Assigned To" rules={[{ required: true }]}>
            {usersLoading ? (
              <Spin />
            ) : (
              <Select placeholder="Choose a team member">
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.first_name} {user.last_name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProjectDetails;
