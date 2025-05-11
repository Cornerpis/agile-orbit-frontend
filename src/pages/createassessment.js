import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Select,
  Space,
  Tag,
  Tooltip,
  InputNumber,
  Switch,
  message,
  Collapse,
  List
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const initialAssessmentTypes = [
  {
    id: 'agile-maturity',
    name: 'Agile Maturity Assessment',
    description: 'Evaluate team Agile practices and maturity level'
  },
  {
    id: 'team-health',
    name: 'Team Health Check',
    description: 'Assess overall team dynamics and collaboration'
  }
];

const initialQuestionTypes = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'scale', label: 'Scale (1-5)' },
  { value: 'text', label: 'Text Response' }
];

const CreateAssessment = () => {
  const [form] = Form.useForm();
  const [assessments, setAssessments] = useState(initialAssessmentTypes);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('setup');

  const handleCreateAssessment = (values) => {
    const newAssessment = {
      id: `assessment-${Date.now()}`,
      name: values.name,
      description: values.description
    };
    setAssessments([...assessments, newAssessment]);
    message.success('Assessment created successfully');
    form.resetFields();
  };

  const handleAddQuestion = (values) => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: values.text,
      type: values.type,
      required: values.required || false,
      options: values.type === 'multiple-choice' ? 
        values.options.map((opt, i) => ({
          id: `opt-${i}-${Date.now()}`,
          label: opt.label,
          value: opt.value
        })) : 
        null,
      tooltip: values.tooltip
    };

    if (editingQuestion) {
      setQuestions(questions.map(q => 
        q.id === editingQuestion.id ? newQuestion : q
      ));
      setEditingQuestion(null);
      message.success('Question updated successfully');
    } else {
      setQuestions([...questions, newQuestion]);
      message.success('Question added successfully');
    }
    form.resetFields(['text', 'type', 'options', 'tooltip', 'required']);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    form.setFieldsValue({
      text: question.text,
      type: question.type,
      required: question.required,
      options: question.options?.map(opt => ({
        label: opt.label,
        value: opt.value
      })) || [],
      tooltip: question.tooltip
    });
    setActiveTab('questions');
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    message.success('Question deleted successfully');
  };

  const renderQuestionForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleAddQuestion}
      initialValues={{ type: 'multiple-choice', required: true }}
    >
      <Form.Item
        label="Question Text"
        name="text"
        rules={[{ required: true, message: 'Please enter the question text' }]}
      >
        <Input.TextArea rows={3} placeholder="Enter your question here..." />
      </Form.Item>

      <Form.Item
        label="Question Type"
        name="type"
        rules={[{ required: true, message: 'Please select a question type' }]}
      >
        <Select onChange={() => form.resetFields(['options'])}>
          {initialQuestionTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tooltip Text"
        name="tooltip"
      >
        <Input placeholder="Optional help text for the question" />
      </Form.Item>

      <Form.Item
        label="Required"
        name="required"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.type !== currentValues.type
        }
      >
        {({ getFieldValue }) => 
          getFieldValue('type') === 'multiple-choice' ? (
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Answer Options
                  </Text>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'label']}
                        rules={[{ required: true, message: 'Missing option label' }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="Option text" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Missing option value' }]}
                        style={{ width: 100 }}
                      >
                        <InputNumber placeholder="Value" min={0} />
                      </Form.Item>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Option
                  </Button>
                </>
              )}
            </Form.List>
          ) : null
        }
      </Form.Item>

      <Form.Item style={{ marginTop: 24 }}>
        <Button 
          type="primary" 
          htmlType="submit"
          icon={editingQuestion ? <SaveOutlined /> : <PlusOutlined />}
        >
          {editingQuestion ? 'Update Question' : 'Add Question'}
        </Button>
        {editingQuestion && (
          <Button 
            style={{ marginLeft: 8 }}
            onClick={() => {
              setEditingQuestion(null);
              form.resetFields(['text', 'type', 'options', 'tooltip', 'required']);
            }}
          >
            Cancel
          </Button>
        )}
      </Form.Item>
    </Form>
  );

  const renderQuestionList = () => (
    <List
      itemLayout="vertical"
      dataSource={questions}
      renderItem={(question) => (
        <List.Item
          actions={[
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditQuestion(question)}
            />,
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteQuestion(question.id)}
            />
          ]}
        >
          <List.Item.Meta
            title={
              <Space>
                <Text strong>{question.text}</Text>
                {question.tooltip && (
                  <Tooltip title={question.tooltip}>
                    <QuestionCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                )}
                <Tag>{question.type}</Tag>
                {question.required && <Tag color="red">Required</Tag>}
              </Space>
            }
            description={
              question.options ? (
                <Space direction="vertical" size="small" style={{ marginTop: 8 }}>
                  {question.options.map(opt => (
                    <Text key={opt.id} type="secondary">
                      {opt.label} (Value: {opt.value})
                    </Text>
                  ))}
                </Space>
              ) : null
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={3}>Assessment Builder</Title>
      
      <Row gutter={24}>
        <Col span={6}>
          <Card title="Your Assessments" bordered={false}>
            <List
              dataSource={assessments}
              renderItem={(assessment) => (
                <List.Item
                  onClick={() => {
                    setCurrentAssessment(assessment);
                    setQuestions([]); // Reset questions when selecting new assessment
                    setActiveTab('questions');
                  }}
                  style={{
                    cursor: 'pointer',
                    background: currentAssessment?.id === assessment.id ? '#f0f9ff' : 'transparent',
                    padding: '8px 12px',
                    borderRadius: 4
                  }}
                >
                  <List.Item.Meta
                    title={assessment.name}
                    description={assessment.description}
                  />
                </List.Item>
              )}
            />
            <Divider />
            <Collapse bordered={false}>
              <Panel header="Create New Assessment" key="1">
                <Form
                  layout="vertical"
                  onFinish={handleCreateAssessment}
                  initialValues={{ required: true }}
                >
                  <Form.Item
                    label="Assessment Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter a name' }]}
                  >
                    <Input placeholder="e.g. Agile Maturity Assessment" />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                  >
                    <Input.TextArea rows={3} placeholder="Describe the purpose of this assessment" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                      Create Assessment
                    </Button>
                  </Form.Item>
                </Form>
              </Panel>
            </Collapse>
          </Card>
        </Col>
        
        <Col span={18}>
          {currentAssessment ? (
            <Card
              title={
                <Space>
                  <Text strong>{currentAssessment.name}</Text>
                  <Tag color="blue">Editing</Tag>
                </Space>
              }
              extra={
                <Button type="primary" disabled={questions.length === 0}>
                  Publish Assessment
                </Button>
              }
              tabList={[
                { key: 'questions', tab: 'Questions' },
                { key: 'settings', tab: 'Settings' },
                { key: 'preview', tab: 'Preview' }
              ]}
              activeTabKey={activeTab}
              onTabChange={setActiveTab}
            >
              {activeTab === 'questions' && (
                <Row gutter={24}>
                  <Col span={12}>
                    <Title level={5} style={{ marginBottom: 16 }}>
                      {editingQuestion ? 'Edit Question' : 'Add New Question'}
                    </Title>
                    {renderQuestionForm()}
                  </Col>
                  <Col span={12}>
                    <Title level={5} style={{ marginBottom: 16 }}>
                      Questions ({questions.length})
                    </Title>
                    {questions.length > 0 ? (
                      renderQuestionList()
                    ) : (
                      <Card style={{ textAlign: 'center' }}>
                        <Text type="secondary">No questions added yet</Text>
                      </Card>
                    )}
                  </Col>
                </Row>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <Title level={5}>Assessment Settings</Title>
                  <Form layout="vertical">
                    <Form.Item label="Assessment Name">
                      <Input defaultValue={currentAssessment.name} />
                    </Form.Item>
                    <Form.Item label="Description">
                      <Input.TextArea 
                        defaultValue={currentAssessment.description} 
                        rows={4} 
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">Save Settings</Button>
                    </Form.Item>
                  </Form>
                </div>
              )}
              
              {activeTab === 'preview' && (
                <div>
                  <Title level={4}>Assessment Preview</Title>
                  {questions.length > 0 ? (
                    <Card>
                      {questions.map((q, i) => (
                        <div key={q.id} style={{ marginBottom: 24 }}>
                          <Text strong>
                            {i + 1}. {q.text}
                            {q.required && <Text type="danger"> *</Text>}
                          </Text>
                          {q.tooltip && (
                            <Tooltip title={q.tooltip}>
                              <QuestionCircleOutlined 
                                style={{ color: '#1890ff', marginLeft: 8 }} 
                              />
                            </Tooltip>
                          )}
                          
                          {q.type === 'multiple-choice' && (
                            <div style={{ marginTop: 8 }}>
                              {q.options?.map(opt => (
                                <div key={opt.id}>
                                  <input 
                                    type="radio" 
                                    id={`preview-${q.id}-${opt.id}`} 
                                    name={`preview-${q.id}`} 
                                  />
                                  <label 
                                    htmlFor={`preview-${q.id}-${opt.id}`}
                                    style={{ marginLeft: 8 }}
                                  >
                                    {opt.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {q.type === 'scale' && (
                            <div style={{ marginTop: 8 }}>
                              <Select style={{ width: 200 }}>
                                {[1, 2, 3, 4, 5].map(num => (
                                  <Option key={num} value={num}>
                                    {num}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                          )}
                          
                          {q.type === 'text' && (
                            <div style={{ marginTop: 8 }}>
                              <Input.TextArea rows={3} />
                            </div>
                          )}
                        </div>
                      ))}
                    </Card>
                  ) : (
                    <Card style={{ textAlign: 'center' }}>
                      <Text type="secondary">No questions to preview</Text>
                    </Card>
                  )}
                </div>
              )}
            </Card>
          ) : (
            <Card style={{ textAlign: 'center' }}>
              <Text type="secondary">
                Select an assessment from the left or create a new one to get started
              </Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CreateAssessment;