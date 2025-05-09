import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Modal, Row, Col, message, Spin } from 'antd';
import { UserAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, inviteTeamMember } from "../redux/action";

const { Option } = Select;

// Form Component for Inviting Users
const InviteTeamForm = ({ visible, onInvite, onCancel, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users || []);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        await dispatch(fetchUsers(localStorage.getItem("token")));
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
  }, [visible, dispatch, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onInvite(values);
    } catch (info) {
      const fieldError = info?.errorFields?.[0]?.errors?.[0];
      message.error(fieldError || "Please select a user to invite.");
    }
  };

  return (
    <Modal
      title="Invite Team Member"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="invite_team_form" preserve={false}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="userId"
              label="Select User"
              rules={[{ required: true, message: "Please select a user!" }]}
            >
              {usersLoading ? (
                <Spin />
              ) : (
                <Select placeholder="Choose a team member" showSearch optionFilterProp="children">
                  {users.map((user) => (
                    <Option key={user._id} value={user._id}>
                      {user.first_name} {user.last_name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

// Main Component for Handling Modal Logic and Dispatch
const InviteTeam = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const projectId = useSelector((state) => state.projects[0]?._id);
  const projects = useSelector((state) => state.projects || []);
  const project = projects.find((proj) => proj._id === projectId);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!projectId) {
      console.warn("projectId is undefined. Please ensure you have at least one project loaded.");
    }
  }, [projectId]);

  const handleInvite = async (values) => {
    if (!projectId) {
      message.error("No project selected to invite users.");
      return;
    }
  
    const userId = values.userId; // Get the userId from the form values
  
    if (!userId) {
      message.error("Please select a user to invite.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await dispatch(inviteTeamMember(projectId, userId)); // Pass userId
  
      const success =
        response?.statusCode === 201 ||
        response?.success === true ||
        String(response?.message)?.toLowerCase()?.includes("success");
  
      if (success) {
        message.success(response?.message || "Team member added successfully.");
        setVisible(false);
      } else if (response?.statusCode === 400) {
        message.warning(response?.message || "Invalid input.");
      } else if (response?.statusCode === 409) {
        message.error(response?.message || "User already invited.");
      } else {
        message.error(response?.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Invite error:", error);
      message.error("Failed to invite user.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Button type="primary" icon={<UserAddOutlined />} onClick={() => setVisible(true)}>
        Invite Team Members
      </Button>
      <InviteTeamForm
        visible={visible}
        onInvite={handleInvite}
        onCancel={() => setVisible(false)}
        loading={loading}
      />
    </>
  );
};

export default InviteTeam;
