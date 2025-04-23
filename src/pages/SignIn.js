import React from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  message,
} from "antd";
import signinbg from "../assets/images/img-signin.png";
import { signIn } from "../redux/action";
import { useDispatch } from "react-redux";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onFinish = async (values) => {
    const formData = {
      ...values,
    };

    try {
      const response = await dispatch(signIn(formData));

      // Handle successful authentication
      if (response?.status === 200 || response?.message?.toLowerCase().includes('success')) {
        message.loading('Authenticating...', 1.5)
          .then(() => {
            message.success('Login successful! Redirecting...', 2);
            setTimeout(() => {
              history.push("/dashboard");
            }, 2000);
          });
      } 
      // Handle case where credentials are correct but message differs
      else if (response?.data?.authenticated) {
        message.success('Welcome back! You will be redirected shortly...', 2.5);
        setTimeout(() => {
          history.push("/dashboard");
        }, 2500);
      }
      else {
        // Show backend message if available, otherwise neutral error
        const errorMessage = response?.message || 'Authentication failed. Please try again.';
        message.warning(errorMessage);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      message.error('Could not complete authentication at this time');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.warning('Please complete all required fields correctly');
  };

  return (
    <Layout className="layout-default layout-signin">
      <Header>
        <div className="header-col header-brand">
          <h5>Agile Orbit</h5>
        </div>
      </Header>
      <Content className="signin">
        <Row gutter={[24, 0]} justify="space-around">
          <Col
            xs={{ span: 24, offset: 0 }}
            lg={{ span: 6, offset: 2 }}
            md={{ span: 12 }}
          >
            <Title className="mb-15">Sign In</Title>
            <Title className="font-regular text-muted" level={5}>
              Enter your email and password to sign in
            </Title>
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password placeholder="Enter Password" visibilityToggle={false} />
              </Form.Item>
              <Form.Item
                name="remember"
                className="align-center"
                valuePropName="checked"
              >
                <Switch defaultChecked />
                Remember me
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  SIGN IN
                </Button>
              </Form.Item>
              <p className="font-semibold text-muted">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-dark font-bold">
                  Sign Up
                </Link>
              </p>
            </Form>
          </Col>
          <Col
            className="sign-img"
            style={{ padding: 12 }}
            xs={{ span: 24 }}
            lg={{ span: 12 }}
            md={{ span: 12 }}
          >
            <img src={signinbg} alt="Sign In" style={{ marginTop: 70 }} />
          </Col>
        </Row>
      </Content>
      <Footer style={{ marginTop: 160 }}>
        <p className="copyright">
          Copyright © <a href="#pablo">Cornerpise</a> 2025
        </p>
      </Footer>
    </Layout>
  );
};

export default SignIn;