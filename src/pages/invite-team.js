import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Modal, Row, Col, message, Spin } from 'antd';
import { UserAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, inviteTeamMember } from "../redux/action";

const { Option } = Select;

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
      console.error("Validation Failed:", info);
    }
  };

  return (
    <Modal
      title="Invite Team Member"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="invite_team_form"
        preserve={false}
      >
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
                <Select placeholder="Choose a team member">
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

const InviteTeam = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const projectId = useSelector((state) => state.currentProject?.id);

  const handleInvite = async (values) => {
  setLoading(true);
  try {
    
    const response = await dispatch(inviteTeamMember(projectId, values.userId));

    const success =
      response?.statusCode === 201 ||
      response?.success === true ||
      String(response?.success).toLowerCase() === "true";

    if (success) {
      message.success(response?.message || "User invited successfully");
      setVisible(false);
    } else if (response?.statusCode === 400) {
      message.warning(response?.message || "Invalid input.");
    } else if (response?.statusCode === 409) {
      message.error(response?.message || "User already invited.");
    } else {
      message.error(response?.message || "Unknown error.");
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