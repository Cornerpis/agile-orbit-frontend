import React from "react";
import { Form, Input, DatePicker, Select, Modal, Row, Col, notification } from "antd";
import { useDispatch } from "react-redux";
import { createProject } from "../redux/action";
import moment from "moment";

const { Option } = Select;

const CreateProject = ({ visible, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (values) => {
    const token = localStorage.getItem('token'); //Gets token
      try {
        const response = await dispatch(createProject(token, values));
        //  console.log("API Response:", response);
    
        const successMessage = response?.message?.toLowerCase?.().includes("success");
  
  if (
    response?.statusCode === 201 ||
    response?.success === true ||
    response?.success === "true" || 
    successMessage // check if message suggests success
  ) {
    api.success({
      message: response?.message || "Project created successfully!",
      description: response.message,
      duration: 3,
    });
    form.resetFields();
    onCancel();
  } else if (response?.statusCode === 400) {
    api.warning({
      message: "User Creation Failed",
      description: response?.message || "Please check your input and try again.",
      duration: 4,
    });
  } else if (response?.statusCode === 409) {
    api.error({
      message: "Duplicate Entry",
      description: response?.message || "User already exists.",
      duration: 4,
    });
  } else {
    api.error({
      message: "Unexpected Error",
      description: response?.message || "Something went wrong. Please try again later.",
      duration: 4,
    });
  }
  
      } catch (error) {
        api.error({
          message: "Network Error",
          description: error.message || "Unable to connect to the server.",
          duration: 4,
        });
      }
    };
  
  const inputStyle = {
    height: '40px',
    width: '100%',
  };

  return (
    <Modal
    open={visible} // Ant Design v5 uses 'open' instead of 'visible'
    title="Create New User"
    okText="Create"
    cancelText="Cancel"
    onCancel={onCancel}
    onOk={() => {
      form
        .validateFields()
        .then((values) => {
          handleSubmit(values); // This submits to the API and handles notification
        })
        .catch((info) => {
          console.log("Validation Failed:", info);
        });
    }}
    >
      <Form form={form} layout="vertical">
      {contextHolder}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="name"
              label="Project Name"
              rules={[{ required: true, message: "Please enter the project name!" }]}
            >
              <Input placeholder="Enter project name" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="budget"
              label="Project Budget"
              rules={[{ required: true, message: "Please enter the budget!" }]}
            >
              <Input prefix="NGN" placeholder="Enter budget amount" type="number" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Project Description"
          rules={[{ required: true, message: "Please enter the project description!" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter project description" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="end_time"
              label="Project Deadline"
              rules={[{ required: true, message: "Please select a deadline!" }]}
            >
              <DatePicker
                style={{ ...inputStyle, padding: '4px 11px' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="priority_level"
              label="Priority"
              rules={[{ required: true, message: "Please select a priority level!" }]}
            >
              <Select placeholder="Select priority level" style={inputStyle}>
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
                <Option value="low">Low</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateProject;
