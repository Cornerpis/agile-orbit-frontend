import React from "react";
import { Form, Input, Modal, Row, Col, notification } from "antd";
import { useDispatch } from "react-redux";
import { CreateUserModal as CreateUser } from "../redux/action";

const CreateUserModal = ({ visible, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const passwordRules = [
    { required: true, message: 'Please enter your password!' },
    { min: 6, message: 'Password must be at least 6 characters!' },
    {
      pattern: /^(?=.*[!@#$%^&*])/,
      message: 'Password must contain at least one special character!',
    },
  ];

  const confirmPasswordRules = [
    { required: true, message: 'Please confirm your password!' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Password mismatch!'));
      },
    }),
  ];

  const emailRules = [
    { required: true, message: 'Please enter your email!' },
    { type: 'email', message: 'Please enter a valid email address!' },
    {
      validator: async (_, value) => {
        if (!value) return Promise.resolve();
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value)) {
          return Promise.reject('Invalid email format');
        }
      }
    }
  ];

  const inputStyle = {
    padding: '8px 11px',
    borderRadius: '5px',
    width: '100%',
    height: '40px'
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(CreateUser(values))
          .then((res) => {
            api.success({
              message: 'User Created',
              description: 'The new user has been successfully created.',
            });
            form.resetFields();
            onCancel();
          })
          .catch((err) => {
            api.error({
              message: 'User Creation Failed',
              description: err?.message || 'Something went wrong. Please try again.',
            });
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      open={visible}
      title="Create New User"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "Please enter your first name!" }]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name!" }]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email"
          rules={emailRules}
          hasFeedback
        >
          <Input placeholder="Enter your email" style={inputStyle} />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please enter your role!" }]}
            >
              <Input placeholder="Enter your role" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please enter your department!" }]}
            >
              <Input placeholder="Enter your department" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={passwordRules}
              hasFeedback
            >
              <Input.Password placeholder="Enter password" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="confirmpassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={confirmPasswordRules}
              hasFeedback
            >
              <Input.Password placeholder="Confirm password" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
