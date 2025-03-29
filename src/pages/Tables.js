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

  {
    key: "2",
    name: (
      <>
        <Avatar.Group>
          <div className="avatar-info">
            {/* <Title level={5}>Alexa Liras</Title> */}
            <p style={{ color: "black" }}>Front end web development</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Programator</Title> */}
          <p style={{ color: "black" }}>Developer</p>
        </div>
      </>
    ),

    status: (
      <>
        <div className="author-info">
          <p style={{ color: "black" }}>$678</p>
        </div>
        {/* <Button className="tag-badge">ONLINE</Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{ color: "black" }}>
          <span>23/12/20</span>
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
          <p>Low</p>
        </div>
      </>
    ),
  },

  {
    key: "3",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face}
          ></Avatar> */}
          <div className="avatar-info">
            {/* <Title level={5}>Laure Perrier</Title> */}
            <p style={{ color: "black" }}>Mobile development</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Executive</Title> */}
          <p style={{ color: "black" }}>Projects</p>
        </div>
      </>
    ),

    status: (
      <>
        <p style={{ color: "black" }}>$235</p>
        {/* <Button type="primary" className="tag-primary">
          ONLINE
        </Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{ color: "black" }}>
          <span>03/04/21</span>
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
          <p>Medium</p>
        </div>
      </>
    ),
  },
  {
    key: "4",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face4}
          ></Avatar> */}
          <div className="avatar-info">
            {/* <Title level={5}>Miriam Eric</Title> */}
            <p style={{ color: "black" }}>Web design</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Marketing</Title> */}
          <p style={{ color: "black" }}>Design a well structured</p>
        </div>
      </>
    ),

    status: (
      <>
        <p style={{ color: "black" }}>$902</p>
        {/* <Button type="primary" className="tag-primary">
          ONLINE
        </Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{ color: "black" }}>
          <span>03/04/21</span>
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
  {
    key: "5",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face5}
          ></Avatar> */}
          <div className="avatar-info">
            {/* <Title level={5}>Richard Gran</Title> */}
            <p style={{ color: "black" }}>Networking</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Manager</Title> */}
          <p style={{ color: "black" }}>Sprint creation</p>
        </div>
      </>
    ),

    status: (
      <>
        <p style={{ color: "black" }}>$578</p>
        {/* <Button className="tag-badge">ONLINE</Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{ color: "black" }}>
          <span>23/03/20</span>
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
          <p>Medium</p>
        </div>
      </>
    ),
  },

  {
    key: "6",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face6}
          ></Avatar> */}
          <div className="avatar-info">
            {/* <Title level={5}>John Levi</Title> */}
            <p style={{ color: "black" }}>Project management</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Tester</Title> */}
          <p style={{ color: "black" }}>Developer</p>
        </div>
      </>
    ),

    status: (
      <>
        <p style={{ color: "black" }}>$786</p>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{ color: "black" }}>
          <span>14/04/17</span>
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
          <p>Low</p>
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
