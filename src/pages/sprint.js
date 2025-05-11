import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../redux/action';

const { Title, Text } = Typography;
const { Option } = Select;

const SprintCreation = () => {
  const [form] = Form.useForm();
  const [activeSprints, setActiveSprints] = useState([]);
  const [upcomingSprints, setUpcomingSprints] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSprintId, setLoadingSprintId] = useState(null);

  const dispatch = useDispatch();
  const token = useSelector(state => state.token);

  useEffect(() => {
    if (!token) {
      message.warning('You need to be logged in to create a sprint.');
    }
  }, [token]);

  const onFinish = async (values) => {
    if (!token) {
      message.error('Please log in to create a sprint.');
      return;
    }

    const newSprint = {
      name: values.name,
      end_time: values.end_time.format('YYYY-MM-DD'),
      budget: values.budget,
      description: values.description,
      priority_level: values.priority_level,
      status: 'planned'
    };

    setConfirmLoading(true);

    try {
      const response = await dispatch(createProject(token, newSprint));
      console.log('API Response:', response);
      if (response?.success) {
        const createdSprint = {
          ...newSprint,
          id: Date.now() // Use a unique ID
        };
        setUpcomingSprints(prev => [...prev, createdSprint]);
        message.success('Sprint created successfully!');
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(response?.message || 'Failed to create sprint.');
      }
    } catch (error) {
      console.error('Error creating')

    }
  };

  const startSprint = (id) => {
    setConfirmLoading(true);
    setTimeout(() => {
      const sprint = upcomingSprints.find(s => s.id === id);
      if (sprint) {
        setActiveSprints(prev => [...prev, { ...sprint, status: 'active' }]);
        setUpcomingSprints(prev => prev.filter(s => s.id !== id));
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
        setActiveSprints(prev => prev.filter(s => s.id !== id));
        message.success('Sprint ended successfully!');
      }
    });
  };

  const disabledDate = current => current && current < dayjs().startOf('day');

  return (
    <div style={{ padding: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Sprint Board"
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
            {/* Active Sprints */}
            <Title level={4}>Active Sprints</Title>
            {activeSprints.length ? (
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
                    <Col sm={8}><Text strong>Name:</Text><br />{sprint.name}</Col>
                    <Col sm={8}><Text strong>End Date:</Text><br />{dayjs(sprint.end_time).format('MMM D, YYYY')}</Col>
                    <Col sm={8}><Text strong>Budget:</Text><br />{sprint.budget}</Col>
                    <Col sm={8}><Text strong>Description:</Text><br />{sprint.description}</Col>
                    <Col sm={8}><Text strong>Priority:</Text><br />{sprint.priority_level}</Col>
                  </Row>
                </Card>
              ))
            ) : (
              <Text type="secondary">No active sprints</Text>
            )}

            <Divider />

            {/* Upcoming Sprints */}
            <Title level={4}>Upcoming Sprints</Title>
            {upcomingSprints.length ? (
              upcomingSprints.map(sprint => (
                <Card
                  key={sprint.id}
                  style={{ marginBottom: '16px' }}
                  actions={[
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      loading={confirmLoading}
                      onClick={() => startSprint(sprint.id)}
                    >
                      Start Sprint
                    </Button>
                  ]}
                >
                  <Row gutter={16}>
                    <Col sm={8}><Text strong>Name:</Text><br />{sprint.name}</Col>
                    <Col sm={8}><Text strong>End Date:</Text><br />{dayjs(sprint.end_time).format('MMM D, YYYY')}</Col>
                    <Col sm={8}><Text strong>Budget:</Text><br />{sprint.budget}</Col>
                    <Col sm={8}><Text strong>Description:</Text><br />{sprint.description}</Col>
                    <Col sm={8}><Text strong>Priority:</Text><br />{sprint.priority_level}</Col>
                  </Row>
                </Card>
              ))
            ) : (
              <Text type="secondary">No upcoming sprints</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Sprint Calendar">
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={disabledDate}
              suffixIcon={<CalendarOutlined />}
            />
            <Divider />
            <Title level={5}>Tips for Planning</Title>
            <ul>
              <li>Set achievable goals</li>
              <li>Stick to team capacity</li>
              <li>Define clear priorities</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Modal Form */}
      <Modal
  title="Create Sprint"
  open={isModalVisible}
  onCancel={() => {
    form.resetFields();
    setIsModalVisible(false);
  }}
  footer={null}
  width={800}
>
  <Form form={form} layout="vertical" onFinish={onFinish}>
  onFinish={onFinish}
  onFinishFailed={({ errorFields }) => {
    console.error('Validation Failed:', errorFields);
    message.error('Please fill all required fields.');
  }}
    <Row gutter={16}>
      <Col sm={12}>
        <Form.Item
          name="name"
          label="Sprint Name"
          rules={[{ required: true, message: 'Please enter sprint name' }]}
        >
          <Input placeholder="Sprint name" />
        </Form.Item>
      </Col>
      <Col sm={12}>
        <Form.Item
          name="budget"
          label="Budget"
          rules={[{ required: true, message: 'Please enter budget' }]}
        >
          <Input type="number" placeholder="e.g., 100000" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col sm={12}>
        <Form.Item
          name="end_time"
          label="End Date"
          rules={[
            { 
              required: true, 
              message: 'Please select end date' 
            },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject('Please select an end date');
                }
                // Check if the selected date is in the past
                if (value.isBefore(dayjs(), 'day')) {
                  return Promise.reject('End date cannot be in the past');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={disabledDate}
            placeholder="Select end date"
          />
        </Form.Item>
      </Col>
      <Col sm={12}>
        <Form.Item
          name="priority_level"
          label="Priority Level"
          rules={[{ required: true, message: 'Please select priority level' }]}
        >
          <Select placeholder="Select priority">
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: true, message: 'Please enter description' }]}
    >
      <Input.TextArea rows={4} placeholder="Sprint description" />
    </Form.Item>

    <Form.Item style={{ textAlign: 'center' }}>
      <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
        Create Sprint
      </Button>
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
};

export default SprintCreation;
