import React from 'react';
import { Card, Statistic, Row, Col, Tooltip, Progress, Tag, Grid } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DatabaseOutlined,
  BugOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { useBreakpoint } = Grid;

const SprintMetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  description, 
  target, 
  status,
  tooltip 
}) => {
  const screens = useBreakpoint();
  const trendColor = trend >= 0 ? '#3f8600' : '#cf1322';
  const TrendIcon = trend >= 0 ? ArrowUpOutlined : ArrowDownOutlined;
  const progressPercent = Math.min(100, Math.max(0, value)); // Ensure between 0-100

  // Responsive settings
  const titleSize = screens.xs ? '12px' : '14px';
  const valueSize = screens.xs ? '18px' : '20px';
  const iconSize = screens.xs ? '20px' : '24px';

  return (
    <Card
      style={{ 
        borderRadius: '8px',
        height: '100%',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ 
        padding: screens.xs ? '12px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div style={{ 
          color: 'rgba(0, 0, 0, 0.45)',
          fontSize: titleSize,
          display: 'flex',
          alignItems: 'center'
        }}>
          {title}
          {tooltip && (
            <Tooltip title={tooltip}>
              <InfoCircleOutlined style={{ 
                marginLeft: '6px', 
                fontSize: '12px',
                color: 'rgba(0, 0, 0, 0.3)'
              }} />
            </Tooltip>
          )}
        </div>
        <div style={{ 
          fontSize: iconSize,
          color: '#1890ff',
          backgroundColor: '#e6f7ff',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <Statistic
          value={value}
          suffix="%"
          valueStyle={{
            fontSize: valueSize,
            fontWeight: 'bold',
            marginBottom: '4px'
          }}
        />
        
        {target && (
          <div style={{ 
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.45)',
            marginBottom: '8px'
          }}>
            Target: {target}%
          </div>
        )}
        
        <Progress 
          percent={progressPercent}
          strokeColor={getProgressColor(progressPercent)}
          showInfo={false}
          style={{ marginBottom: '12px' }}
        />
      </div>

      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontSize: '12px',
          color: 'rgba(0, 0, 0, 0.45)'
        }}>
          <span style={{ 
            color: trendColor,
            marginRight: '4px',
            display: 'inline-flex',
            alignItems: 'center'
          }}>
            <TrendIcon style={{ fontSize: '10px', marginRight: '2px' }} />
            {Math.abs(trend)}%
          </span>
          {description}
        </div>
        
        {status && (
          <Tag 
            color={getStatusColor(status)}
            style={{ 
              fontSize: '11px',
              marginLeft: '8px'
            }}
          >
            {status}
          </Tag>
        )}
      </div>
    </Card>
  );
};

// Helper functions
const getProgressColor = (percent) => {
  if (percent >= 80) return '#52c41a';
  if (percent >= 60) return '#faad14';
  return '#f5222d';
};

const getStatusColor = (status) => {
  switch(status.toLowerCase()) {
    case 'excellent': return 'green';
    case 'good': return 'blue';
    case 'fair': return 'orange';
    case 'poor': return 'red';
    case 'improving': return 'cyan';
    case 'declining': return 'volcano';
    default: return 'default';
  }
};

const SprintMetricsDashboard = ({ sprintData }) => {
  const screens = useBreakpoint();

  const metrics = [
    {
      title: 'Sprint Completion',
      value: sprintData?.completionRate || 75,
      icon: <CheckCircleOutlined />,
      trend: sprintData?.completionTrend || 5.2,
      description: 'vs last sprint',
      target: 85,
      status: sprintData?.completionStatus || 'Fair',
      tooltip: 'Percentage of planned sprint tasks completed by the end of the sprint'
    },
    {
      title: 'Cycle Efficiency',
      value: sprintData?.cycleEfficiency || 62,
      icon: <ClockCircleOutlined />,
      trend: sprintData?.efficiencyTrend || -2.8,
      description: 'vs last sprint',
      target: 70,
      status: sprintData?.efficiencyStatus || 'Fair',
      tooltip: 'Percentage of tasks completed within the ideal timeframe (<3 days)'
    },
    {
      title: 'On-Time Delivery',
      value: sprintData?.onTimeDelivery || 68,
      icon: <CalendarOutlined />,
      trend: sprintData?.deliveryTrend || 3.5,
      description: 'vs last sprint',
      target: 80,
      status: sprintData?.deliveryStatus || 'Fair',
      tooltip: 'Percentage of tasks completed on or before their due date'
    },
    {
      title: 'Backlog Completion',
      value: sprintData?.backlogCompletion || 45,
      icon: <DatabaseOutlined />,
      trend: sprintData?.backlogTrend || 8.1,
      description: 'vs last sprint',
      target: 60,
      status: sprintData?.backlogStatus || 'Improving',
      tooltip: 'Percentage of backlog items cleared or pulled into sprints over time'
    },
    {
      title: 'Bug Resolution',
      value: sprintData?.bugResolution || 82,
      icon: <BugOutlined />,
      trend: sprintData?.bugTrend || 4.3,
      description: 'vs last sprint',
      target: 90,
      status: sprintData?.bugStatus || 'Good',
      tooltip: 'Percentage of reported bugs resolved within the sprint cycle'
    }
  ];

  return (
    <div style={{ 
      padding: screens.xs ? '12px' : '16px',
      backgroundColor: '#fafafa'
    }}>
      <h3 style={{ 
        marginBottom: '16px',
        fontSize: screens.xs ? '16px' : '18px'
      }}>
        Sprint Performance Metrics
      </h3>
      
      <Row gutter={[16, 16]}>
        {metrics.map((metric, index) => (
          <Col 
            key={index}
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={8}
            xxl={6}
          >
            <SprintMetricCard {...metric} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Example usage with sample data
const ScoreCards = () => {
  const sampleSprintData = {
    completionRate: 78,
    completionTrend: 7.2,
    completionStatus: 'Good',
    cycleEfficiency: 65,
    efficiencyTrend: 1.8,
    efficiencyStatus: 'Good',
    onTimeDelivery: 72,
    deliveryTrend: 5.5,
    deliveryStatus: 'Good',
    backlogCompletion: 52,
    backlogTrend: 12.1,
    backlogStatus: 'Improving',
    bugResolution: 85,
    bugTrend: 3.3,
    bugStatus: 'Good'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <SprintMetricsDashboard sprintData={sampleSprintData} />
    </div>
  );
};

export default ScoreCards;