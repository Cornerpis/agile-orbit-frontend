import React from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Checkbox,
  notification,
  Select,
} from "antd";
import { signUp } from "../redux/action";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { set } from "mobx";


const { Option } = Select;


const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

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

  // Form submission handler
  const onFinish = async (values) => {
    try {
      const response = await dispatch(signUp(values));
  
      if (response?.status === "success") {
        api.success({
          message: response.message,
          description: "You can now sign in with your credentials.",
          duration: 3,
        });
        setTimeout(() => {
        history.push("/sign-in");         
        }
        , 1000);
        
      } else {
        api.error({
          message: "Registration Failed",
          description: response?.message || "An unexpected error occurred",
          duration: 3,
        });
      }
    } catch (error) {
      api.error({
        message: "Registration Error",
        description: "An unexpected error occurred",
        duration: 3,
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    api.error({
      message: "Form submission failed",
      description: "Please check the form fields and try again.",
      duration: 3,
    });
  };
  

  const inputStyle = {
    padding: '8px 11px',
    borderRadius: '5px',
    width: '100%',
    height: '40px'
  };
  
  return (
    <Layout className="layout-default layout-signin">
      {contextHolder}
      <Header style={{ backgroundColor: 'white' }}>
        <div className="header-col header-brand">
          <h5 style={{ color: "black" }}>Agile Orbit</h5>
        </div>
      </Header>
      
      <Content className="p-0">
        <div className="sign-up-header">
          <div className="content">
            <Title style={{ color: "black" }}>Sign Up</Title>
            <p className="text-lg" style={{ color: "black" }}>
              Please provide the necessary details below to create your
              account. Ensure all information is accurate for a seamless
              experience.
            </p>
          </div>
        </div>

        <Card
          className="card-signup header-solid h-full ant-card pt-0"
          title=""
          bordered={false}
        >
          <Form
            form={form}
            layout="vertical"
            name="register"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="row-col"
            style={{ marginTop: 20 }}
          >
            <Form.Item
              label="Firstname"
              name="first_name"
              rules={[
                { required: true, message: "Please enter your first name" },
                { min: 2, message: "First name must be at least 2 characters" }
              ]}
            >
              <Input placeholder="First name" style={inputStyle} />
            </Form.Item>

            <Form.Item
              label="Lastname"
              name="last_name"
              rules={[
                { required: true, message: "Please enter your last name" },
                { min: 2, message: "Last name must be at least 2 characters" }
              ]}
            >
              <Input placeholder="Last name" style={inputStyle} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={emailRules}
              hasFeedback
            >
              <Input placeholder="Enter your email" style={inputStyle} />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role"
              rules={[
                { required: true, message: "Please enter your role" },
              ]}
            >
            <Select placeholder="Select role" >
            <Option value="project_manager">Project Manager</Option>
            <Option value="staff">Staff</Option>
            </Select>
            </Form.Item>
            <Form.Item
              label="Department"
              name="department"
              rules={[
                { required: true, message: "Please enter your department" },
                { min: 4, message: "Department must be at least 4 characters" }
              ]}
            >
              <Input placeholder="Department" style={inputStyle} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={passwordRules}
              hasFeedback
            >
              <Input.Password
                placeholder="Password (min 6 chars with special character)"
                style={inputStyle}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={confirmPasswordRules}
              hasFeedback
            >
              <Input.Password
                placeholder="Confirm password"
                style={inputStyle}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms')),
              },
            ]}
            >
              <Checkbox>
                I agree to the <a href="#terms" className="font-bold text-dark"> Terms and Conditions
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: "100%", marginTop: 10 }}
                type="primary"
                htmlType="submit">
                SIGN UP
              </Button>
            </Form.Item>
          </Form>

          <p className="font-semibold text-muted text-center">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-bold text-dark">
              Sign In
            </Link>
          </p>
        </Card>
      </Content>

      <Footer>
        <Menu mode="horizontal" className="menu-nav-social"></Menu>
        <p className="copyright">
          © 2025 {""} Cornerpis 
        </p>
      </Footer>
    </Layout>
  );
};

export default SignUp;