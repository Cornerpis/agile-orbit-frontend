import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Typography,
  Tag,
  Input,
  Space,
  Spin,
  Tooltip,
  message,
  Form,
  Modal,
  Select,
  DatePicker
} from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import MyModal from "../pages/create-project";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Tables = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch data from API
  const fetchProjects = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: params.pagination?.current || 1,
        pageSize: params.pagination?.pageSize || 10,
        search: searchText,
        ...params.filters,
        sortField: params.sort?.field,
        sortOrder: params.sort?.order,
      }).toString();

      const response = await fetch(`https://api.example.com/projects?${queryParams}`);
      const result = await response.json();

      const formattedData = result.data.map(project => ({
        key: project.id,
        name: project.name,
        description: project.description,
        budget: project.budget,
        assignedTo: project.assignedTo,
        deadline: moment(project.deadline).format("DD/MM/YYYY"),
        priority: project.priority,
      }));

      setData(formattedData);
      setPagination({
        ...params.pagination,
        total: result.total,
      });
    } catch (error) {
      message.error("Failed to fetch projects");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects({
      pagination,
      filters,
      sort,
    });
  }, [pagination.current, pagination.pageSize, filters, sort, searchText]);

  const handleTableChange = (newPagination, newFilters, newSorter) => {
    const sorter = {};
    if (newSorter.field) {
      sorter.field = newSorter.field;
      sorter.order = newSorter.order;
    }

    fetchProjects({
      pagination: newPagination,
      filters: newFilters,
      sort: sorter,
    });
    setPagination(newPagination);
    setFilters(newFilters);
    setSort(sorter);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleRowClick = (record) => {
    history.push(`/project/${record.key}`);
  };

  // Edit Project Functions
  const handleEdit = (project) => {
    setEditingProject(project);
    form.setFieldsValue({
      ...project,
      deadline: moment(project.deadline, "DD/MM/YYYY")
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // API call to update project
      const response = await fetch(`https://api.example.com/projects/${editingProject.key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          deadline: values.deadline.format("YYYY-MM-DD"),
        }),
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedProject = await response.json();

      // Update local state
      setData(data.map(item =>
        item.key === editingProject.key ? {
          ...item,
          ...updatedProject,
          deadline: moment(updatedProject.deadline).format("DD/MM/YYYY"),
        } : item
      ));

      message.success("Project updated successfully");
      setIsEditModalVisible(false);
      setEditingProject(null);
    } catch (error) {
      message.error("Failed to update project");
      console.error("Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "PROJECT NAME",
      dataIndex: "name",
      key: "name",
      width: "25%",
      sorter: true,
      render: (name) => <span style={{ color: "#000" }}>{name}</span>,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      render: (text) => <span style={{ color: "#000" }}>{text}</span>,
    },
    {
      title: "BUDGET",
      dataIndex: "budget",
      key: "budget",
      sorter: true,
      render: (budget) => `$${budget}`,
    },
    {
      title: "ASSIGNED TO",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (name) => <span style={{ color: "#000" }}>{name}</span>,
    },
    {
      title: "DEADLINE",
      dataIndex: "deadline",
      key: "deadline",
      sorter: true,
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      key: "priority",
      filters: [
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority) => {
        const colorMap = {
          High: "red",
          Medium: "orange",
          Low: "green",
        };
        return <Tag color={colorMap[priority]}>{priority}</Tag>;
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: "100px",
      render: (_, record) => (
        <Tooltip title="Edit">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Project List"
            extra={
              <Space>
                <Search
                  placeholder="Search projects"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                />
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                  icon={<PlusOutlined />}
                >
                  New Project
                </Button>
              </Space>
            }
          >
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                  showTotal: (total) => `Total ${total} projects`,
                }}
                onChange={handleTableChange}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                  style: { cursor: "pointer" },
                })}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Create Project Modal */}
      <MyModal
        visible={isCreateModalVisible}
        onCreate={(values) => {
          console.log("Create:", values);
          setIsCreateModalVisible(false);
          fetchProjects({ pagination, filters, sort });
        }}
        onCancel={() => setIsCreateModalVisible(false)}
      />

      {/* Edit Project Modal */}
      <Modal
        title="Edit Project"
        visible={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingProject(null);
        }}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Project Name"
                rules={[{ required: true, message: "Please enter project name" }]}
              >
                <Input placeholder="Project name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="Budget"
                rules={[{ required: true, message: "Please enter budget" }]}
              >
                <Input prefix="$" type="number" placeholder="Budget" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Project description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignedTo"
                label="Assigned To"
                rules={[{ required: true, message: "Please select assignee" }]}
              >
                <Input placeholder="Team member name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deadline"
                label="Deadline"
                rules={[{ required: true, message: "Please select deadline" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select priority" }]}
          >
            <Select placeholder="Select priority level">
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tables;