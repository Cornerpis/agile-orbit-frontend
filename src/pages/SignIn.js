import React from "react";
import { Link, useHistory } from "react-router-dom"; // Import useHistory
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
} from "antd";
import signinbg from "../assets/images/img-signin.jpg";
import { signIn } from "../redux/action";
import { useDispatch } from "react-redux";
import { notification } from "antd";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useHistory(); // Initialize history

  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    const formData = {
      ...values,
    };

    try {
      const response = await dispatch(signIn(formData));

      if (response.message == "success") {
        const btn = (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              notification.destroy(); // optional: closes all notifications
              history.push("/dashboard");
            }}
          >
            OK
          </Button>
        );

        notification.open({
          message: "Login Successful ✅",
          description: "Click OK to go to your dashboard.",
          btn,
          duration: 0, // stays until user clicks
        });
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout className="layout-default layout-signin">
      {contextHolder}
      <Header>
        <div className="header-col header-brand">
          <h5>Agile Project Dashboard</h5>
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
                className="username"
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                className="username"
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input placeholder="Password" type="password" />
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
            <img src={signinbg} alt="Sign In" />
          </Col>
        </Row>
      </Content>
      <Footer>
        <p className="copyright">
          Copyright © 2021 Muse by <a href="#pablo">Creative Tim</a>.
        </p>
      </Footer>
    </Layout>
  );
};

export default SignIn;
