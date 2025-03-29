import React, { useState } from 'react';
import { Form, Input, Button, Modal, Select, Row, Col, message } from 'antd';

const { Option } = Select;

const InviteTeam = ({ visible, onInvite, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Invite Team Member"
      okText="Invite"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onInvite(values);
          })
          .catch((info) => {
            message.error('Invite unsuccessful. Please check the form fields.');
          });
      }}
    >
      <Form form={form} layout="vertical" name="inviteteam">
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
export default InviteTeam;

const InviteMember = () => {
  const [visible, setVisible] = useState(false);

  const onInvite = (values) => {
    console.log('Invited Member:', values);
    message.success('Invite successfully sent');
    setVisible(false);
  };

  return (
    <>
      {/* <Button type="primary" onClick={() => setVisible(true)}>
        Invite Team Members
      </Button> */}
      <InviteTeam
        visible={visible}
        onInvite={onInvite}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};


