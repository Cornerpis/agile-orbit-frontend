import React, { useState } from 'react';
import { Form, Input, Button, Modal, Select, Row, Col, message, notification } from 'antd';
// import {useDispatch} from "react.redux";
// import { InviteTeam as inviteTeamMember} from "../redux/action";
import { InviteTeam as inviteTeamMember} from "../redux/action";
import { useDispatch } from "react-redux";

const { Option } = Select;

const InviteTeam = ({ visible, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

   const handleSubmit = async (values) => {
      try {
        const response = await dispatch(inviteTeamMember(values));
    
        const successMessage = response?.message?.toLowerCase?.().includes("success");
  
  if (
    response?.statusCode === 201 ||
    response?.success === true ||
    response?.success === "true" || // handle string values
    successMessage // check if message suggests success
  ) {
    api.success({
      message: response?.message || "Team member ivited successfully!",
      description: response.message || "Proceed to login",
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
            handleSubmit(values);
          })
          .catch((info) => {
            message.error('Invite unsuccessful.', info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="inviteteam">
        {contextHolder}
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


