import React, {useState} from "react";
import { Form, Input, Modal, Row, Col, notification } from "antd";
import { useDispatch } from "react-redux";
import { CreateUserModal as CreateUser} from "../redux/action";



const CreateUserModal = ({ visible, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  // Password validation rules
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

    // Email validation rules
    const emailRules = [
      { required: true, message: 'Please enter your email!' },
      { type: 'email', message: 'Please enter a valid email address!' },
      {
        validator: async (_, value) => {
          if (!value) return Promise.resolve();
          
          // Basic email format validation
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          if (!emailRegex.test(value)) {
            return Promise.reject('Invalid email format');
          }
        }
      }
    ];

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(CreateUser(values));
  
      const successMessage = response?.message?.toLowerCase?.().includes("success");

if (
  response?.statusCode === 201 ||
  response?.success === true ||
  response?.success === "true" || // handle string values
  successMessage // check if message suggests success
) {
  api.success({
    message: response?.message || "User created successfully!",
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
    padding: '8px 11px',
    borderRadius: '5px',
    width: '100%',
    height: '40px'
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
              <Input placeholder="Enter your last name" type="text" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email"
          rules={emailRules}
          hasFeedback
          // rules={
          //   [{ required: true, message: "Please enter your email!" }

          // ]}
        >
          <Input rows={4} placeholder="Enter your email" type="text" style={inputStyle}/>
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please enter your role!" }]}
            >
            <Input placeholder="Enter your role" type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please enter your department!" }]}
            >
            <Input placeholder="Enter your department" type="text" />
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
                // rules={[{ required: true, message: "Please enter your password!" }]}
                >
                <Input placeholder="Enter password" type="password" style={inputStyle}/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
                <Form.Item
                name="confirmpassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={confirmPasswordRules}
                hasFeedback
                // rules={[{ required: true, message: "Please enter your confirm password!" }]}
                >
                <Input placeholder="Enter your confirm password" type="password" style={inputStyle}/>
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

//export default App;
