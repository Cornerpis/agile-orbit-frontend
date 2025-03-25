import React, { useState } from 'react';
import {
  Card,
  Form,
  Slider,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Progress,
  Steps,
  Alert,
  Space,
  Collapse,
  Grid
} from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const {Step} = Steps;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { Panel } = Collapse;

const maturityLevels = [
  { value: 1, label: 'Initial', description: 'Ad-hoc processes' },
  { value: 2, label: 'Developing', description: 'Some processes defined' },
  { value: 3, label: 'Defined', description: 'Standard processes established' },
  { value: 4, label: 'Managed', description: 'Measured and controlled' },
  { value: 5, label: 'Optimizing', description: 'Continuous improvement' }
];

const assessmentCategories = [
  {
    key: 'team_dynamics',
    title: 'Team Dynamics',
    questions: [
      "Team members collaborate effectively",
      "Cross-functional skills are present",
      "Team is self-organizing",
      "Psychological safety exists"
    ]
  },
  {
    key: 'processes',
    title: 'Processes',
    questions: [
      "Regular sprint planning occurs",
      "Daily standups are effective",
      "Retrospectives lead to improvements",
      "Work is properly sized and estimated"
    ]
  },
  {
    key: 'delivery',
    title: 'Delivery',
    questions: [
      "Working software is delivered frequently",
      "Definition of Done is followed",
      "Technical debt is managed",
      "Continuous integration is practiced"
    ]
  },
  {
    key: 'leadership',
    title: 'Leadership',
    questions: [
      "Leadership supports Agile values",
      "Teams are empowered to make decisions",
      "There is a culture of continuous learning",
      "Leadership removes organizational impediments"
    ]
  }
];

const AgileMaturityAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  const handleRatingChange = (category, questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${category}_${questionIndex}`]: value
    }));
  };

  const calculateResults = () => {
    const categoryScores = {};
    
    assessmentCategories.forEach(category => {
      const categoryAnswers = [];
      
      category.questions.forEach((_, index) => {
        const answer = answers[`${category.key}_${index}`];
        if (answer !== undefined) {
          categoryAnswers.push(answer);
        }
      });
      
      if (categoryAnswers.length > 0) {
        const sum = categoryAnswers.reduce((a, b) => a + b, 0);
        const average = sum / categoryAnswers.length;
        
        categoryScores[category.key] = {
          average,
          title: category.title
        };
      }
    });
    
    return categoryScores;
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderQuestionStep = (category) => {
    return (
      <div style={{ padding: screens.xs ? '8px' : '16px' }}>
        <Title level={screens.xs ? 4 : 3}>{category.title}</Title>
        <Paragraph type="secondary">
          Rate your team (1 = Initial, 5 = Optimizing)
        </Paragraph>
        
        <Divider />
        
        <Form form={form} layout="vertical">
          {category.questions.map((question, qIndex) => (
            <Form.Item
              key={`${category.key}_${qIndex}`}
              label={question}
              style={{ marginBottom: screens.xs ? '24px' : '32px' }}
            >
              <Slider
                min={1}
                max={5}
                marks={{
                  1: '1',
                  2: '2',
                  3: '3',
                  4: '4',
                  5: '5'
                }}
                tooltip={{
                  formatter: value => maturityLevels.find(l => l.value === value)?.label,
                  visible: !screens.xs
                }}
                defaultValue={3}
                onChange={(value) => handleRatingChange(category.key, qIndex, value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: screens.xs ? '12px' : '14px' }}>
                  {maturityLevels[0].description}
                </Text>
                <Text type="secondary" style={{ fontSize: screens.xs ? '12px' : '14px' }}>
                  {maturityLevels[4].description}
                </Text>
              </div>
            </Form.Item>
          ))}
        </Form>
        
        <Divider />
        
        <Row justify="space-between">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={prevStep}
            disabled={currentStep === 0}
            size={screens.xs ? 'small' : 'middle'}
          >
            {screens.xs ? 'Back' : 'Previous'}
          </Button>
          <Button 
            type="primary" 
            icon={<ArrowRightOutlined />} 
            onClick={nextStep}
            size={screens.xs ? 'small' : 'middle'}
          >
            {currentStep === assessmentCategories.length - 1 ? 
              (screens.xs ? 'Results' : 'View Results') : 
              (screens.xs ? 'Next' : 'Next Category')}
          </Button>
        </Row>
      </div>
    );
  };

  const renderResults = () => {
    const results = calculateResults();
    const overallAverage = Object.values(results).reduce((sum, category) => 
      sum + category.average, 0) / Object.keys(results).length;
    
    return (
      <div style={{ padding: screens.xs ? '8px' : '16px' }}>
        <Title level={screens.xs ? 3 : 2}>Assessment Results</Title>
        <Alert
          message="Your Agile Maturity Assessment"
          description={`Overall score: ${overallAverage.toFixed(1)}/5`}
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
        
        <Progress 
          percent={(overallAverage / 5) * 100} 
          status="active" 
          format={() => `${overallAverage.toFixed(1)} / 5`}
          strokeWidth={screens.xs ? 12 : 8}
          style={{ marginBottom: '32px' }}
        />
        
        <Row gutter={[16, 16]}>
          {Object.entries(results).map(([key, category]) => (
            <Col xs={24} sm={12} lg={6} key={key}>
              <Card title={category.title} bordered={false}>
                <Progress
                  type="circle"
                  percent={(category.average / 5) * 100}
                  width={screens.xs ? 70 : 80}
                  strokeWidth={screens.xs ? 10 : 8}
                  format={() => (
                    <Text strong>{category.average.toFixed(1)}</Text>
                  )}
                  style={{ marginBottom: '16px' }}
                />
                <Text style={{ fontSize: screens.xs ? '12px' : '14px' }}>
                  {maturityLevels[Math.round(category.average) - 1]?.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Divider />
        
        <Title level={screens.xs ? 5 : 4}>Recommendations</Title>
        <Collapse accordion>
          {assessmentCategories.map(category => {
            const score = results[category.key]?.average || 0;
            let recommendation = "";
            
            if (score < 2.5) {
              recommendation = `Focus on basic ${category.title.toLowerCase()} practices. Consider training.`;
            } else if (score < 4) {
              recommendation = `Improve consistency in ${category.title.toLowerCase()} practices.`;
            } else {
              recommendation = `Maintain and optimize ${category.title.toLowerCase()} practices.`;
            }
            
            return (
              <Panel 
                header={`${category.title} (${score.toFixed(1)})`} 
                key={category.key}
                extra={<InfoCircleOutlined />}
              >
                <Paragraph>{recommendation}</Paragraph>
                {score < 3 && (
                  <ul style={{ paddingLeft: '16px' }}>
                    {category.questions.map((question, index) => {
                      const answer = answers[`${category.key}_${index}`] || 0;
                      if (answer < 3) {
                        return (
                          <li key={index}>
                            <Text style={{ fontSize: screens.xs ? '12px' : '14px' }}>
                              Improve: {question}
                            </Text>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                )}
              </Panel>
            );
          })}
        </Collapse>
        
        <Divider />
        
        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />}
          onClick={() => {
            setCurrentStep(0);
            setShowResults(false);
          }}
          block={screens.xs}
          size={screens.xs ? 'large' : 'middle'}
        >
          Start New Assessment
        </Button>
      </div>
    );
  };

  return (
    <Card 
      title="Agile Maturity Self-Assessment" 
      style={{ 
        margin: screens.xs ? '8px' : '16px',
        borderRadius: screens.xs ? '8px' : '12px'
      }}
      headStyle={{ borderBottom: 0 }}
    >
      {!showResults ? (
        <>
          <Steps 
            current={currentStep} 
            style={{ marginBottom: '24px' }}
            direction={screens.xs ? 'vertical' : 'horizontal'}
            responsive={false}
          >
            {assessmentCategories.map(category => (
              <Step 
                key={category.key} 
                title={screens.xs ? null : category.title}
                icon={screens.xs ? (
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: '#1890ff', 
                    borderRadius: '50%',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    {currentStep + 1}
                  </div>
                ) : null}
              />
            ))}
          </Steps>
          
          {renderQuestionStep(assessmentCategories[currentStep])}
          
          {currentStep === assessmentCategories.length - 1 && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Button 
                type="primary" 
                size={screens.xs ? 'large' : 'middle'}
                onClick={() => setShowResults(true)}
                block={screens.xs}
              >
                Complete Assessment
              </Button>
            </div>
          )}
        </>
      ) : (
        renderResults()
      )}
    </Card>
  );
};

export default AgileMaturityAssessment;