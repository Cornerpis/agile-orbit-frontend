import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Typography,
  notification,
} from 'antd';
import { useDispatch } from 'react-redux';
import { createAssessment } from '../redux/action';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const Profile = ({ onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { title, question, type, options, correct_answer } = values;

      if (!title || !question || !type || !correct_answer) {
        message.error('Please fill in all required fields.');
        return;
      }

      const optionsArray = options
        ? options.split(',').map((opt) => opt.trim())
        : [];

      const newQuestion = {
        question,
        type,
        options: optionsArray,
        correct_answer,
      };

      const updatedQuestions = [...questions, newQuestion];

      const token = localStorage.getItem('token');
      const payload = {
        title,
        questions: updatedQuestions,
      };

      const response = await dispatch(createAssessment(token, payload));

      if (
        response?.statusCode === 201 ||
        response?.success === true ||
        String(response?.success)?.toLowerCase() === 'true' ||
        response?.message?.toLowerCase?.().includes('success')
      ) {
        api.success({
          message: 'Assessment created successfully!',
          description: response.message,
          duration: 3,
        });
        setQuestions([]);
        form.resetFields();
        if (onCancel) onCancel();
      } else if (response?.statusCode === 400) {
        api.warning({
          message: 'Creation Failed',
          description: response.message || 'Please review your input.',
          duration: 4,
        });
      } else if (response?.statusCode === 409) {
        api.error({
          message: 'Duplicate Entry',
          description: response.message || 'Assessment already exists.',
          duration: 4,
        });
      } else {
        api.error({
          message: 'Unexpected Error',
          description: response.message || 'Something went wrong.',
          duration: 4,
        });
      }
      console.log(response);

    } catch (err) {
      message.error('Please complete all required fields before saving.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#f0f2f5',
        paddingTop: 40,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 32,
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        {contextHolder}
        <Title level={3}>Admin Test Creator</Title>
        <Paragraph type="secondary">
          Please fill in all fields and click Save to submit the test.
        </Paragraph>

        <Form layout="vertical" form={form}>
          <Form.Item
            label="Test Title"
            name="title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Enter test title" />
          </Form.Item>

          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: 'Question is required' }]}
          >
            <Input placeholder="Enter the question" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Type is required' }]}
          >
            <Select placeholder="Select type">
              <Option value="multiple_choice">Multiple Choice</Option>
              <Option value="short_answer">Short Answer</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Options (comma-separated)" name="options" 
          rules={[{ required: true, message: 'Correct answer is required' }]}>
            <Input.TextArea placeholder="e.g. Option A, Option B" />
          </Form.Item>

          <Form.Item
            label="Correct Answer"
            name="correct_answer"
            rules={[{ required: true, message: 'Correct answer is required' }]}
          >
            <Input placeholder="Enter correct answer" />
          </Form.Item>
          {/* <Button type="dashed" onClick={addQuestion} block>
            Add Question
          </Button> */}

          <Button type="primary" onClick={handleFormSubmit} block>
            Save Test
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
