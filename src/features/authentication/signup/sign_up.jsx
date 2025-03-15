import React from "react";
import {Typography, Form, Input, Divider } from 'antd';
import PrimaryButton from "../../../components/primary_button"; // Reuse button component
 

const {Title, Text} = Typography;

const SignUp = () => {

    //Internal style
    const styles = {
        container:{
            width: "320px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
        },
        subtitle:{
            fontSize: "16px",
        },

        link:{
            marginTop: "16px",
            textAlign: "center",
            marginBottom: "100px"
        }

    }
 return (
    <div style={styles.container}>
    <Typography>
    <Title level={2}>Agile Orbit</Title>
    </Typography>

    <Typography>
    <Title level={5} style={styles.subtitle}>Fill in the form with the correct information to create an account.</Title>
    </Typography>

    <Form layout ="vertical" style={{width: "100%", marginTop:"40px"}}>
        <Form.Item label="First name">
            <Input placeholder= "Enter your first name" size ="large" />
        </Form.Item>

        <Form.Item label="Last name">
            <Input placeholder="Enter your last name" size ="large" />
        </Form.Item>

        <Form.Item label="Email">
            <Input placeholder="Enter your email" size = "large" />
        </Form.Item>
        
        <Form.Item label="Phone number">
            <Input placeholder="Enter your phone number" size="large" />
        </Form.Item>

        <Form.Item label="Role">
            <Input placeholder="Enter your role" size="large"/>
        </Form.Item>

        <Form.Item label="Department">
            <Input placeholder="Enter yourdepartment" size="large"/>
        </Form.Item>

        <Form.Item label= "Password" >
            <Input placeholder="Enter your password" size="large" />
        </Form.Item>

        <Form.Item label="Confirm Password">
            <Input placeholder="Confirm your password" size="large" />
        </Form.Item>

        {/*Render the PrimaryButton component with the appropriate props. */ }
        <PrimaryButton text="Sign Up" type="primary" block />
    </Form>

    <div style={styles.link} >
        <Typography>
            <Text>Don't have an account? <a href="https://sampleurl.com">sign Up</a></Text>
        </Typography>
        <Divider>Or</Divider>
        <Typography>
            <Text>
                <a href="https://sampleurl.com" >Forgot your password?</a>
            </Text>
        </Typography>
    </div>
   
    
    </div>


    
 )
    
}
export default SignUp;