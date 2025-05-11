import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  notification,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreateTask, fetchProjectMembers } from '../redux/action';

const { Option } = Select;

const BackLog = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const { id: projectId } = useParams();
  const token = localStorage.getItem('token');

  const projects = useSelector((state) => state.projects|| []);

  useEffect(() => {
    if (projectId && token) {
      dispatch(fetchProjectMembers(projectId, token));
    }
  }, [dispatch, projectId, token]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleSubmit = async (values) => {
    try {
      const taskData = {
        ...values,
        projectId,
      };

      const response = await dispatch(CreateTask(taskData));

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        api.success({
          message: response.message || 'Task added to project successfully.',
        });

        const newTask = {
          ...values,
          createdAt: dayjs(),
          due_date: values.due_date,
          key: response?.task?._id || `task-${Date.now()}`,
          id: response?.task?._id || `task-${Date.now()}`,
        };

        setTasks((prev) => [...prev, newTask]);
        form.resetFields();
        setIsModalVisible(false);
      } else {
        api.error({
          message: response?.message || 'Error creating task',
        });
      }
    } catch (error) {
      api.error({
        message: 'Network Error',
        description: error.message || 'Could not connect to server',
      });
    }
  };

  const handleOk = () => {
    form.validateFields().then(handleSubmit);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getColumns = () => [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
      render: (id) => {
        const user = projects.find((u) => u._id === id);
        return user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '-';
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date) => {
        const parsedDate = dayjs(date);
        return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : '-';
      },
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '20px',
      }}
    >
      {contextHolder}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create Task
        </Button>
      </div>

      <Table
        rowKey={(record) => record.id || record.key}
        columns={getColumns()}
        dataSource={filteredTasks}
      />

      <Modal
        title="Create New Task"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Assign To"
            name="assigned_to"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select placeholder="Select a user">
              {projects.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.first_name} {user.last_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Due Date"
            name="due_date"
            rules={[{ required: true, message: 'Please select a due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BackLog;
