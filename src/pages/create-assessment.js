import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createAssessment } from "../redux/action"; // adjust this import path
const { Title } = Typography;
const { Option } = Select;

const CreateAssessment = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    const payload = {
      title: values.title,
      questions: values.questions.map((q) => ({
        question: q.question,
        type: q.type,
        options: q.type === "multiple_choice" ? q.options : undefined,
        correct_answer: q.correct_answer,
      })),
    };

    try {
      const res = await dispatch(createAssessment(token, payload));

      if (res.message === "Assessment created successfully.") {
        message.success(res.message || "Assessment created!");
        form.resetFields();
      } else {
        message.error(res.message || "Failed to create assessment");
      }
    } catch (err) {
      console.error(err);
      message.error("Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ margin: "2rem" }}>
      <Title level={3}>Create Assessment</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Assessment Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter assessment title" />
        </Form.Item>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  style={{ marginBottom: 16 }}
                  type="inner"
                  title={`Question ${key + 1}`}
                  extra={
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: "red" }}
                    />
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, "question"]}
                    label="Question"
                    rules={[{ required: true, message: "Enter the question" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    label="Type"
                    rules={[{ required: true, message: "Select type" }]}
                  >
                    <Select placeholder="Select type">
                      <Option value="text">Text</Option>
                      <Option value="multiple_choice">Multiple Choice</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    shouldUpdate={(prev, curr) =>
                      prev.questions?.[name]?.type !==
                      curr.questions?.[name]?.type
                    }
                  >
                    {({ getFieldValue }) => {
                      const type = getFieldValue(["questions", name, "type"]);
                      const options =
                        getFieldValue(["questions", name, "options"]) || [];

                      return (
                        <>
                          {type === "multiple_choice" && (
                            <>
                              <Form.List name={[name, "options"]}>
                                {(
                                  optFields,
                                  { add: addOpt, remove: removeOpt }
                                ) => (
                                  <>
                                    <label>Options</label>
                                    {optFields.map(
                                      ({ key: optKey, name: optName }) => (
                                        <Space
                                          key={optKey}
                                          style={{
                                            display: "flex",
                                            marginBottom: 8,
                                          }}
                                          align="baseline"
                                        >
                                          <Form.Item
                                            name={[optName]}
                                            rules={[
                                              {
                                                required: true,
                                                message: "Enter option",
                                              },
                                            ]}
                                          >
                                            <Input
                                              placeholder={`Option ${
                                                optName + 1
                                              }`}
                                            />
                                          </Form.Item>
                                          <MinusCircleOutlined
                                            onClick={() => removeOpt(optName)}
                                            style={{ color: "red" }}
                                          />
                                        </Space>
                                      )
                                    )}
                                    <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => addOpt()}
                                        icon={<PlusOutlined />}
                                      >
                                        Add Option
                                      </Button>
                                    </Form.Item>
                                  </>
                                )}
                              </Form.List>
                            </>
                          )}

                          <Form.Item
                            name={[name, "correct_answer"]}
                            label="Correct Answer"
                            rules={[
                              {
                                required: true,
                                message: "Provide the correct answer",
                              },
                            ]}
                          >
                            {type === "multiple_choice" ? (
                              <Select
                                placeholder="Select correct answer"
                                options={options.map((opt) => ({
                                  label: opt,
                                  value: opt,
                                }))}
                              />
                            ) : (
                              <Input placeholder="Enter correct answer" />
                            )}
                          </Form.Item>
                        </>
                      );
                    }}
                  </Form.Item>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                >
                  Add Question
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Create Assessment
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateAssessment;
