import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Button, 
  Space, 
  Row, 
  Col, 
  Typography, 
  Divider,
  message,
  Select,
  Modal
} from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  CloseOutlined,
  CheckOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SprintCreation = () => {
  const [form] = Form.useForm();
  const [activeSprints, setActiveSprints] = useState([
    {
      id: 1,
      name: 'Sprint 1',
      startDate: '2023-06-01',
      endDate: '2023-06-14',
      goal: 'Complete user authentication',
      status: 'active'
    }
  ]);
  const [upcomingSprints, setUpcomingSprints] = useState([
    {
      id: 2,
      name: 'Sprint 2',
      startDate: '2023-06-15',
      endDate: '2023-06-28',
      goal: 'Implement dashboard UI',
      status: 'planned'
    }
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = (values) => {
    console.log('Received values:', values);
    const newSprint = {
      id: upcomingSprints.length + activeSprints.length + 1,
      name: values.name,
      startDate: values.dates[0].format('YYYY-MM-DD'),
      endDate: values.dates[1].format('YYYY-MM-DD'),
      goal: values.goal,
      status: 'planned'
    };
    
    setUpcomingSprints([...upcomingSprints, newSprint]);
    message.success('Sprint created successfully!');
    form.resetFields();
    setIsModalVisible(false);
  };

  const startSprint = (id) => {
    setConfirmLoading(true);
    // Simulate API call
    setTimeout(() => {
      const sprintToStart = upcomingSprints.find(sprint => sprint.id === id);
      const updatedUpcoming = upcomingSprints.filter(sprint => sprint.id !== id);
      
      if (sprintToStart) {
        setActiveSprints([...activeSprints, { ...sprintToStart, status: 'active' }]);
        setUpcomingSprints(updatedUpcoming);
        message.success('Sprint started successfully!');
      }
      setConfirmLoading(false);
    }, 1000);
  };

  const endSprint = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to end this sprint?',
      content: 'This action cannot be undone.',
      okText: 'End Sprint',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Simulate API call
        setTimeout(() => {
          const updatedActive = activeSprints.filter(sprint => sprint.id !== id);
          setActiveSprints(updatedActive);
          message.success('Sprint ended successfully!');
        }, 500);
      }
    });
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf('day');
  };

  return (
    <div style={{ padding: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title="Create New Sprint" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setIsModalVisible(true)}
              >
                New Sprint
              </Button>
            }
          >
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>Active Sprint</Title>
              {activeSprints.length > 0 ? (
                activeSprints.map(sprint => (
                  <Card 
                    key={sprint.id} 
                    style={{ marginBottom: '16px' }}
                    actions={[
                      <Button 
                        danger 
                        icon={<CloseOutlined />} 
                        onClick={() => endSprint(sprint.id)}
                      >
                        End Sprint
                      </Button>
                    ]}
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={8}>
                        <Text strong>Name:</Text>
                        <Text>{sprint.name}</Text>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Text strong>Dates:</Text>
                        <Text>{dayjs(sprint.startDate).format('MMM D')} - {dayjs(sprint.endDate).format('MMM D, YYYY')}</Text>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Text strong>Goal:</Text>
                        <Text>{sprint.goal}</Text>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <Text type="secondary">No active sprints</Text>
              )}
            </div>

            <Divider />

            <div>
              <Title level={4}>Upcoming Sprints</Title>
              {upcomingSprints.length > 0 ? (
                upcomingSprints.map(sprint => (
                  <Card 
                    key={sprint.id} 
                    style={{ marginBottom: '16px' }}
                    actions={[
                      <Button 
                        type="primary" 
                        icon={<CheckOutlined />} 
                        onClick={() => startSprint(sprint.id)}
                        loading={confirmLoading}
                      >
                        Start Sprint
                      </Button>
                    ]}
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={8}>
                        <Text strong>Name:</Text>
                        <Text>{sprint.name}</Text>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Text strong>Dates:</Text>
                        <Text>{dayjs(sprint.startDate).format('MMM D')} - {dayjs(sprint.endDate).format('MMM D, YYYY')}</Text>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Text strong>Goal:</Text>
                        <Text>{sprint.goal}</Text>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <Text type="secondary">No upcoming sprints</Text>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Sprint Calendar">
            <DatePicker.RangePicker 
              style={{ width: '100%' }}
              disabledDate={disabledDate}
            />
            <Divider />
            <Title level={5} style={{ marginTop: '16px' }}>Sprint Duration Guide</Title>
            <Text>
              <ul>
                <li>Typical sprints last 1-4 weeks</li>
                <li>2 weeks is the most common duration</li>
                <li>Consider team velocity when planning</li>
              </ul>
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Create Sprint Modal */}
      <Modal
        title="Create New Sprint"
        visible={isModalVisible}
        onCancel={() => {
          form.resetFields();
          setIsModalVisible(false);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Sprint Name"
                rules={[{ required: true, message: 'Please enter sprint name' }]}
              >
                <Input placeholder="e.g., Sprint 3" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dates"
                label="Sprint Dates"
                rules={[{ required: true, message: 'Please select sprint dates' }]}
              >
                <RangePicker 
                  style={{ width: '100%' }} 
                  disabledDate={disabledDate}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="goal"
            label="Sprint Goal"
            rules={[{ required: true, message: 'Please enter sprint goal' }]}
          >
            <Input.TextArea rows={3} placeholder="What do you want to accomplish in this sprint?" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Sprint
              </Button>
              <Button 
                onClick={() => {
                  form.resetFields();
                  setIsModalVisible(false);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SprintCreation;