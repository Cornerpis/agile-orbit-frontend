import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Typography,
  Divider,
  Row,
  Col,
  Tooltip,
  Space,
  Alert,
  message,
  Radio,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAssessment,
  submitAssessment,
} from '../redux/action';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const { Title, Text } = Typography;

const AgileMaturityAssessment = () => {
  const assessmentId = useParams();
  const token = useParams(); // Replace with actual auth token

  const dispatch = useDispatch();
  const { loading, error, questions } = useSelector((state) => state.assessment || {});

  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(fetchAssessment(assessmentId, token));
  }, [dispatch, assessmentId, token]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const nextStep = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) return;

    const currentQuestionId = currentQuestion._id;
    if (!answers[currentQuestionId]) {
      setLocalError('Please answer the question before proceeding.');
      return;
    }

    setLocalError(null);
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setLocalError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await dispatch(submitAssessment(assessmentId, answers, token));
      message.success('Assessment submitted successfully.');
    } catch (err) {
      message.error('Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question) => {
    if (question.type === 'multiple_choice' && question.options?.length) {
      return (
        <Radio.Group
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          value={answers[question._id]}
          style={{ marginTop: 16 }}
        >
          <Space direction="vertical">
            {question.options.map((opt, idx) => (
              <Radio key={idx} value={opt}>
                {opt}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      );
    }

    if (question.type === 'text') {
      return (
        <textarea
          rows={4}
          style={{ width: '100%', marginTop: 16 }}
          value={answers[question._id] || ''}
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
        />
      );
    }

    return (
      <Alert
        message="Unsupported question type or missing options."
        type="warning"
        showIcon
      />
    );
  };

  const renderQuestionStep = () => {
    const question = questions[currentStep];

    if (!question) {
      return (
        <Alert
          message="No question found for this step."
          type="error"
          showIcon
        />
      );
    }

    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: 'auto' }}>
        <Title level={3}>Question {currentStep + 1}</Title>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong>{question.question}</Text>
            {question.tooltip && (
              <Tooltip title={question.tooltip}>
                <QuestionCircleOutlined />
              </Tooltip>
            )}
          </div>
          {renderQuestionInput(question)}
        </Card>

        {localError && (
          <Alert
            style={{ marginTop: 16 }}
            message={localError}
            type="error"
            showIcon
          />
        )}

        <Divider />

        <Row justify="space-between">
          <Col>
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              icon={<ArrowLeftOutlined />}
            >
              Previous
            </Button>
          </Col>
          <Col>
            {currentStep === questions.length - 1 ? (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
                icon={<ArrowRightOutlined />}
              >
                Submit
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={nextStep}
                icon={<ArrowRightOutlined />}
              >
                Next
              </Button>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading questions...</div>;
  }

  if (error && !questions?.length) {
    return (
      <Alert
        message="Failed to load assessment."
        description={error}
        type="error"
        showIcon
      />
    );
  }

  if (!questions?.length) {
    return (
      <Alert
        message="No questions available for this assessment."
        type="info"
        showIcon
      />
    );
  }

  return <div>{renderQuestionStep()}</div>;
};

export default AgileMaturityAssessment;
