import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Modal, Row, Col } from "antd";


const { Option } = Select;

const CreateUserModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

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
              name="fname"
              label="First Name"
              rules={[{ required: true, message: "Please enter your first name!" }]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="lname"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name!" }]}
            >
              <Input placeholder="Enter your last name" type="text" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input rows={4} placeholder="Enter your email" type="text"/>
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role!" }]}
            >
                <Select placeholder="Select role">
                <Option value="productmanager">Product Manager</Option>
                <Option value="developer">Developer</Option>
                <Option value="projectmanager">Project Manager</Option>
              </Select>
             
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please select a department!" }]}
            >
              <Select placeholder="Select department">
                <Option value="software">Software Development</Option>
                <Option value="admin">Adminstrative</Option>
                <Option value="product">Product Department</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
                <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password!" }]}
                >
                <Input placeholder="Enter password" type="password" />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
                <Form.Item
                name="confirmpassword"
                label="Confirm Password"
                rules={[{ required: true, message: "Please enter your confirm password!" }]}
                >
                <Input placeholder="Enter your confirm password" type="password" />
                </Form.Item>
            </Col>
            
        </Row>
            
      </Form>
    </Modal>
  );
};

export default CreateUserModal;

const App = () => {
  // Modal is always visible
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleCreate = (values) => {
    console.log("Project Created:", values);
    // If you want to keep the modal open after submission, remove this line:
    setIsModalVisible(false);
  };

  return (
    <CreateUserModal
      visible={isModalVisible}
      onCreate={handleCreate}
      onCancel={() => setIsModalVisible(false)}
    />
  );
};

// export default App;
