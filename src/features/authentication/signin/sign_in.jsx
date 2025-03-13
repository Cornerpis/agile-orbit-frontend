import React from "react";
import { Form, Input, Typography, Divider } from "antd";
import PrimaryButton from "../../../components/primary_button"; // Reusable button component

const SignIn = () => {
  //Write an internal Style for this page along
  const styles = {
    container: {
      width: "320px",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "16px",
      fontWeight: "bold",
    },
    links: {
      marginTop: "16px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <Typography.Title level={2}>Agile Orbit</Typography.Title>
      <Typography.Title level={3} style={styles.subtitle}>
        WELCOME BACK!
      </Typography.Title>

      <Form layout="vertical" style={{ width: "100%" }}>
        <Form.Item label="Email">
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label="Password">
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        {/* Invoke the PrimaryButton component and passed props to it */}
        <PrimaryButton text="Sign in" type="primary" block />
      </Form>

      <div style={styles.links}>
        <Typography.Text>
          Not a member? <a href="https://sampleurl.com">Sign up</a>
        </Typography.Text>
        <Divider plain>or</Divider>
        <Typography.Text>
          <a href="https://sampleurl.com">Forgot your password?</a>
        </Typography.Text>
      </div>
    </div>
  );
};

export default SignIn;
