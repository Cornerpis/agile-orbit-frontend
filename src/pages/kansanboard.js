import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Tag, Button, Dropdown, Menu, message, Grid } from "antd";
import { MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTasksByProject, updateTaskStatus } from "../redux/action"; // Fetch tasks for the project
import "../assets/styles/KanbanBoard.css";

const { useBreakpoint } = Grid;

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users || []);
  const tasks = useSelector((state) => state.tasks || []);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState({
    todo: { id: "todo", title: "To Do", items: [] },
    in_progress: { id: "in_progress", title: "In Progress", items: [] },
    completed: { id: "completed", title: "Completed", items: [] },
  });

  const screens = useBreakpoint();
  const { projectId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await dispatch(
          fetchTasksByProject(userId, projectId, token)
        );
        if (response.message === "Tasks fetched successfully.") {
          // Update columns with fetched tasks
          const taskColumns = {
            todo: { id: "todo", title: "To Do", items: [] },
            in_progress: {
              id: "in_progress",
              title: "In Progress",
              items: [],
            },
            completed: { id: "completed", title: "Completed", items: [] },
          };

          response.data.forEach((task) => {
            taskColumns[task.status]?.items.push(task); // Sort tasks into columns based on their status
          });

          setColumns(taskColumns);
        } else {
          message.error(response?.message || "Failed to fetch tasks");
        }
      } catch (error) {
        message.error("Error fetching tasks");
      }
    };

    loadTasks();
  }, [dispatch, projectId]);

  // Handle drag-and-drop functionality
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const startItems = [...sourceColumn.items];
    const [movedItem] = startItems.splice(source.index, 1);
    const finishItems = [...destColumn.items];

    movedItem.columnId = destination.droppableId;

    // Update UI immediately
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: startItems },
      [destination.droppableId]: {
        ...destColumn,
        items: [movedItem, ...finishItems],
      },
    });

    // Dispatch the task status update
    try {
      const statusData = { status: destination.droppableId }; // New status based on the column ID
      await dispatch(updateTaskStatus(token, movedItem._id, statusData));
    } catch (error) {
      message.error("Error updating task status.");
    }
  };

  const getColumnColor = (columnId) => {
    const colors = {
      todo: "volcano",
      in_progress: "geekblue",
      completed: "green",
    };
    return colors[columnId] || "purple";
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="column">
              <div className="column-header">
                <Tag color={getColumnColor(column.id)}>{column.title}</Tag>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="tasks-list"
                  >
                    {(column.items || []).map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card size="small" title={task.title}>
                              <p>{task.description}</p>
                              {task.due_date && (
                                <p>
                                  <strong>Due:</strong>{" "}
                                  {new Date(task.due_date).toLocaleDateString()}
                                </p>
                              )}
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
    </div>
  );
};

export default KanbanBoard;
