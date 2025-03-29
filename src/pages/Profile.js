import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Avatar, 
  Row, 
  Col, 
  Divider, 
  Tabs, 
  Tag, 
  Progress, 
  List, 
  Button, 
  Form, 
  Input, 
  Select,
  message,
  Switch
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  ProjectOutlined,
  BarChartOutlined,
  TrophyOutlined,
  SettingOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const Profile = () => {
  const [currentUser] = useState({
    displayName: 'Timothy Agba',
    email: 'timothy@example.com',
    photoURL: null
  });

  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeProjects, setActiveProjects] = useState([]);
  const [agileMetrics, setAgileMetrics] = useState({});
  const [loading, setLoading] = useState(false);

  // Password validation rules
  const passwordRules = [
    { required: true, message: 'Please input your password!' },
    { min: 8, message: 'Password must be at least 8 characters!' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Must contain uppercase, lowercase, number, and special character (@$!%*?&)'
    }
  ];

  const confirmPasswordRules = [
    { required: true, message: 'Please confirm your password!' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('newPassword') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords do not match!'));
      },
    }),
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setActiveProjects([
        { id: 1, name: 'E-commerce Platform', role: 'Scrum Master', progress: 65 },
        { id: 2, name: 'Mobile App Redesign', role: 'Developer', progress: 42 },
        { id: 3, name: 'API Microservices', role: 'Product Owner', progress: 88 }
      ]);
      
      setAgileMetrics({
        velocity: 32,
        satisfaction: 4.5,
        defectRate: 12,
        maturityLevel: 'Intermediate',
        recommendations: [
          'Increase sprint retrospective participation',
          'Improve backlog refinement process',
          'Implement pair programming for complex tasks'
        ]
      });
      setLoading(false);
    }, 1000);

    form.setFieldsValue({
      name: currentUser.displayName || '',
      email: currentUser.email || '',
      role: 'Developer',
      team: 'Frontend Team',
      bio: 'Agile enthusiast focused on delivering quality software'
    });
  }, [currentUser, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Updated values:', values);
      message.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      console.log('Password change values:', values);
      message.success('Password changed successfully');
      setPasswordEditMode(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error('Password change validation failed:', error);
    }
  };

  const renderEditButton = () => (
    <Button 
      type={editMode ? 'primary' : 'default'} 
      icon={editMode ? <SaveOutlined /> : <EditOutlined />}
      onClick={editMode ? handleSave : () => setEditMode(true)}
      size="small"
    >
      {editMode ? 'Save' : 'Edit'}
    </Button>
  );

  return (
    <div className="user-profile" style={{ padding: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card 
            title="Profile Information" 
            extra={renderEditButton()}
            loading={loading}
            style={{ marginBottom: 16 }}
          >
            {editMode ? (
              <Form form={form} layout="vertical">
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} size="small" />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input prefix={<MailOutlined />} size="small" disabled />
                </Form.Item>
                <Form.Item name="role" label="Role">
                  <Select size="small">
                    <Option value="Developer">Developer</Option>
                    <Option value="Scrum Master">Scrum Master</Option>
                    <Option value="Product Owner">Product Owner</Option>
                    <Option value="Agile Coach">Agile Coach</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="team" label="Team">
                  <Input prefix={<TeamOutlined />} size="small" />
                </Form.Item>
                <Form.Item name="bio" label="Bio">
                  <Input.TextArea rows={3} size="small" />
                </Form.Item>
              </Form>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar size={96} icon={<UserOutlined />} src={currentUser?.photoURL} />
                  <h2 style={{ marginTop: 8, fontSize: '1.2rem' }}>{form.getFieldValue('name')}</h2>
                  <Tag color="blue" style={{ marginTop: 4 }}>
                    {form.getFieldValue('role')}
                  </Tag>
                </div>
                <Divider orientation="left" style={{ fontSize: '0.8rem' }}>Details</Divider>
                <p style={{ marginBottom: 8 }}><MailOutlined /> Email: {form.getFieldValue('email')}</p>
                <p><TeamOutlined /> Team: {form.getFieldValue('team')}</p>
                <Divider orientation="left" style={{ fontSize: '0.8rem' }}>Bio</Divider>
                <p style={{ fontSize: '0.9rem' }}>{form.getFieldValue('bio')}</p>
              </>
            )}
          </Card>

          <Card title="Agile Maturity" loading={loading}>
            <div style={{ textAlign: 'center' }}>
              <Progress 
                type="dashboard" 
                percent={agileMetrics.maturityLevel === 'Beginner' ? 30 : 
                         agileMetrics.maturityLevel === 'Intermediate' ? 60 : 90} 
                width={120}
                style={{ margin: '0 auto' }}
              />
              <h3 style={{ marginTop: 8, fontSize: '1rem' }}>{agileMetrics.maturityLevel} Level</h3>
              <Divider orientation="left" style={{ fontSize: '0.8rem' }}>Recommendations</Divider>
              <List
                size="small"
                dataSource={agileMetrics.recommendations || []}
                renderItem={item => <List.Item style={{ fontSize: '0.8rem' }}>- {item}</List.Item>}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card loading={loading} bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="1" size="small">
              <TabPane
                tab={
                  <span>
                    <ProjectOutlined />
                    <span className="tab-label">My Projects</span>
                  </span>
                }
                key="1"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={activeProjects}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button type="link" size="small">View</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar size="small" icon={<ProjectOutlined />} />}
                        title={<span>{item.name}</span>}
                        description={`Role: ${item.role}`}
                        style={{ fontSize: '0.9rem' }}
                      />
                      <div style={{ minWidth: 120 }}>
                        <Progress 
                          percent={item.progress} 
                          status="active" 
                          size="small"
                          style={{ width: '100%', maxWidth: 200 }}
                        />
                        <div style={{ textAlign: 'center', marginTop: 4 }}>
                          <Tag 
                            color={item.progress > 70 ? 'green' : item.progress > 40 ? 'orange' : 'red'}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {item.progress}% complete
                          </Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <BarChartOutlined />
                    <span className="tab-label">My Metrics</span>
                  </span>
                }
                key="2"
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Sprint Velocity" style={{ height: '100%' }}>
                      <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>
                        {agileMetrics.velocity || '--'}
                        <span style={{ fontSize: '0.8rem' }}> points/sprint</span>
                      </h1>
                      <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <Tag color={agileMetrics.velocity > 30 ? 'green' : 'orange'}>
                          {agileMetrics.velocity > 30 ? 'Above average' : 'Needs improvement'}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Stakeholder Satisfaction" style={{ height: '100%' }}>
                      <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>
                        {agileMetrics.satisfaction || '--'}
                        <span style={{ fontSize: '0.8rem' }}>/5</span>
                      </h1>
                      <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <Tag color={agileMetrics.satisfaction > 4 ? 'green' : 'orange'}>
                          {agileMetrics.satisfaction > 4 ? 'Excellent' : 'Good'}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Defect Rate" style={{ height: '100%' }}>
                      <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>
                        {agileMetrics.defectRate || '--'}
                        <span style={{ fontSize: '0.8rem' }}> defects/sprint</span>
                      </h1>
                      <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <Tag color={agileMetrics.defectRate < 15 ? 'green' : 'red'}>
                          {agileMetrics.defectRate < 15 ? 'Acceptable' : 'Needs attention'}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Recent Achievements" style={{ height: '100%' }}>
                      <List
                        size="small"
                        dataSource={[
                          'Completed Agile Fundamentals certification',
                          'Led sprint planning for 5 consecutive sprints',
                          'Reduced defect rate by 20% in Q3'
                        ]}
                        renderItem={item => (
                          <List.Item style={{ fontSize: '0.8rem' }}>
                            <TrophyOutlined style={{ color: 'gold', marginRight: 8 }} />
                            {item}
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <SettingOutlined />
                    <span className="tab-label">Settings</span>
                  </span>
                }
                key="3"
              >
                <Card title="Change Password" style={{ marginBottom: 16 }}>
                  {passwordEditMode ? (
                    <Form form={passwordForm} layout="vertical">
                      <Form.Item 
                        name="currentPassword" 
                        label="Current Password" 
                        rules={passwordRules}
                      >
                        <Input.Password 
                          prefix={<LockOutlined />} 
                          size="small" 
                          placeholder="Enter current password"
                        />
                      </Form.Item>
                      <Form.Item 
                        name="newPassword" 
                        label="New Password" 
                        rules={passwordRules}
                        hasFeedback
                      >
                        <Input.Password 
                          prefix={<LockOutlined />} 
                          size="small" 
                          placeholder="Enter new password"
                        />
                      </Form.Item>
                      <Form.Item 
                        name="confirmPassword" 
                        label="Confirm Password" 
                        dependencies={['newPassword']}
                        rules={confirmPasswordRules}
                        hasFeedback
                      >
                        <Input.Password 
                          prefix={<LockOutlined />} 
                          size="small" 
                          placeholder="Confirm new password"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button 
                          type="primary" 
                          onClick={handlePasswordChange}
                          style={{ marginRight: 8 }}
                        >
                          Save Password
                        </Button>
                        <Button onClick={() => {
                          setPasswordEditMode(false);
                          passwordForm.resetFields();
                        }}>
                          Cancel
                        </Button>
                      </Form.Item>
                    </Form>
                  ) : (
                    <Button 
                      type="primary" 
                      onClick={() => setPasswordEditMode(true)}
                      icon={<LockOutlined />}
                    >
                      Change Password
                    </Button>
                  )}
                </Card>
                <Card title="Notification Preferences">
                  <List size="small">
                    <List.Item actions={[<Switch size="small" defaultChecked />]}>
                      Email Notifications
                    </List.Item>
                    <List.Item actions={[<Switch size="small" defaultChecked />]}>
                      Project Updates
                    </List.Item>
                  </List>
                </Card>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        @media (max-width: 768px) {
          .tab-label {
            display: none;
          }
          .ant-progress-circle {
            width: 100px !important;
            height: 100px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;