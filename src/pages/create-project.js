import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Modal, Row, Col, notification } from "antd";
import { MyModal as CreateProject } from "../redux/action";
import { useDispatch } from "react-redux";
import moment from "moment";
// import axios from "axios";  // Assuming you're using Axios for the API call

const { Option } = Select;

const MyModal = ({ visible, onCreate, onCancel, initialValues }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  // Set form values when initialValues change (for edit)
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name?.props?.children || initialValues.name,
        budget: initialValues.status?.props?.children?.replace('$', '') || '',
        description: initialValues.function?.props?.children || initialValues.function,
        end_time: initialValues.deadline ? moment(initialValues.deadline?.props?.children, 'DD/MM/YY') : null,
        priority_level: initialValues.priority?.toLowerCase(),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true); // Set loading to true while making the API call
        // Create a project object
        const projectData = {
          name: values.name,
          budget: values.budget,
          description: values.description,
          deadline: values.end_time ? values.end_time.format("DD/MM/YYYY") : null,
          priority: values.priority_level,
        };

        // Dispatch the create project action
        dispatch(CreateProject(projectData))
          .then((res) => {
            // On successful response from the backend
            api.success({
              message: "Project Created",
              description: "New project has been successfully created.",
            });
            form.resetFields();
            onCancel();
          })
          .catch((err) => {
            // Handle errors
            api.error({
              message: "Project Creation Failed",
              description: err?.message || "Something went wrong. Please try again.",
            });
          })
          .finally(() => {
            setLoading(false); // Reset loading state
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const inputStyle = {
    height: '40px',
    width: '100%',
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? "Edit Project" : "Create New Project"}
      okText={initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={handleOk} // Use the handleOk method for form submission
    >
      {contextHolder}
      <Form form={form} layout="vertical">
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
              <Input prefix="" placeholder="Enter budget amount" type="number" style={inputStyle} />
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
              <DatePicker style={{ ...inputStyle, padding: '4px 11px' }} format="DD/MM/YYYY" />
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

export default MyModal;
