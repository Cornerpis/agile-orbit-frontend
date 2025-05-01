import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Typography,
  Tag,
} from "antd";

import {  PlusOutlined } from "@ant-design/icons";
import MyModal from "../pages/create-project";
import { fetchProjects } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";

const { Title } = Typography;

// table code start
const columns = [
  {
    title: "PROJECT NAME",
    dataIndex: "name",
    key: "name",
    width: "32%",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
  },

  {
    title: "BUDGET",
    key: "budget",
    dataIndex: "budget",
    render: (amount) =>
      amount != null
        ? new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(amount)
        : "-",
  },
  {
    title: "ASSIGNED TO",
    key: "assigned_to",
    dataIndex: "assigned_to",
  },
  {
    title: "DEADLINE",
    key: "end_time",
    dataIndex: "end_time",
    render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
  },
  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",

    render: (status) => {
      const color =
        status === "todo"
          ? "red"
          : status === "in_progress"
          ? "orange"
          : "green";
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

function Tables() {
  const projects = useSelector((state) => state.projects);
  const onChange = (e) => console.log(`radio checked: ${e.target.value}`);
  const history = useHistory();
  const handleRowClick = (record) => {
    history.push(`/project/${record._id}`);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCreate = (values) => {
    console.log("Project Created:", values);
    setIsModalVisible(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects(localStorage.getItem("token")));
  }, []);

  return (
    <>
      <MyModal
        visible={isModalVisible}
        onCreate={handleCreate}
        onCancel={() => setIsModalVisible(false)}
      />
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Project List"
              extra={
                <>
                  <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                    className="width-100"
                  >
                    {<PlusOutlined />} Create new project
                  </Button>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={projects.map((project) => ({
                    ...project,
                    key: project.id,
                  }))}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                  }}
                  onRow={(record) => {
                    return {
                      onClick: () => handleRowClick(record),
                      style: { cursor: "pointer" },
                    };
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;