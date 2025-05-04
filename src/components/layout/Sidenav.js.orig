// import { useState } from "react";
import { Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const userRole = localStorage.getItem("role");

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const tables = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const users = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4ZM6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 14C7.58172 14 4 17.5817 4 22C4 22.5523 4.44772 23 5 23H19C19.5523 23 20 22.5523 20 22C20 17.5817 16.4183 14 12 14ZM6 20C6.00393 18.1757 7.1786 16.569 8.86123 16.0907C10.182 15.7208 11.5545 15.5 12 15.5C12.4455 15.5 13.818 15.7208 15.1388 16.0907C16.8214 16.569 17.9961 18.1757 18 20H6Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const billing = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const setquestion = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const kansanboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      {/* Board Header */}
      <path
        d="M2 3C1.44772 3 1 3.44772 1 4V5H19V4C19 3.44772 18.5523 3 18 3H2Z"
        fill={color}
      />
      {/* Board Body with Columns */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 6H1V16C1 17.1046 1.89543 18 3 18H17C18.1046 18 19 17.1046 19 16V6ZM4 8C4 7.44772 4.44772 7 5 7H7C7.55228 7 8 7.44772 8 8V14C8 14.5523 7.55228 15 7 15H5C4.44772 15 4 14.5523 4 14V8ZM10 7C9.44772 7 9 7.44772 9 8V12C9 12.5523 9.44772 13 10 13H12C12.5523 13 13 12.5523 13 12V8C13 7.44772 12.5523 7 12 7H10ZM15 7C14.4477 7 14 7.44772 14 8V10C14 10.5523 14.4477 11 15 11H17C17.5523 11 18 10.5523 18 10V8C18 7.44772 17.5523 7 17 7H15Z"
        fill={color}
      />
    </svg>,
  ];

  // In your Sidenav component
  const backlog = [
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" key={0}>
      <path
        d="M3 3C1.89543 3 1 3.89543 1 5V6H19V5C19 3.89543 18.1046 3 17 3H3Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 7H1V16C1 17.1046 1.89543 18 3 18H17C18.1046 18 19 17.1046 19 16V7ZM4 10C4 9.44772 4.44772 9 5 9H6C6.55228 9 7 9.44772 7 10V12C7 12.5523 6.55228 13 6 13H5C4.44772 13 4 12.5523 4 12V10ZM9 9C8.44772 9 8 9.44772 8 10V12C8 12.5523 8.44772 13 9 13H10C10.5523 13 11 12.5523 11 12V10C11 9.44772 10.5523 9 10 9H9ZM14 9C13.4477 9 13 9.44772 13 10V12C13 12.5523 13.4477 13 14 13H15C15.5523 13 16 12.5523 16 12V10C16 9.44772 15.5523 9 15 9H14Z"
        fill={color}
      />
    </svg>,
  ];
  const sprint = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const assessment = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const scorecard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6C3 4.34315 4.34315 3 6 3H16C16.3788 3 16.725 3.214 16.8944 3.55279C17.0638 3.89157 17.0273 4.29698 16.8 4.6L14.25 8L16.8 11.4C17.0273 11.703 17.0638 12.1084 16.8944 12.4472C16.725 12.786 16.3788 13 16 13H6C5.44772 13 5 13.4477 5 14V17C5 17.5523 4.55228 18 4 18C3.44772 18 3 17.5523 3 17V6Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const profile = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const signin = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const signup = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      key={0}
    >
      <path
        d="M0,2A2,2,0,0,1,2,0H8a2,2,0,0,1,2,2V8a2,2,0,0,1-2,2H2A2,2,0,0,1,0,8Z"
        transform="translate(4 4)"
        fill={color}
      />
      <path
        d="M2,0A2,2,0,0,0,0,2V8a2,2,0,0,0,2,2V4A2,2,0,0,1,4,2h6A2,2,0,0,0,8,0Z"
        fill={color}
      />
    </svg>,
  ];

  return (
    <div>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Agile Project Dashboard</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        {userRole === "project_manager" ? (
          <>
            <Menu.Item key="1">
              <NavLink to="/dashboard">
                <span
                  className="icon"
                  style={{
                    background: page === "dashboard" ? color : "",
                  }}
                >
                  {dashboard}
                </span>
                <span className="label">Dashboard</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="2">
              <NavLink to="/project-management">
                <span
                  className="icon"
                  style={{
                    background: page === "tables" ? color : "",
                  }}
                >
                  {tables}
                </span>
                <span className="label">Project Management</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="3">
              <NavLink to="/users">
                <span
                  className="icon"
                  style={{
                    background: page === "users" ? color : "",
                  }}
                >
                  {users}
                </span>
                <span className="label">Users</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="6">
              <NavLink to="/backlog">
                <span
                  className="icon"
                  style={{
                    background: page === "backlog" ? color : "",
                  }}
                >
                  {backlog}
                </span>
                <span className="label">Project Backlog</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="10">
              <NavLink to="/assessment/create">
                <span
                  className="icon"
                  style={{
                    background: page === "setquestion" ? color : "",
                  }}
                ></span>
                <span className="label">Create Assessments</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="7">
              <NavLink to="/sprint">
                <span
                  className="icon"
                  style={{
                    background: page === "sprint" ? color : "",
                  }}
                >
                  {sprint}
                </span>
                <span className="label">Sprint</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="8">
              <NavLink to="/scorecard">
                <span
                  className="icon"
                  style={{
                    background: page === "scorecard" ? color : "",
                  }}
                >
                  {scorecard}
                </span>
                <span className="label">Score Card</span>
              </NavLink>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="5">
              <NavLink to="/kansanboard">
                <span
                  className="icon"
                  style={{
                    background: page === "kansanboard" ? color : "",
                  }}
                >
                  {kansanboard}
                </span>
                <span className="label">Kanban Board</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="4">
              <NavLink to="/assesment">
                <span
                  className="icon"
                  style={{
                    background: page === "assesment" ? color : "",
                  }}
                >
                  {assessment}
                </span>
                <span className="label">Self Assessment</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="9">
              <NavLink to="/profile">
                <span
                  className="icon"
                  style={{
                    background: page === "profile" ? color : "",
                  }}
                >
                  {profile}
                </span>
                <span className="label">Profile</span>
              </NavLink>
            </Menu.Item>
          </>
        )}
      </Menu>
    </div>
  );
}

export default Sidenav;
