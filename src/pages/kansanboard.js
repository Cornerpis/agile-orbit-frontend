import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Form, Card, Input, Button, Tag, Modal, Dropdown, DatePicker,
  Select, Menu, message, Grid, notification
} from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CreateTask, fetchUsers } from '../redux/action';
import '../assets/styles/KanbanBoard.css';

const { TextArea } = Input;
const { useBreakpoint } = Grid;
const { Option } = Select;

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users || []);
  const [loadingUsers, setUsersLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const token = localStorage.getItem('token');

  const {projectId } = useParams(); // ✅ dynamically fetched from URL

  const [columns, setColumns] = useState({
    'todo': { id: 'todo', title: 'To Do', items: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', items: [] },
    'done': { id: 'done', title: 'Done', items: [] },
  });

  const [mobileView, setMobileView] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    setMobileView(!screens.md);
  }, [screens]);

  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        await dispatch(fetchUsers(token));
      } catch {
        message.error('Failed to fetch users');
      } finally {
        setUsersLoading(false);
      }
    };

    if (isModalVisible) {
      loadUsers();
      form.resetFields();
    }
  }, [isModalVisible, dispatch, token, form]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    if (!sourceColumn?.items || !destColumn) return;

    const startItems = [...(sourceColumn.items || [])];
    const [movedItem] = startItems.splice(source.index, 1);
    movedItem.columnId = destination.droppableId;
    const finishItems = [...(destColumn.items || [])];
    finishItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: startItems },
      [destination.droppableId]: { ...destColumn, items: finishItems },
    });
  };

  const showAddTaskModal = (columnId) => {
    form.resetFields();
    setEditingTask(null);
    form.setFieldsValue({ columnId });
    setIsModalVisible(true);
  };

  const handleTaskSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { title, description, due_date, assigned_to, columnId } = values;

      const newTask = {
        id: `task-${Date.now()}`,
        title,
        description,
        due_date: due_date?.format('YYYY-MM-DD'),
        assigned_to,
        projectId, // ✅ use dynamic projectId
        columnId,
      };

      const response = await dispatch(CreateTask({ ...newTask }));

      if (response?.statusCode === 201 || response?.success) {
        const column = columns[columnId] || { items: [] };
        const newItems = [...(column.items || []), newTask];
        setColumns({
          ...columns,
          [columnId]: {
            ...column,
            items: newItems,
          },
        });
        api.success({ message: 'Task created successfully!' });
        setIsModalVisible(false);
        form.resetFields();
      } else {
        api.error({ message: response?.message || 'Error creating task' });
      }
    } catch (error) {
      api.error({ message: 'Form Validation Error', description: error?.message || 'Please check the form fields.' });
    }
  };

  const deleteTask = (taskId, columnId) => {
    const column = columns[columnId];
    if (!column?.items) return;
    const filteredItems = column.items.filter((item) => item.id !== taskId);
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: filteredItems,
      },
    });
    message.success('Task deleted successfully');
  };

  const getColumnColor = (columnId) => {
    const colors = {
      'todo': 'volcano',
      'in-progress': 'geekblue',
      'done': 'green',
    };
    return colors[columnId] || 'purple';
  };

  const getCardMenu = (taskId, columnId) => (
    <Menu>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => deleteTask(taskId, columnId)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="kanban-board">
      {contextHolder}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="column">
              <div className="column-header">
                <Tag color={getColumnColor(column.id)}>{column.title}</Tag>
                <Button icon={<PlusOutlined />} onClick={() => showAddTaskModal(column.id)} />
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="tasks-list">
                    {(column.items || []).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              size="small"
                              title={task.title}
                              extra={
                                <Dropdown overlay={getCardMenu(task.id, column.id)} trigger={['click']}>
                                  <MoreOutlined style={{ cursor: 'pointer' }} />
                                </Dropdown>
                              }
                            >
                              <p>{task.description}</p>
                              {task.due_date && <p><strong>Due:</strong> {task.due_date}</p>}
                              {task.assigned_to && <p><strong>Assigned to:</strong> {task.assigned_to}</p>}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleTaskSubmit} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date" rules={[{ required: true, message: 'Please select a due date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="assigned_to" label="Assign To" rules={[{ required: true, message: 'Please select an assignee' }]}>
            <Select placeholder="Choose a team member" loading={loadingUsers}>
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.first_name} {user.last_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="columnId" hidden>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
