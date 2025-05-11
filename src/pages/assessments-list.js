// pages/AssessmentsList.jsx
import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Space, Spin } from "antd";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAssessmentList } from "../redux/action";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getAssessmentList(token));
        setAssessments(response); // based on your response shape
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleStart = (assessment) => {
    history.push(`/take-assessment/${assessment._id}`, {
      state: { assessment },
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Available Assessments</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {assessments.map((assessment) => (
            <Card key={assessment._id} title={assessment.title} bordered>
              <Button type="primary" onClick={() => handleStart(assessment)}>
                Start Assessment
              </Button>
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
};

export default AssessmentsList;
