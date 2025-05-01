import React, { useEffect } from "react";
import { Form, Input, Modal, Row, Col, notification } from "antd";
import { useDispatch } from "react-redux";
import { UpdateUserAction } from "../redux/action"; // <-- Make sure this exists

const UpdateUser = ({ visible, onCancel, userData }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue(userData); // prefill form
    }
  }, [userData, form]);

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(UpdateUserAction(userData._id, values)); // include ID

      if (response?.success || response?.statusCode === 200) {
        api.success({
          message: "User updated successfully!",
          description: response.message,
        });
        form.resetFields();
        onCancel();
      } else {
        api.error({
          message: "Update Failed",
          description: response.message || "Something went wrong.",
        });
      }
    } catch (error) {
      api.error({
        message: "Network Error",
        description: error.message,
      });
    }
  };

  return (
    <Modal
      open={visible}
      title="Update User"
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => handleSubmit(values))
          .catch((err) => console.log("Validation failed:", err));
      }}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
              <Input placeholder="First name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
              <Input placeholder="Last name" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Input placeholder="Role" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="department" label="Department" rules={[{ required: true }]}>
              <Input placeholder="Department" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
