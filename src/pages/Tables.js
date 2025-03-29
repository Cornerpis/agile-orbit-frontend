import { useState } from "react";
import { useHistory} from "react-router-dom";
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
  Typography, Tag
} from "antd";

import { ToTopOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// Images
// import ava1 from "../assets/images/logo-shopify.svg";
// import ava2 from "../assets/images/logo-atlassian.svg";
// import ava3 from "../assets/images/logo-slack.svg";
// import ava5 from "../assets/images/logo-jira.svg";
// import ava6 from "../assets/images/logo-invision.svg";
// import face from "../assets/images/face-1.jpg";
// import face2 from "../assets/images/face-2.jpg";
// import face3 from "../assets/images/face-3.jpg";
// import face4 from "../assets/images/face-4.jpg";
// import face5 from "../assets/images/face-5.jpeg";
// import face6 from "../assets/images/face-6.jpeg";
import pencil from "../assets/images/pencil.svg";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
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
    // render: (priority) => {
    //   const color = priority === "High" ? "red" : priority === "Medium" ? "orange" : "green";
    //   return <Tag color={color}>{priority}</Tag>;
    // }
    render: (priority) => {
      const color = priority === "High" ? "red" : priority === "Medium" ? "orange" : "green";
      return <Tag color={color}>{priority}</Tag>;
    }
  },
];

const data = [
  {
    key: "1",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face2}
          ></Avatar> */}
          <div className="avatar-info">
            {/* <Title level={5}>Michael John</Title> */}
            <p style={{color:"black"}}>Create an adminstrative dashboard</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Manager</Title> */}
          <p style={{color:"black"}}>Organization</p>
        </div>
      </>
    ),

    status: (
      <>
      <div className="author-info">
          {/* <Title level={5}>Manager</Title> */}
          <p style={{color:"black"}}>$560</p>
        </div>
        {/* <Button type="primary" className="tag-primary">
          ONLINE
        </Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{color:"black"}}>
          <span>23/04/18</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
    deadline: (
      <>
        <div className="author-info" >
          <p style={{color:"black"}}>23/04/18</p>
        </div>
      </>
    ),
    priority: (
      <>
        <div className="author-info" >
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
          {/* <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face3}
          ></Avatar> */}
          <div className="avatar-info">
            {/* <Title level={5}>Alexa Liras</Title> */}
            <p style={{color:"black"}}>Front end web development</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Programator</Title> */}
          <p style={{color:"black"}}>Developer</p>
        </div>
      </>
    ),

    status: (
      <>
      <div className="author-info" >
          <p style={{color:"black"}}>$678</p>
        </div>
        {/* <Button className="tag-badge">ONLINE</Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{color:"black"}}>
          <span>23/12/20</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
    deadline: (
      <>
        <div className="author-info" >
          <p style={{color:"black"}}>23/04/18</p>
        </div>
      </>
    ),
    priority: (
      <>
        <div className="author-info" >
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
            <p style={{color:"black"}}>Mobile development</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info" >
          {/* <Title level={5}>Executive</Title> */}
          <p style={{color:"black"}}>Projects</p>
        </div>
      </>
    ),

    status: (
      <>
      <p style={{color:"black"}}>$235</p>
        {/* <Button type="primary" className="tag-primary">
          ONLINE
        </Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{color:"black"}}>
          <span>03/04/21</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
    deadline: (
      <>
        <div className="author-info" >
          <p style={{color:"black"}}>23/04/18</p>
        </div>
      </>
    ),
    priority: (
      <>
        <div className="author-info" >
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
            <p style={{color:"black"}}>Web design</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Marketing</Title> */}
          <p style={{color:"black"}}>Design a well structured</p>
        </div>
      </>
    ),

    status: (
      <>
      <p style={{color:"black"}}>$902</p>
        {/* <Button type="primary" className="tag-primary">
          ONLINE
        </Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{color:"black"}}>
          <span>03/04/21</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
    deadline: (
      <>
        <div className="author-info" >
          <p style={{color:"black"}}>23/04/18</p>
        </div>
      </>
    ),
    priority: (
      <>
        <div className="author-info" >
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
            <p style={{color:"black"}}>Networking</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Manager</Title> */}
          <p style={{color:"black"}}>Sprint creation</p>
        </div>
      </>
    ),

    status: (
      <>
      <p style={{color:"black"}}>$578</p>
        {/* <Button className="tag-badge">ONLINE</Button> */}
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{color:"black"}}>
          <span>23/03/20</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
    deadline: (
      <>
        <div className="author-info" >
          <p style={{color:"black"}}>23/04/18</p>
        </div>
      </>
    ),
    priority: (
      <>
        <div className="author-info" >
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
            <p style={{color:"black"}}>Project management</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          {/* <Title level={5}>Tester</Title> */}
          <p style={{color:"black"}}>Developer</p>
        </div>
      </>
    ),

    status: (
      <>
        <p style={{color:"black"}}>$786</p>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed" style={{color:"black"}}>
          <span>14/04/17</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
    deadline: (
      <>
        <div className="author-info" >
          <p style={{color:"black"}}>23/04/18</p>
        </div>
      </>
    ),
    priority: (
      <>
        <div className="author-info" >
          <p>Low</p>
        </div>
      </>
    ),
  },
];
// project table start
const project = [
  {
    title: "COMPANIES",
    dataIndex: "name",
    width: "32%",
  },
  {
    title: "BUDGET",
    dataIndex: "age",
  },
  {
    title: "STATUS",
    dataIndex: "address",
  },
  {
    title: "COMPLETION",
    dataIndex: "completion",
  },
];
const dataproject = [
  {
    key: "1",

    name: (
      <>
        <Avatar.Group>
          {/* <Avatar className="shape-avatar" src={ava1} size={25} alt="" /> */}
          <div className="avatar-info">
            <Title level={5}>Spotify Version</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$14,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={30} size="small" />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "2",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar className="shape-avatar" src={ava2} size={25} alt="" /> */}
          <div className="avatar-info">
            <Title level={5}>Progress Track</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$3,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={10} size="small" />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "3",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar className="shape-avatar" src={ava3} size={25} alt="" /> */}
          <div className="avatar-info">
            <Title level={5}> Jira Platform Errors</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">Not Set</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">done</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={100} size="small" format={() => "done"} />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "4",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar className="shape-avatar" src={ava5} size={25} alt="" /> */}
          <div className="avatar-info">
            <Title level={5}> Launch new Mobile App</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$20,600</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">canceled</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress
            percent={50}
            size="small"
            status="exception"
            format={() => "50%"}
          />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "5",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar className="shape-avatar" src={ava5} size={25} alt="" /> */}
          <div className="avatar-info">
            <Title level={5}>Web Dev</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$4,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={80} size="small" />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "6",
    name: (
      <>
        <Avatar.Group>
          {/* <Avatar className="shape-avatar" src={ava6} size={25} alt="" /> */}
          <div className="avatar-info">
            <Title level={5}>Redesign Online Stores</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">$2,000</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">canceled</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={0} size="small" />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
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

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Project List"
              extra={
                <>
                 {/* <Button
                    type="primary"
                    className="width-100"
                  >
                    {<PlusOutlined />} Invite Team Member
                  </Button> */}
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
                      style: { cursor: 'pointer' } // show pointer cursor on hover
                    };
                  }}
                />
              </div>
            </Card>

            {/* <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Projects List"
              extra={
                <>
                 <Button
                    type="primary"
                    className="width-100"
                  >
                    {<PlusOutlined />} Invite Team Member
                  </Button>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={project}
                  dataSource={dataproject}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
              <div className="uploadfile pb-15 shadow-none">
                <Upload {...formProps}>
                  <Button
                    type="dashed"
                    className="ant-medium-box"
                    icon={<ToTopOutlined />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </div>
            </Card> */}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;
