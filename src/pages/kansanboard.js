import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Input, Button, Tag, Modal, Form, Dropdown, Menu, message, Grid } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import '../assets/styles/KanbanBoard.css';

const { TextArea } = Input;
const { useBreakpoint } = Grid;

const KanbanBoard = () => {
  // Initialize with empty columns to prevent undefined errors
  const [columns, setColumns] = useState({
    'todo': {
      id: 'todo',
      title: 'To Do',
      items: [],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      items: [],
    },
    'done': {
      id: 'done',
      title: 'Done',
      items: [],
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [mobileView, setMobileView] = useState(false);

  // Initialize with sample data after mount
  useEffect(() => {
    setColumns({
      'todo': {
        id: 'todo',
        title: 'To Do',
        items: [
          { id: 'task-1', content: 'Task 1', description: 'Description for Task 1' },
          { id: 'task-2', content: 'Task 2', description: 'Description for Task 2' },
        ],
      },
      'in-progress': {
        id: 'in-progress',
        title: 'In Progress',
        items: [
          { id: 'task-3', content: 'Task 3', description: 'Description for Task 3' },
        ],
      },
      'done': {
        id: 'done',
        title: 'Done',
        items: [
          { id: 'task-4', content: 'Task 4', description: 'Description for Task 4' },
        ],
      },
    });
  }, []);

  // Set mobile view based on screen size
  useEffect(() => {
    setMobileView(!screens.md);
  }, [screens]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Check for invalid destinations
    if (!destination || 
        !columns[source.droppableId] || 
        !columns[destination.droppableId]) {
      return;
    }

    // No movement
    if (source.droppableId === destination.droppableId &&
        source.index === destination.index) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    // Same column movement
    if (startColumn.id === finishColumn.id) {
      const newItems = [...startColumn.items];
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [startColumn.id]: {
          ...startColumn,
          items: newItems,
        },
      });
      return;
    }

    // Cross-column movement
    const startItems = [...startColumn.items];
    const [movedItem] = startItems.splice(source.index, 1);
    const finishItems = [...finishColumn.items];
    finishItems.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [startColumn.id]: {
        ...startColumn,
        items: startItems,
      },
      [finishColumn.id]: {
        ...finishColumn,
        items: finishItems,
      },
    });
  };

  // Task management functions
  const showAddTaskModal = (columnId) => {
    form.resetFields();
    setEditingTask(null);
    form.setFieldsValue({ columnId });
    setIsModalVisible(true);
  };

  const showEditTaskModal = (task, columnId) => {
    form.resetFields();
    setEditingTask({ ...task, columnId });
    form.setFieldsValue({
      content: task.content,
      description: task.description,
      columnId,
    });
    setIsModalVisible(true);
  };

  const handleTaskSubmit = () => {
    form.validateFields().then(values => {
      const { content, description, columnId } = values;
      
      if (editingTask) {
        // Update existing task
        const updatedColumns = {
          ...columns,
          [columnId]: {
            ...columns[columnId],
            items: columns[columnId].items.map(item => 
              item.id === editingTask.id ? { ...item, content, description } : item
            ),
          },
        };
        setColumns(updatedColumns);
      } else {
        // Add new task
        const newTask = {
          id: `task-${Date.now()}`,
          content,
          description,
        };
        
        const updatedColumns = {
          ...columns,
          [columnId]: {
            ...columns[columnId],
            items: [...columns[columnId].items, newTask],
          },
        };
        setColumns(updatedColumns);
      }
      
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const deleteTask = (taskId, columnId) => {
    const updatedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: columns[columnId].items.filter(item => item.id !== taskId),
      },
    };
    setColumns(updatedColumns);
    message.success('Task deleted successfully');
  };

  // Column management functions
  const addNewColumn = () => {
    if (!newColumnName.trim()) {
      message.warning('Please enter a column name');
      return;
    }
    
    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: newColumnName,
      items: [],
    };
    
    setColumns({
      ...columns,
      [newColumnId]: newColumn,
    });
    
    setNewColumnName('');
    setIsAddingColumn(false);
    message.success('Column added successfully');
  };

  const deleteColumn = (columnId) => {
    if (Object.keys(columns).length <= 1) {
      message.warning('You must have at least one column');
      return;
    }
    
    const newColumns = { ...columns };
    delete newColumns[columnId];
    setColumns(newColumns);
    message.success('Column deleted successfully');
  };

  const getColumnColor = (columnId) => {
    const colors = {
      'todo': 'volcano',
      'in-progress': 'geekblue',
      'done': 'green',
    };
    return colors[columnId] || 'purple';
  };

  const renderColumns = () => {
    return Object.values(columns).map((column) => (
      <div key={column.id} className="column">
        <div className="column-header">
          <Tag color={getColumnColor(column.id)}>{column.title}</Tag>
          <div className="column-actions">
            <Button 
              type="text" 
              icon={<PlusOutlined />} 
              onClick={() => showAddTaskModal(column.id)}
              className="action-button"
              aria-label={`Add task to ${column.title}`}
            />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item 
                    key="delete" 
                    icon={<DeleteOutlined />}
                    onClick={() => deleteColumn(column.id)}
                  >
                    Delete Column
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button 
                type="text" 
                icon={<MoreOutlined />} 
                className="action-button"
                aria-label={`More options for ${column.title}`}
              />
            </Dropdown>
          </div>
        </div>
        
        <Droppable droppableId={column.id} key={column.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="tasks-list"
            >
              {column.items.map((task, index) => (
                <Draggable 
                  key={task.id} 
                  draggableId={task.id} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-card"
                    >
                      <Card
                        size="small"
                        actions={[
                          <EditOutlined 
                            key="edit" 
                            onClick={() => showEditTaskModal(task, column.id)}
                            className="action-button"
                            aria-label={`Edit ${task.content}`}
                          />,
                          <DeleteOutlined 
                            key="delete" 
                            onClick={() => deleteTask(task.id, column.id)}
                            className="action-button"
                            aria-label={`Delete ${task.content}`}
                          />,
                        ]}
                      >
                        <Card.Meta
                          title={task.content}
                          description={
                            mobileView && task.description.length > 30
                              ? `${task.description.substring(0, 30)}...`
                              : task.description
                          }
                        />
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
    ));
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={`columns-container ${mobileView ? 'mobile-view' : ''}`}>
          {renderColumns()}
          
          <div className="add-column">
            {isAddingColumn ? (
              <div className="add-column-form">
                <Input
                  placeholder="Column name"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  autoFocus
                  aria-label="New column name"
                />
                <div className="add-column-actions">
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />} 
                    onClick={addNewColumn}
                    className="action-button"
                    aria-label="Confirm new column"
                  />
                  <Button 
                    type="text" 
                    icon={<CloseOutlined />} 
                    onClick={() => setIsAddingColumn(false)}
                    className="action-button"
                    aria-label="Cancel new column"
                  />
                </div>
              </div>
            ) : (
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                block
                onClick={() => setIsAddingColumn(true)}
                className="add-column-button"
                aria-label="Add new column"
              >
                {mobileView ? <PlusOutlined /> : 'Add Column'}
              </Button>
            )}
          </div>
        </div>
      </DragDropContext>

      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        visible={isModalVisible}
        onOk={handleTaskSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={mobileView ? '90%' : '50%'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="content"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Task title" aria-label="Task title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea 
              rows={mobileView ? 3 : 4} 
              placeholder="Task description" 
              aria-label="Task description"
            />
          </Form.Item>
          <Form.Item name="columnId" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanBoard;