import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  Tag,
} from "antd";

import { ToTopOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import pencil from "../assets/images/pencil.svg";
import MyModal from "../pages/create-project";

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
    dataIndex: "function",
    key: "function",
  },

  {
    title: "BUDGET",
    key: "status",
    dataIndex: "status",
  },
  {
    title: "ASSIGNED TO",
    key: "employed",
    dataIndex: "employed",
  },
  {
    title: "DEADLINE",
    key: "deadline",
    dataIndex: "deadline",
  },
  {
    title: "PRIORITY",
    key: "priority",
    dataIndex: "priority",

    render: (priority) => {
      const color =
        priority === "High"
          ? "red"
          : priority === "Medium"
          ? "orange"
          : "green";
      return <Tag color={color}>{priority}</Tag>;
    },
  },
];

const data = [
  {
    key: "1",
    name: (
      <>
        <Avatar.Group>
          <div className="avatar-info">
            {/* <Title level={5}>Michael John</Title> */}
            <p style={{ color: "black" }}>Create an adminstrative dashboard</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Manager</Title> */}
          <p style={{ color: "black" }}>Organization</p>
        </div>
      </>
    ),

    status: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Manager</Title> */}
          <p style={{ color: "black" }}>$560</p>
        </div>
        {/* <Button type="primary" className="tag-primary">
          ONLINE
        </Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{ color: "black" }}>
          <span>23/04/18</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
    deadline: (
      <>
        <div className="author-info">
          <p style={{ color: "black" }}>23/04/18</p>
        </div>
      </>
    ),
    priority: (
      <>
        <div className="author-info">
          <p>High</p>
        </div>
      </>
    ),
  },
];

function Tables() {
  const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const history = useHistory();
  const handleRowClick = (record) => {
    history.push(`/project/${record.key}`);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCreate = (values) => {
    console.log("Project Created:", values);
    setIsModalVisible(false);
  };

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
                  dataSource={data}
                  pagination={false}
                  onRow={(record) => {
                    return {
                      onClick: () => handleRowClick(record), // click row
                      style: { cursor: "pointer" }, // show pointer cursor on hover
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
