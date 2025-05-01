import React, { useState } from 'react';
import { Form, Input, Button, Modal, Select, Row, Col, message } from 'antd';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import baseUrl from '../apiConfig';

const { Option } = Select;

const InviteTeamForm = ({ visible, onInvite, onCancel, loading }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(values => onInvite(values))
      .catch(info => console.error('Validation Failed:', info));
  };

  return (
    <Modal
      visible={visible}
      title="Invite Team Member"
      okText="Invite"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" name="invite_team_form">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Enter team member email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select placeholder="Select role">
                <Option value="developer">Developer</Option>
                <Option value="designer">Designer</Option>
                <Option value="project_manager">Project Manager</Option>
                <Option value="tester">Tester</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const InviteTeam = ({ projectId }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const handleInvite = async (values) => {
    try {
      setLoading(true);

      // Step 1: Fetch all users
      const usersResponse = await axios.get(`${baseUrl}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const users = usersResponse.data;
      const user = users.find(u => u.email === values.email);

      if (!user) throw new Error('User with this email not found');

      // Step 2: Add user to project
      const addResponse = await axios.put(
        `${baseUrl}/api/v1/project/${projectId}/add-member`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (addResponse.data.success) {
        message.success('Team member added successfully');
        setVisible(false);
        // Optionally dispatch refresh
        // dispatch(fetchProjectDetails(projectId));
      } else {
        throw new Error(addResponse.data.message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
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
