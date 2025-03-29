import React, { useState } from 'react';
import {
  Card,
  Form,
  Radio,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Progress,
  Steps,
  Alert,
  Collapse,
  Grid,
  Space,
  Tag,
  Tooltip
} from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { Panel } = Collapse;

const assessmentSections = [
  {
    key: 'framework',
    title: 'Agile Framework & Team Structure',
    shortTitle: 'Framework',
    questions: [
      {
        text: 'What Agile framework does your team primarily use?',
        options: [
          { label: 'Scrum', value: 4 },
          { label: 'Kanban', value: 3 },
          { label: 'SAFe', value: 2 },
          { label: 'Hybrid', value: 3 },
          { label: 'No formal Agile methodology', value: 1 }
        ],
        tooltip: 'The methodology your team follows for Agile implementation'
      },
      {
        text: 'How frequently does your team conduct Agile ceremonies?',
        options: [
          { label: 'After every sprint', value: 4 },
          { label: 'Occasionally', value: 3 },
          { label: 'Rarely', value: 2 },
          { label: 'Never', value: 1 }
        ],
        tooltip: 'Regularity of stand-ups, sprint planning, retrospectives etc.'
      },
      {
        text: 'How well does your team understand Agile principles and values?',
        options: [
          { label: 'Very well', value: 4 },
          { label: 'Moderately well', value: 3 },
          { label: 'Somewhat', value: 2 },
          { label: 'Poorly', value: 1 },
          { label: 'Not at all', value: 0 }
        ],
        tooltip: 'Team members\' comprehension of Agile fundamentals'
      },
      {
        text: 'Does your organization provide Agile training to team members?',
        options: [
          { label: 'Yes, regularly', value: 4 },
          { label: 'Occasionally', value: 3 },
          { label: 'Rarely', value: 2 },
          { label: 'No training provided', value: 1 }
        ],
        tooltip: 'Availability of formal Agile education for team members'
      },
      {
        text: 'How often do team members participate in Agile retrospectives?',
        options: [
          { label: 'After every sprint', value: 4 },
          { label: 'Every few sprints', value: 3 },
          { label: 'Rarely', value: 2 },
          { label: 'Never', value: 1 }
        ],
        tooltip: 'Participation in reflection and improvement sessions'
      }
    ]
  },
  {
    key: 'planning',
    title: 'Agile Planning & Estimation',
    shortTitle: 'Planning',
    questions: [
      {
        text: 'How does your team prioritize backlog items?',
        options: [
          { label: 'Business Value', value: 4 },
          { label: 'Customer Feedback', value: 3 },
          { label: 'Team Voting', value: 2 },
          { label: 'No Prioritization Process', value: 1 }
        ],
        tooltip: 'Method used to determine work item importance'
      },
      {
        text: 'Which estimation technique does your team primarily use?',
        options: [
          { label: 'Planning Poker', value: 4 },
          { label: 'T-shirt Sizing', value: 3 },
          { label: 'Story Points', value: 3 },
          { label: 'No Formal Estimation', value: 1 }
        ],
        tooltip: 'Approach for sizing work items'
      },
      {
        text: 'How often does your team refine backlog items?',
        options: [
          { label: 'Weekly', value: 4 },
          { label: 'Bi-weekly', value: 3 },
          { label: 'Before Every Sprint', value: 3 },
          { label: 'Rarely or Never', value: 1 }
        ],
        tooltip: 'Regularity of backlog grooming sessions'
      },
      {
        text: 'How accurate are your team\'s sprint estimations?',
        options: [
          { label: 'Very Accurate', value: 4 },
          { label: 'Moderately Accurate', value: 3 },
          { label: 'Somewhat Accurate', value: 2 },
          { label: 'Inaccurate', value: 1 }
        ],
        tooltip: 'Precision of your team\'s planning predictions'
      },
      {
        text: 'How does your team handle scope changes during sprints?',
        options: [
          { label: 'Strictly Follow Sprint Plan', value: 2 },
          { label: 'Allow Minor Adjustments', value: 3 },
          { label: 'Regularly Adapt Scope', value: 4 },
          { label: 'No Clear Process', value: 1 }
        ],
        tooltip: 'Approach to mid-sprint requirement changes'
      }
    ]
  },
  {
    key: 'execution',
    title: 'Agile Execution & Delivery',
    shortTitle: 'Execution',
    questions: [
      {
        text: 'How often does your team deliver working software?',
        options: [
          { label: 'Every Sprint', value: 4 },
          { label: 'Every Few Sprints', value: 3 },
          { label: 'Only at Release Milestones', value: 2 },
          { label: 'No Regular Delivery Schedule', value: 1 }
        ],
        tooltip: 'Frequency of production-ready deliverables'
      },
      {
        text: 'How well does your team adapt to changing requirements?',
        options: [
          { label: 'Very Well', value: 4 },
          { label: 'Moderately Well', value: 3 },
          { label: 'Somewhat Struggles', value: 2 },
          { label: 'Poorly', value: 1 }
        ],
        tooltip: 'Team responsiveness to evolving needs'
      },
      {
        text: 'Does your team track work using a visual management system?',
        options: [
          { label: 'Yes, Always', value: 4 },
          { label: 'Sometimes', value: 3 },
          { label: 'Rarely', value: 2 },
          { label: 'No Visual System', value: 1 }
        ],
        tooltip: 'Usage of Kanban boards or similar visual tools'
      },
      {
        text: 'How frequently does your team measure and improve velocity?',
        options: [
          { label: 'After Every Sprint', value: 4 },
          { label: 'Occasionally', value: 3 },
          { label: 'Rarely', value: 2 },
          { label: 'Never', value: 1 }
        ],
        tooltip: 'Tracking and optimizing work throughput'
      },
      {
        text: 'How does your team handle technical debt?',
        options: [
          { label: 'Actively Manages & Reduces It', value: 4 },
          { label: 'Occasionally Allocates Time', value: 3 },
          { label: 'Rarely Addresses It', value: 2 },
          { label: 'Ignores It Until It Becomes a Problem', value: 1 }
        ],
        tooltip: 'Approach to code quality and maintenance'
      }
    ]
  },
  {
    key: 'culture',
    title: 'Agile Culture & Continuous Improvement',
    shortTitle: 'Culture',
    questions: [
      {
        text: 'How well does your organization embrace Agile values and principles?',
        options: [
          { label: 'Very Well', value: 4 },
          { label: 'Moderately Well', value: 3 },
          { label: 'Somewhat Struggles', value: 2 },
          { label: 'Poorly', value: 1 }
        ],
        tooltip: 'Organizational adoption of Agile mindset'
      },
      {
        text: 'How frequently does your team conduct retrospectives and act on feedback?',
        options: [
          { label: 'After Every Sprint', value: 4 },
          { label: 'Occasionally', value: 3 },
          { label: 'Rarely', value: 2 },
          { label: 'Never', value: 1 }
        ],
        tooltip: 'Regular reflection and implementation of improvements'
      },
      {
        text: 'How open is your organization to feedback from customers and stakeholders?',
        options: [
          { label: 'Very Open', value: 4 },
          { label: 'Moderately Open', value: 3 },
          { label: 'Somewhat Resistant', value: 2 },
          { label: 'Not Open at All', value: 1 }
        ],
        tooltip: 'Receptiveness to external input'
      },
      {
        text: 'How often does your team engage in Agile coaching or training to improve processes?',
        options: [
          { label: 'Regularly', value: 4 },
          { label: 'Occasionally', value: 3 },
          { label: 'Rarely', value: 2 },
          { label: 'Never', value: 1 }
        ],
        tooltip: 'Investment in process improvement education'
      },
      {
        text: 'Does your organization encourage experimentation and innovation?',
        options: [
          { label: 'Yes, Strongly Encouraged', value: 4 },
          { label: 'Somewhat Encouraged', value: 3 },
          { label: 'Rarely Encouraged', value: 2 },
          { label: 'Not Encouraged', value: 1 }
        ],
        tooltip: 'Support for trying new approaches'
      }
    ]
  }
];

const maturityLevels = [
  { value: 0, label: 'Not Agile', description: 'No Agile practices in place', color: 'red' },
  { value: 1, label: 'Initial', description: 'Ad-hoc processes', color: 'volcano' },
  { value: 2, label: 'Developing', description: 'Some processes defined', color: 'orange' },
  { value: 3, label: 'Defined', description: 'Standard processes established', color: 'gold' },
  { value: 4, label: 'Managed', description: 'Measured and controlled', color: 'blue' },
  { value: 5, label: 'Optimizing', description: 'Continuous improvement', color: 'green' }
];

const AgileMaturityAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const screens = useBreakpoint();

  // Responsive configuration
  const isMobile = !screens.sm;
  const isTablet = screens.sm && !screens.lg;
  const isDesktop = screens.lg;

  const handleAnswerChange = (sectionKey, questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${sectionKey}_${questionIndex}`]: value
    }));
  };

  const calculateResults = () => {
    const sectionScores = {};
    
    assessmentSections.forEach(section => {
      const sectionAnswers = [];
      
      section.questions.forEach((_, index) => {
        const answer = answers[`${section.key}_${index}`];
        if (answer !== undefined) {
          sectionAnswers.push(answer);
        }
      });
      
      if (sectionAnswers.length > 0) {
        const sum = sectionAnswers.reduce((a, b) => a + b, 0);
        const average = sum / sectionAnswers.length;
        const normalized = (average / 4) * 5; // Scale to 0-5
        
        sectionScores[section.key] = {
          score: normalized,
          title: section.title,
          max: 5
        };
      }
    });
    
    return sectionScores;
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderQuestionStep = (section) => {
    return (
      <div style={{ 
        padding: isMobile ? '12px' : '24px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <Title 
          level={isMobile ? 4 : 3} 
          style={{ 
            marginBottom: isMobile ? '8px' : '16px',
            fontSize: isMobile ? '18px' : '24px'
          }}
        >
          {section.title}
        </Title>
        
        <Paragraph type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
          Answer each question based on your team's current practices
        </Paragraph>
        
        <Divider style={{ 
          margin: isMobile ? '12px 0' : '16px 0',
          borderWidth: '1px'
        }} />
        
        <Space 
          direction="vertical" 
          size={isMobile ? 'middle' : 'large'} 
          style={{ width: '100%' }}
        >
          {section.questions.map((question, qIndex) => (
            <Card 
              key={`${section.key}_${qIndex}`}
              size="small"
              style={{ 
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              bodyStyle={{
                padding: isMobile ? '12px' : '16px'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: isMobile ? '6px' : '8px'
              }}>
                <Text strong style={{ 
                  fontSize: isMobile ? '14px' : '16px',
                  lineHeight: 1.4
                }}>
                  {question.text}
                </Text>
                {question.tooltip && (
                  <Tooltip title={question.tooltip}>
                    <QuestionCircleOutlined style={{ 
                      color: '#1890ff',
                      fontSize: isMobile ? '14px' : '16px',
                      marginLeft: '8px'
                    }} />
                  </Tooltip>
                )}
              </div>
              
              <Radio.Group
                onChange={(e) => handleAnswerChange(section.key, qIndex, e.target.value)}
                value={answers[`${section.key}_${qIndex}`]}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {question.options.map((option, oIndex) => (
                    <Radio 
                      key={oIndex} 
                      value={option.value}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        margin: isMobile ? '4px 0' : '8px 0',
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: 1.4
                      }}
                    >
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          ))}
        </Space>
        
        <Divider style={{ 
          margin: isMobile ? '16px 0' : '24px 0',
          borderWidth: '1px'
        }} />
        
        <Row justify="space-between" gutter={isMobile ? 8 : 16}>
          <Col flex={isMobile ? '80px' : '120px'}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={prevStep}
              disabled={currentStep === 0}
              size={isMobile ? 'small' : 'middle'}
              block
            >
              {isMobile ? 'Back' : 'Previous'}
            </Button>
          </Col>
          <Col flex={isMobile ? '100px' : '120px'}>
            <Button 
              type="primary" 
              icon={<ArrowRightOutlined />} 
              onClick={nextStep}
              size={isMobile ? 'small' : 'middle'}
              block
              style={{ float: 'right' }}
            >
              {currentStep === assessmentSections.length - 1 ? 
                'View Result' : 
                'Next'}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  const renderResults = () => {
    const results = calculateResults();
    const overallScore = Object.values(results).reduce((sum, section) => 
      sum + section.score, 0) / Object.keys(results).length;
    
    const currentLevel = maturityLevels.reduce((prev, curr) => 
      Math.abs(curr.value - overallScore) < Math.abs(prev.value - overallScore) ? curr : prev
    );

    return (
      <div style={{ 
        padding: isMobile ? '12px' : '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Title 
          level={isMobile ? 3 : 2} 
          style={{ 
            marginBottom: isMobile ? '12px' : '24px',
            fontSize: isMobile ? '20px' : '28px'
          }}
        >
          Agile Maturity Assessment Results
        </Title>
        
        <Alert
          message={<Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>Your Agile Maturity Level</Text>}
          description={
            <Space direction="vertical" size="small" style={{ marginTop: '8px' }}>
              <Tag 
                color={currentLevel.color} 
                style={{ 
                  fontSize: isMobile ? '14px' : '16px',
                  padding: isMobile ? '4px 8px' : '6px 12px'
                }}
              >
                {currentLevel.label} ({overallScore.toFixed(1)}/5)
              </Tag>
              <Text style={{ fontSize: isMobile ? '14px' : '16px' }}>
                {currentLevel.description}
              </Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
        
        <Progress 
          percent={(overallScore / 5) * 100} 
          strokeColor={currentLevel.color}
          format={() => (
            <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
              {overallScore.toFixed(1)} / 5
            </Text>
          )}
          strokeWidth={isMobile ? 10 : 8}
          style={{ marginBottom: '32px' }}
        />
        
        <Title 
          level={isMobile ? 5 : 4} 
          style={{ 
            marginBottom: isMobile ? '12px' : '16px',
            fontSize: isMobile ? '16px' : '20px'
          }}
        >
          Detailed Breakdown
        </Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {Object.entries(results).map(([key, section]) => {
            const sectionLevel = maturityLevels.reduce((prev, curr) => 
              Math.abs(curr.value - section.score) < Math.abs(prev.value - section.score) ? curr : prev
            );
            
            return (
              <Col 
                key={key}
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
              >
                <Card 
                  title={
                    <Text 
                      strong 
                      style={{ 
                        fontSize: isMobile ? '14px' : '16px',
                        whiteSpace: 'normal'
                      }}
                    >
                      {section.title}
                    </Text>
                  } 
                  bordered={false}
                  headStyle={{ borderBottom: 0, padding: isMobile ? '12px' : '16px' }}
                  bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
                  style={{ height: '100%' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={(section.score / section.max) * 100}
                      width={isMobile ? 80 : 100}
                      strokeColor={sectionLevel.color}
                      format={() => (
                        <Text strong style={{ fontSize: isMobile ? '16px' : '18px' }}>
                          {section.score.toFixed(1)}
                        </Text>
                      )}
                      style={{ marginBottom: '12px' }}
                    />
                    <Tag 
                      color={sectionLevel.color}
                      style={{ 
                        fontSize: isMobile ? '12px' : '14px',
                        padding: isMobile ? '2px 6px' : '4px 8px'
                      }}
                    >
                      {sectionLevel.label}
                    </Tag>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
        
        <Divider style={{ borderWidth: '1px' }} />
        
        <Title 
          level={isMobile ? 5 : 4} 
          style={{ 
            marginBottom: isMobile ? '12px' : '16px',
            fontSize: isMobile ? '16px' : '20px'
          }}
        >
          Improvement Recommendations
        </Title>
        
        <Collapse 
          accordion
          bordered={false}
          style={{ background: 'transparent' }}
        >
          {assessmentSections.map(section => {
            const score = results[section.key]?.score || 0;
            const sectionLevel = maturityLevels.reduce((prev, curr) => 
              Math.abs(curr.value - score) < Math.abs(prev.value - score) ? curr : prev
            );
            
            let recommendations = [];
            
            if (score < 2) {
              recommendations = [
                `Establish basic ${section.title.split(' ')[0].toLowerCase()} practices`,
                'Provide Agile training to team members',
                'Set clear expectations for Agile adoption'
              ];
            } else if (score < 3.5) {
              recommendations = [
                `Standardize ${section.title.split(' ')[0].toLowerCase()} processes`,
                'Increase consistency in practices',
                'Measure current performance to identify gaps'
              ];
            } else {
              recommendations = [
                `Optimize ${section.title.split(' ')[0].toLowerCase()} processes`,
                'Share best practices with other teams',
                'Experiment with innovative approaches'
              ];
            }
            
            return (
              <Panel 
                key={section.key}
                header={
                  <Space>
                    <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                      {section.title}
                    </Text>
                    <Tag color={sectionLevel.color}>{sectionLevel.label}</Tag>
                    <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>
                      {score.toFixed(1)}/5
                    </Text>
                  </Space>
                }
                style={{
                  marginBottom: '8px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px'
                }}
              >
                <Space direction="vertical" size="middle">
                  <Paragraph style={{ fontSize: isMobile ? '14px' : '16px' }}>
                    {sectionLevel.description}
                  </Paragraph>
                  
                  <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                    Recommended Actions:
                  </Text>
                  <ul style={{ 
                    paddingLeft: '20px',
                    fontSize: isMobile ? '14px' : '16px'
                  }}>
                    {recommendations.map((rec, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                  
                  {score < 3 && (
                    <>
                      <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                        Focus Areas:
                      </Text>
                      <ul style={{ 
                        paddingLeft: '20px',
                        fontSize: isMobile ? '14px' : '16px'
                      }}>
                        {section.questions
                          .filter((_, index) => (answers[`${section.key}_${index}`] || 0) < 2)
                          .map((q, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                              {q.text}
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </Space>
              </Panel>
            );
          })}
        </Collapse>
        
        <Divider style={{ borderWidth: '1px' }} />
        
        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />}
          onClick={() => {
            setCurrentStep(0);
            setShowResults(false);
            setAnswers({});
          }}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
          style={{ 
            marginTop: '16px',
            height: isMobile ? '48px' : '40px',
            fontSize: isMobile ? '16px' : '14px'
          }}
        >
          Start New Assessment
        </Button>
      </div>
    );
  };

  return (
    <div style={{ 
      padding: isMobile ? '8px' : '16px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <Card 
        title={
          <Text strong style={{ fontSize: isMobile ? '18px' : '24px' }}>
            Agile Maturity Assessment
          </Text>
        } 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        headStyle={{ 
          borderBottom: 0,
          padding: isMobile ? '16px' : '24px'
        }}
        bodyStyle={{ 
          padding: 0 
        }}
      >
        {!showResults ? (
          <>
            <div style={{ 
              overflowX: 'auto',
              padding: isMobile ? '0 8px' : '0 16px',
              marginBottom: '16px'
            }}>
              <Steps 
                current={currentStep} 
                style={{ 
                  minWidth: isMobile ? '500px' : '100%',
                  padding: isMobile ? '8px 0' : '16px 0'
                }}
                responsive={false}
                size={isMobile ? 'small' : 'default'}
              >
                {assessmentSections.map((section, index) => (
                  <Step 
                    key={section.key} 
                    title={
                      isMobile ? (
                        <Tooltip title={section.title}>
                          <span>{section.shortTitle || `Step ${index + 1}`}</span>
                        </Tooltip>
                      ) : (
                        section.shortTitle || section.title.split(' ')[0]
                      )
                    }
                  />
                ))}
              </Steps>
            </div>
            
            {renderQuestionStep(assessmentSections[currentStep])}
            
            {currentStep === assessmentSections.length - 1 && (
              <div style={{ 
                textAlign: 'center', 
                margin: isMobile ? '16px 8px' : '24px',
                padding: isMobile ? '8px' : '16px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <Button 
                  type="primary" 
                  size={isMobile ? 'large' : 'middle'}
                  onClick={() => setShowResults(true)}
                  block={isMobile}
                  icon={<CheckCircleOutlined />}
                  style={{
                    height: isMobile ? '48px' : '40px',
                    fontSize: isMobile ? '16px' : '14px'
                  }}
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
    </div>
  );
};

export default AgileMaturityAssessment;