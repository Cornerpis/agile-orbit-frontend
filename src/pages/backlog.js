import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Input, 
  Button, 
  Space, 
  Dropdown, 
  Menu, 
  Modal, 
  Form, 
  Select, 
  DatePicker, 
  Avatar,
  Card,
  Popconfirm,
  Grid,
  Drawer,
  notification,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  FilterOutlined, 
  MoreOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch } from "react-redux";
import { CreateTask} from "../redux/action";

const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const statusColors = {
  'backlog': 'default',
  'todo': 'blue',
  'in-progress': 'orange',
  'review': 'purple',
  'done': 'green',
  'blocked': 'red'
};

const priorityColors = {
  'low': 'green',
  'medium': 'orange',
  'high': 'red'
};

const initialTasks = [
  {
    key: '1',
    title: 'Implement user authentication',
    description: 'Set up JWT authentication for the API',
    status: 'todo',
    priority: 'high',
    assigned_to: 'JD',
    due_date: dayjs().add(3, 'days'),
    createdAt: dayjs().subtract(2, 'days'),
    storyPoints: 5
  },
  {
    key: '2',
    title: 'Design dashboard UI',
    description: 'Create mockups for the admin dashboard',
    status: 'in-progress',
    priority: 'medium',
    assigned_to: 'AS',
    due_date: dayjs().add(5, 'days'),
    createdAt: dayjs().subtract(5, 'days'),
    storyPoints: 3
  }
];

const BackLog = () => {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const [tasks, setTasks] = useState(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    assigned_to: null
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  // Responsive adjustments
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search
    if (searchText) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase()) ||
        task.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.status) {
      result = result.filter(task => task.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority);
    }
    if (filters.assigned_to) {
      result = result.filter(task => task.assigned_to === filters.assigned_to);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredTasks(result);
  }, [tasks, searchText, filters, sortConfig]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const showModal = (task = null) => {
    setEditingTask(task);
    form.resetFields();
    if (task) {
      form.setFieldsValue({
        ...task,
        due_date: task.due_date
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newTask = {
        ...values,
        due_date: values.due_date,
        createdAt: values.createdAt || dayjs(),
        key: editingTask ? editingTask.key : `task-${Date.now()}`,
        id: editingTask ? editingTask.id : `TASK-${Math.floor(100 + Math.random() * 900)}`
      };

      if (editingTask) {
        setTasks(tasks.map(task => task.key === editingTask.key ? newTask : task));
      } else {
        setTasks([...tasks, newTask]);
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.key !== taskId));
  };

  const batchDelete = () => {
    setTasks(tasks.filter(task => !selectedRowKeys.includes(task.key)));
    setSelectedRowKeys([]);
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks(tasks.map(task => 
      task.key === taskId ? { ...task, status } : task
    ));
  };

  const batchUpdateStatus = (status) => {
    setTasks(tasks.map(task => 
      selectedRowKeys.includes(task.key) ? { ...task, status } : task
    ));
    setSelectedRowKeys([]);
  };

  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div className="task-title-container">
            <div className="task-title">{text}</div>
            {!isMobile && <div className="task-description">{record.description}</div>}
            {isMobile && (
              <Space size="small" style={{ marginTop: 4 }}>
                <Tag color={statusColors[record.status]} style={{ margin: 0 }}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Tag>
                {record.priority && (
                  <Tag color={priorityColors[record.priority]} style={{ margin: 0 }}>
                    {record.priority.charAt(0).toUpperCase()}
                  </Tag>
                )}
              </Space>
            )}
          </div>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => (
          <div className="task-title-container">
            <div className="task-title">{text}</div>
            {!isMobile && <div className="task-description">{record.description}</div>}
            {isMobile && (
              <Space size="small" style={{ marginTop: 4 }}>
                <Tag color={statusColors[record.status]} style={{ margin: 0 }}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Tag>
                {record.priority && (
                  <Tag color={priorityColors[record.priority]} style={{ margin: 0 }}>
                    {record.priority.charAt(0).toUpperCase()}
                  </Tag>
                )}
              </Space>
            )}
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        responsive: ['md'],
        render: status => (
          <Tag color={statusColors[status]}>
            {status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
          </Tag>
        ),
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
        responsive: ['md'],
        render: priority => (
          <Tag color={priorityColors[priority]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Tag>
        ),
      },
      {
        title: 'Assigned To',
        dataIndex: 'assigned_to',
        key: 'assigned_to',
        width: 100,
        responsive: ['md'],
        render: assigned_to => assigned_to ? (
          <Avatar size="small">{assigned_to}</Avatar>
        ) : <Tag>Unassigned</Tag>,
      },
      {
        title: 'Due Date',
        dataIndex: 'due_date',
        key: 'due_date',
        width: 120,
        responsive: ['md'],
        render: date => date ? (
          <Tag color={dayjs().isAfter(date) && !dayjs(date).isSame(dayjs(), 'day') ? 'red' : 'default'}>
            {date.format('MMM D')}
          </Tag>
        ) : '-',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        render: (_, record) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item icon={<EditOutlined />} onClick={() => showModal(record)}>
                  Edit
                </Menu.Item>
                <Menu.Item icon={<CheckOutlined />} onClick={() => updateTaskStatus(record.key, 'done')}>
                  Mark Done
                </Menu.Item>
                <Menu.Divider />
                <Popconfirm
                  title="Delete this task?"
                  onConfirm={() => deleteTask(record.key)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Menu.Item icon={<DeleteOutlined />} danger>
                    Delete
                  </Menu.Item>
                </Popconfirm>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        ),
      }
    ];

    const handleSubmit = async (values) => {
        try {
          const response = await dispatch(CreateTask(values));
      
          const successMessage = response?.message?.toLowerCase?.().includes("success");
    
    if (
      response?.statusCode === 201 ||
      response?.success === true ||
      response?.success === "true" || // handle string values
      successMessage // check if message suggests success
    ) {
      api.success({
        message: response?.message || "Task created successfully!",
        description: response.message,
        duration: 3,
      });
      form.resetFields();
      // onCancel();
    } else if (response?.statusCode === 400) {
      api.warning({
        message: "Task Creation Failed",
        description: response?.message || "Please check your input and try again.",
        duration: 4,
      });
    } else if (response?.statusCode === 409) {
      api.error({
        message: "Duplicate Entry",
        description: response?.message || "Task already exists.",
        duration: 4,
      });
    } else {
      api.error({
        message: "Unexpected Error",
        description: response?.message || "Something went wrong. Please try again later.",
        duration: 4,
      });
    }
    
        } catch (error) {
          api.error({
            message: "Network Error",
            description: error.message || "Unable to connect to the server.",
            duration: 4,
          });
        }
      };
    

    // Add sorting functionality for non-mobile views
    if (!isMobile) {
      return baseColumns.map(col => {
        if (col.key === 'id' || col.key === 'title' || col.key === 'due_date') {
          return {
            ...col,
            sorter: true,
            sortOrder: sortConfig.key === col.key ? sortConfig.direction : null,
            onHeaderCell: () => ({
              onClick: () => handleSort(col.key)
            })
          };
        }
        return col;
      });
    }

    return baseColumns;
  };

  const TaskDetailDrawer = ({ task, visible, onClose }) => {
    if (!task) return null;
    
    return (
      <Drawer
        title="Task Details"
        placement="right"
        width={screens.md ? '50%' : '85%'}
        onClose={onClose}
        visible={visible}
      >
        <div className="task-detail">
          <h3>{task.title}</h3>
          <p className="task-description">{task.description}</p>
          
          <Divider orientation="left">Details</Divider>
          
          
          
          
          
          {task.assigned_to && (
            <div className="detail-row">
              <span className="detail-label">assigned_to:</span>
              <Avatar size="small">{task.assigned_to}</Avatar>
            </div>
          )}
          
          {task.due_date && (
            <div className="detail-row">
              <span className="detail-label">Due Date:</span>
              <Tag color={dayjs().isAfter(task.due_date) ? 'red' : 'default'}>
                {task.due_date.format('MMMM D, YYYY')}
              </Tag>
            </div>
          )}
          
          
          
          <Divider orientation="left">Actions</Divider>
          
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => {
                onClose();
                showModal(task);
              }}
            >
              Edit
            </Button>
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              onClick={() => {
                updateTaskStatus(task.key, 'done');
                onClose();
              }}
            >
              Mark Done
            </Button>
            <Popconfirm
              title="Delete this task?"
              onConfirm={() => {
                deleteTask(task.key);
                onClose();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </Drawer>
    );
  };

  const statusMenu = (
    <Menu>
      {Object.keys(statusColors).map(status => (
        <Menu.Item key={status} onClick={() => batchUpdateStatus(status)}>
          <Tag color={statusColors[status]}>
            {status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
          </Tag>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="project-backlog">
      <Card
        title="Project Backlog"
        extra={
          <Space>
            {isMobile && (
              <Button 
                icon={<FilterOutlined />} 
                onClick={() => setIsDrawerVisible(true)}
              />
            )}
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
              size={isMobile ? 'small' : 'middle'}
            >
              {!isMobile && 'Add Task'}
            </Button>
          </Space>
        }
      >
        

        {selectedRowKeys.length > 0 && (
          <div className="batch-actions" style={{ marginBottom: 16 }}>
            <Space>
              <span>{selectedRowKeys.length} selected</span>
              <Dropdown overlay={statusMenu}>
                <Button size={isMobile ? 'small' : 'middle'}>Update Status</Button>
              </Dropdown>
              <Popconfirm
                title="Delete selected tasks?"
                onConfirm={batchDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} size={isMobile ? 'small' : 'middle'}>
                  {!isMobile && 'Delete'}
                </Button>
              </Popconfirm>
            </Space>
          </div>
        )}
        
        <Table
          columns={getColumns()}
          dataSource={filteredTasks}
          rowSelection={!isMobile ? {
            selectedRowKeys,
            onChange: keys => setSelectedRowKeys(keys),
          } : null}
          pagination={{
            pageSize: 10,
            showSizeChanger: !isMobile,
            simple: isMobile
          }}
          scroll={{ x: true }}
          rowClassName={record => {
            if (record.due_date && dayjs().isAfter(record.due_date)) {
              return 'overdue-task';
            }
            return '';
          }}
          onRow={isMobile ? (record) => ({
            onClick: () => {
              setEditingTask(record);
              setIsDrawerVisible(true);
            }
          }) : null}
          size={isMobile ? 'small' : 'middle'}
        />
      </Card>

      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={isMobile ? '90%' : 700}
        bodyStyle={{ padding: isMobile ? '16px 8px' : '24px' }}
      >
        <Form form={form} layout="vertical">
          {contextHolder}
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Task title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Enter a Description ' }]}
          >
            <TextArea rows={4} placeholder="Task description" />
          </Form.Item>
          
          <Form.Item
            name="assigned_to"
            label="Assigned To"
            rules={[{ required: true, message: 'Please assign a user' }]}
          >
            <Select allowClear placeholder="Unassigned">
              <Option value="JD">John Doe (JD)</Option>
              <Option value="AS">Alice Smith (AS)</Option>
              <Option value="TM">Tom Miller (TM)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="due_date"
            label="Due Date"
            rules={[{ required: true, message: 'Select due date ' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <TaskDetailDrawer 
        task={editingTask} 
        visible={isDrawerVisible} 
        onClose={() => setIsDrawerVisible(false)} 
      />
    </div>
  );
};

export default BackLog;