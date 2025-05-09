import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Typography,
  notification,
  Spin,
} from 'antd';
import { useDispatch } from 'react-redux';
import { UpdateUserProfile } from '../redux/action'; // Updated action
import axios from 'axios';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data.data);
        form.setFieldsValue(res.data.data);
        setLoading(false);
      } catch (err) {
        message.error('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const response = await dispatch(UpdateUserProfile(token, values));

      if (
        response?.success ||
        response?.message?.toLowerCase?.().includes('success')
      ) {
        api.success({
          message: 'Profile Updated Successfully!',
          description: response.message,
          duration: 3,
        });
        setEditMode(false);
        setUserData(values);
      } else {
        api.error({
          message: 'Update Failed',
          description: response.message || 'Please try again.',
        });
      }
    } catch (err) {
      message.error('Please fix validation errors before saving.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#f0f2f5',
        paddingTop: 40,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 32,
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: 100,
          marginTop: 50,
        }}
      >
        {contextHolder}
        <Title level={3}>Update Profile</Title>
        <Paragraph type="secondary">
          Click Edit to modify your information.
        </Paragraph>

        <Form layout="vertical" form={form} initialValues={userData}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: 'First Name is required' }]}
          >
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: 'Last Name is required' }]}
          >
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Role is required' }]}
          >
            <Select disabled={!editMode}>
              <Option value="project_manager">Project Manager</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Department is required' }]}
          >
          <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password disabled={!editMode} />
          </Form.Item>

          {!editMode ? (
            <Button type="primary" onClick={() => setEditMode(true)} block>
              Edit Profile
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="primary" onClick={handleSave} block>
                Save
              </Button>
              <Button onClick={() => setEditMode(false)} block>
                Cancel
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Profile;
