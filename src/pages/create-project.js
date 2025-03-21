import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Modal, Row, Col } from "antd";


const { Option } = Select;

const MyModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={visible} // Ant Design v5 uses 'open' instead of 'visible'
      title="Create New Project"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validation Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="name"
              label="Project Name"
              rules={[{ required: true, message: "Please enter the project name!" }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="budget"
              label="Project Budget"
              rules={[{ required: true, message: "Please enter the budget!" }]}
            >
              <Input placeholder="Enter budget amount" type="number" />
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
              name="deadline"
              label="Project Deadline"
              rules={[{ required: true, message: "Please select a deadline!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: "Please select a priority level!" }]}
            >
              <Select placeholder="Select priority level">
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

const App = () => {
  // Modal is always visible
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleCreate = (values) => {
    console.log("Project Created:", values);
    // If you want to keep the modal open after submission, remove this line:
    setIsModalVisible(false);
  };

  return (
    <MyModal
      visible={isModalVisible}
      onCreate={handleCreate}
      onCancel={() => setIsModalVisible(false)}
    />
  );
};

// export default App;
