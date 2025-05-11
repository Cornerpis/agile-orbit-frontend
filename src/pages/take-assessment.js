import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Card,
  List,
  Button,
  Spin,
  message,
  Checkbox,
  Input,
} from "antd";
import { useDispatch } from "react-redux";
import { startAssessment } from "../redux/action";
import { Modal } from "antd";

const { Title, Paragraph } = Typography;

const TakeAssessment = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({}); // Store user answers

  const assessmentId = location.state.state.assessment._id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const startAssessments = async () => {
      setLoading(true);
      try {
        if (assessmentId && token) {
          const response = await dispatch(startAssessment(assessmentId));
          setAssessment(response.data);
          setStarted(true);
        } else {
          setError("Missing assessment ID or token.");
        }
      } catch (err) {
        console.error("Error starting assessments:", err);
        setError("Failed to start assessment.");
      } finally {
        setLoading(false);
      }
    };
    startAssessments();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  if (loading) return <Spin tip="Loading assessment..." />;
  if (error) return <Paragraph>{error}</Paragraph>;
  if (!assessment) return <Paragraph>No assessment data found.</Paragraph>;

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>{assessment.title}</Title>

      <List
        itemLayout="vertical"
        dataSource={assessment.questions}
        renderItem={(question, index) => (
          <Card key={question._id} style={{ marginBottom: "1rem" }}>
            <Title level={4}>
              Question {index + 1}: {question.question}
            </Title>

            {question.type === "multiple_choice" ? (
              <Checkbox.Group
                options={question.options}
                value={answers[question._id] || []}
                onChange={(checkedValues) =>
                  handleAnswerChange(question._id, checkedValues)
                }
              />
            ) : (
              <Input.TextArea
                rows={4}
                placeholder="Your answer..."
                value={answers[question._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
              />
            )}
          </Card>
        )}
      />

      <Button
        type="primary"
        onClick={() => {
          Modal.confirm({
            title: "Submit Assessment",
            content: "Are you sure you want to submit your answers?",
            okText: "Yes, Submit",
            cancelText: "Cancel",
            onOk() {
              console.log("User answers:", answers);
              // TODO: Add your actual submission logic here
            },
          });
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default TakeAssessment;
