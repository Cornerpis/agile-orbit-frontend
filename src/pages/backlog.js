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
import '../assets/styles/KanbanBoard.css';

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
    id: 'TASK-101',
    title: 'Implement user authentication',
    description: 'Set up JWT authentication for the API',
    status: 'todo',
    priority: 'high',
    assignee: 'JD',
    dueDate: dayjs().add(3, 'days'),
    createdAt: dayjs().subtract(2, 'days'),
    storyPoints: 5
  },
  {
    key: '2',
    id: 'TASK-102',
    title: 'Design dashboard UI',
    description: 'Create mockups for the admin dashboard',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'AS',
    dueDate: dayjs().add(5, 'days'),
    createdAt: dayjs().subtract(5, 'days'),
    storyPoints: 3
  }
];

const BackLog = () => {
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
    assignee: null
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
    if (filters.assignee) {
      result = result.filter(task => task.assignee === filters.assignee);
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
        dueDate: task.dueDate
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newTask = {
        ...values,
        dueDate: values.dueDate,
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
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        responsive: ['md'],
      },
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
        title: 'Assignee',
        dataIndex: 'assignee',
        key: 'assignee',
        width: 100,
        responsive: ['md'],
        render: assignee => assignee ? (
          <Avatar size="small">{assignee}</Avatar>
        ) : <Tag>Unassigned</Tag>,
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        width: 120,
        responsive: ['md'],
        render: date => date ? (
          <Tag color={dayjs().isAfter(date) && !dayjs(date).isSame(dayjs(), 'day') ? 'red' : 'default'}>
            {date.format('MMM D')}
          </Tag>
        ) : '-',
      },
      {
        title: 'Points',
        dataIndex: 'storyPoints',
        key: 'storyPoints',
        width: 80,
        responsive: ['md'],
        render: points => points ? (
          <Tag>{points}</Tag>
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

    // Add sorting functionality for non-mobile views
    if (!isMobile) {
      return baseColumns.map(col => {
        if (col.key === 'id' || col.key === 'title' || col.key === 'dueDate' || col.key === 'storyPoints') {
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
          
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <Tag color={statusColors[task.status]}>
              {task.status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
            </Tag>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Priority:</span>
            <Tag color={priorityColors[task.priority]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Tag>
          </div>
          
          {task.assignee && (
            <div className="detail-row">
              <span className="detail-label">Assignee:</span>
              <Avatar size="small">{task.assignee}</Avatar>
            </div>
          )}
          
          {task.dueDate && (
            <div className="detail-row">
              <span className="detail-label">Due Date:</span>
              <Tag color={dayjs().isAfter(task.dueDate) ? 'red' : 'default'}>
                {task.dueDate.format('MMMM D, YYYY')}
              </Tag>
            </div>
          )}
          
          {task.storyPoints && (
            <div className="detail-row">
              <span className="detail-label">Story Points:</span>
              <Tag>{task.storyPoints}</Tag>
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
        {!isMobile && (
          <div className="backlog-controls">
            <Space size="middle" style={{ marginBottom: 16 }}>
              <Input
                placeholder="Search tasks..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={e => handleSearch(e.target.value)}
                style={{ width: isTablet ? 200 : 250 }}
              />
              
              <Select
                placeholder="Status"
                allowClear
                style={{ width: isTablet ? 120 : 150 }}
                onChange={value => handleFilterChange('status', value)}
                value={filters.status}
              >
                {Object.keys(statusColors).map(status => (
                  <Option key={status} value={status}>
                    {status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                  </Option>
                ))}
              </Select>
              
              <Select
                placeholder="Priority"
                allowClear
                style={{ width: isTablet ? 120 : 150 }}
                onChange={value => handleFilterChange('priority', value)}
                value={filters.priority}
              >
                {Object.keys(priorityColors).map(priority => (
                  <Option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Option>
                ))}
              </Select>
              
              <Button
                icon={<CloseOutlined />}
                onClick={() => setFilters({
                  status: null,
                  priority: null,
                  assignee: null
                })}
              >
                {!isTablet && 'Clear Filters'}
              </Button>
            </Space>
          </div>
        )}

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
            if (record.dueDate && dayjs().isAfter(record.dueDate)) {
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
          >
            <TextArea rows={4} placeholder="Task description" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
            initialValue="backlog"
          >
            <Select>
              {Object.keys(statusColors).map(status => (
                <Option key={status} value={status}>
                  <Tag color={statusColors[status]}>
                    {status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select priority' }]}
            initialValue="medium"
          >
            <Select>
              {Object.keys(priorityColors).map(priority => (
                <Option key={priority} value={priority}>
                  <Tag color={priorityColors[priority]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="assignee"
            label="Assignee"
          >
            <Select allowClear placeholder="Unassigned">
              <Option value="JD">John Doe (JD)</Option>
              <Option value="AS">Alice Smith (AS)</Option>
              <Option value="TM">Tom Miller (TM)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="storyPoints"
            label="Story Points"
          >
            <Select allowClear placeholder="Not estimated">
              {[1, 2, 3, 5, 8, 13, 21].map(points => (
                <Option key={points} value={points}>{points}</Option>
              ))}
            </Select>
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