import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Modal, Row, Col, notification } from "antd";
import { MyModal as CreateProject } from "../redux/action";
import { useDispatch } from "react-redux";
import moment from "moment";

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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await dispatch(
        CreateProject(
          localStorage.getItem("token"),
          {
            ...values,
            ...(initialValues?.key && { id: initialValues.key })
          }
        )
      );

      const successMessage = response?.message?.toLowerCase?.().includes("success");

      if (
        response?.statusCode === 201 || 
        response?.statusCode === 200 ||
        response?.success === true ||
        response?.success === "true" ||
        successMessage
      ) {
        api.success({
          message: initialValues 
            ? response?.message || "Project updated successfully!" 
            : response?.message || "Project created successfully!",
          description: response.message,
          duration: 3,
        });
        form.resetFields();
        onCreate(values);
        onCancel();
      } else if (response?.statusCode === 400) {
        api.warning({
          message: initialValues ? "Project Update Failed" : "Project Creation Failed",
          description: response?.message || "Please check your input and try again.",
          duration: 4,
        });
      } else if (response?.statusCode === 409) {
        api.error({
          message: "Duplicate Entry",
          description: response?.message || "Project already exists.",
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
    } finally {
      setLoading(false);
    }
  };

  // Custom style to make inputs consistent height
  const inputStyle = {
    height: '40px', // Standard height that matches Ant Design's default
    width: '100%'
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? "Edit Project" : "Create New Project"}
      okText={initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            handleSubmit(values);
          })
          .catch((info) => {
            console.log("Validation Failed:", info);
          });
      }}
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
              <Input 
                placeholder="Enter project name" 
                style={inputStyle}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="budget"
              label="Project Budget"
              rules={[{ required: true, message: "Please enter the budget!" }]}
            >
              <Input 
                prefix="" 
                placeholder="Enter budget amount" 
                type="number" 
                style={inputStyle}
              />
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
              <Select 
                placeholder="Select priority level"
                style={inputStyle}
              >
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