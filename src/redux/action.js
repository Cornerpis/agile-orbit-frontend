// src/redux/actions.js
import axios from "axios";
import baseUrl from "../apiConfig";
import { message } from "antd";
import { persistor } from "./store";

export const signIn = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials);
    const userData = response.data;
    console.log("User Data:", userData);

    dispatch({
      type: "SIGN_IN",
      payload: userData,
    });

    // Return the user data upon successful login
    return userData;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // other than 2xx. Access response data in error.response.data
      return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return {
        status: "failed",
        message: "No response received from the server",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      return { status: "failed", message: "Error setting up the request" };
    }
  }
};

// This action creator handles user registration
// by making an API call to the server
export const signUp = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, credentials);
    const userData = response.data;

    dispatch({
      type: "SIGN_UP",
      payload: userData,
    });

    return {
      status: "success",
      ...userData,
    };
  } catch (error) {
    if (error.response) {
      return {
        status: "error",
        ...error.response.data,
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return {
        status: "error",
        message: "No response received from the server",
      };
    } else {
      console.error("Error setting up the request:", error.message);
      return {
        status: "error",
        message: "Error setting up the request",
      };
    }
  }
};

export const getStats = (token) => {
  return async (dispatch) => {
    try {
      // Make an API call to fetch verification data
      const response = await axios.get(`${baseUrl}/dashboard/quick-stats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the bearer token
        },
      });

      // Dispatch the fetched data to the store
      dispatch({
        type: "GET_STATS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      // Handle errors, dispatch an error action, or set an error state
      console.error("Error fetching stats result:", error);
      dispatch({
        type: "GET_STATS_FAILURE",
        payload: error,
      });
    }
  };
};
// Invite team member
export const inviteTeamMember = (projectId, userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const userIdFromLocalStorage = localStorage.getItem("userId"); // Get userId from localStorage

    console.log("Token:", token); // Check token value
    console.log("UserId from localStorage:", userIdFromLocalStorage); // Check userId value

    if (!token || !userIdFromLocalStorage) {
      throw new Error("User is not authenticated or missing token/userId.");
    }

    const response = await axios.put(
      `${baseUrl}/project/${projectId}/add-member`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Return the response to the component
  } catch (error) {
    console.error("API error in invite team member:", error); // Log full error for debugging
    return {
      success: false,
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to invite user.",
    };
  }
};

export const fetchProjects = (token) => {
  return async (dispatch) => {
    try {
      // Make an API call to fetch projects data
      const response = await axios.get(`${baseUrl}/projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the bearer token
        },
      });

      // Dispatch the fetched data to the store
      dispatch({
        type: "FETCH_PROJECT_SUCCESS",
        payload: response.data.data,
      });
    } catch (error) {
      // Handle errors, dispatch an error action, or set an error state
      console.error("Error fetching verification data:", error);
      dispatch({
        type: "GET_PROJECT_FAILURE",
        payload: error,
      });
    }
  };
};

export const fetchUsers = (token) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${baseUrl}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: "FETCH_USERS_SUCCESS", // Ensure your reducer handles this action type
        payload: response.data.data,
      });
      console.log("Fetched users:", response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      dispatch({
        type: "GET_USERS_FAILURE", // Ensure you handle this in your reducer
        payload: error,
      });
    }
  };
};
//project members
// This action creator fetches the project members
export const fetchProjectMembers = (projectId, token) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${baseUrl}/project/${projectId}/members`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: "FETCH_PROJECT_MEMBERS_SUCCESS",
        payload: response.data.data, // assuming API returns data in .data.data
      });
    } catch (error) {
      console.error("Error fetching project members:", error);
      dispatch({
        type: "FETCH_PROJECT_MEMBERS_FAILURE",
        payload: error,
      });
    }
  };
};

export const fetchUserProjects = (token) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${baseUrl}/project/user-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: "FETCH_USER_PROJECTS_SUCCESS",
        payload: response.data.data, // For the reducer
      });

      // ✅ Return data here so your component can use it
      return response.data;
    } catch (error) {
      console.error("Error fetching user projects:", error);

      dispatch({
        type: "FETCH_USER_PROJECTS_FAILURE",
        payload: error,
      });

      // ❗Return error response to handle it in the component
      return { message: "Failed to fetch projects", error };
    }
  };
};

export const fetchTasksByProject =
  (user_id, projectId, token) => async (dispatch) => {
    try {
      const response = await axios.get(
        `${baseUrl}/user/${user_id}/tasks/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const tasks = response?.data;

      if (Array.isArray(tasks)) {
        dispatch({
          type: "FETCH_TASKS_BY_PROJECT",
          payload: tasks,
        });
      } else {
      }

      console.log("Fetched tasks:", tasks);
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      message.error("Error fetching tasks");
      return [];
    }
  };

// This action creator handles user registration
export const CreateUserModal = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, credentials);
    const userData = response.data;

    dispatch({
      type: "CREATE_USER_MODAL",
      payload: userData,
    });

    // Return the user data upon successful login
    return userData;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // other than 2xx. Access response data in error.response.data
      return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return {
        status: "failed",
        message: "No response received from the server",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      return { status: "failed", message: "Error setting up the request" };
    }
  }
};
// Create task
export const CreateTask = (credentials) => async (dispatch) => {
  try {
    const { projectId, ...taskData } = credentials;
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        statusCode: 401,
        message: "Server error, check your network connection.",
      };
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      `${baseUrl}/project/${projectId}/task`,
      taskData,
      config
    );

    const userData = response.data;

    dispatch({
      type: "CREATE_TASK",
      payload: userData,
    });
    return {
      ...userData,
      statusCode: 201, // Explicitly set expected code for the component
    };
  } catch (error) {
    if (error.response) {
      return {
        ...error.response.data,
        statusCode: error.response.status || 400,
      };
    } else if (error.request) {
      return {
        statusCode: 503,
        message: "No response received from the server.",
      };
    } else {
      return {
        statusCode: 500,
        message: "Error setting up the request.",
      };
    }
  }
};

// This action creator fetches the task data starts

export const fetchTasks = (projectId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        status: "failed",
        message: "Authentication required. Please login.",
      };
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(
      `${baseUrl}/project/${projectId}/tasks`,
      config
    );
    const tasks = response.data;

    dispatch({
      type: "FETCH_TASKS",
      payload: tasks,
    });

    return tasks;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return {
        status: "failed",
        message: "No response received from the server",
      };
    } else {
      return { status: "failed", message: "Error setting up the request" };
    }
  }
};
// This action creator fetches the task data ends

// Update user start

// This create anew asessment
// This action creator creates a new assessment by making an API call

export const createAssessment = (token, assessmentData) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${baseUrl}/assessments/create`,
      assessmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    dispatch({
      type: "CREATE_ASSESSMENT",
      payload: data,
    });

    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return {
        status: "failed",
        message: "No response received from the server",
      };
    } else {
      return { status: "failed", message: "Error setting up the request" };
    }
  }
};

export const getAssessmentList = (token) => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/assessments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data.data;

    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return {
        status: "failed",
        message: "No response received from the server",
      };
    } else {
      return { status: "failed", message: "Error setting up the request" };
    }
  }
};
//start assessment
// This action creator starts an assessment by making an API call
export const startAssessment = (assessmentId) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      // Make an API call to start the assessment
      const response = await axios.get(
        `${baseUrl}/assessment/${assessmentId}/start`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the bearer token
          },
        }
      );

      // Dispatch the fetched data to the store
      dispatch({
        type: "START_ASSESSMENT_SUCCESS",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      // Handle errors, dispatch an error action
      console.error("Error starting assessment:", error);
      dispatch({
        type: "START_ASSESSMENT_FAILURE",
        payload: error,
      });
    }
  };
};
//update user
// This action creator updates a user by making an API call
export const UpdateUserAction = (id, data) => async (dispatch) => {
  try {
    const response = await axios.put(`${baseUrl}/users/:id/update`, data);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
// update user ends
export const createProject = (token, credentials) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${baseUrl}/create/project`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userData = response.data;

    dispatch({
      type: "CREATE_PROJECT",
      payload: userData,
    });
    console.log("API Response:", response.data);
    // Return the user data upon successful login
    return userData;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // other than 2xx. Access response data in error.response.data
      return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return {
        status: "failed",
        message: "No response received from the server",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      return { status: "failed", message: "Error setting up the request" };
    }
  }
};

// add team member to a project
export const addProjectMember =
  (projectId, formData, token) => async (dispatch) => {
    try {
      const response = await axios.post(
        `${baseUrl}/project/${projectId}/add-member`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message || "Member added successfully");
        dispatch({
          type: "ADD_PROJECT_MEMBER_SUCCESS",
          payload: { projectId, member: response.data.data },
        });
      } else {
        message.error(response.data.message || "Failed to add member");
      }

      return response.data;
    } catch (error) {
      let errorMessage = "An error occurred while adding team member";

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      message.error(errorMessage);
      console.error("Add member error:", error);
      return { success: false, message: errorMessage };
    }
  };

export const fetchProjectDetails = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_PROJECT_REQUEST" });
    const response = await axios.get(`${baseUrl}/project/${projectId}`);
    dispatch({
      type: "FETCH_PROJECT_SUCCESS",
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: "FETCH_PROJECT_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const addTaskToProject =
  (token, projectId, taskData) => async (dispatch) => {
    try {
      const response = await axios.post(
        `${baseUrl}/project/${projectId}/task`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: "ADD_TASK_SUCCESS",
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  };
// This action creator fetches the assessment data
// by making an API call to the server
export const fetchAssessment = (assessmentId, token) => async (dispatch) => {
  dispatch({ type: "FETCH_ASSESSMENT_REQUEST" });
  try {
    const response = await axios.get(
      `${baseUrl}/assessment/${assessmentId}/start`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const questions = response.data.questions;

    dispatch({
      type: "FETCH_ASSESSMENT_SUCCESS",
      payload: questions,
    });
    console.log("Fetched questions:", response.data);
  } catch (error) {
    dispatch({
      type: "FETCH_ASSESSMENT_FAILURE",
      payload: error.message || "Something went wrong",
    });
  }
};

// This action creator submits the assessment answers
export const submitAssessment =
  (assessmentId, answers, token) => async (dispatch) => {
    dispatch({ type: "ASSESSMENT_SUBMIT_REQUEST" });

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/assessment/${assessmentId}/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      message.success("Assessment submitted successfully!");
      dispatch({ type: "ASSESSMENT_SUBMIT_SUCCESS", payload: data });
    } catch (error) {
      message.error("Submission failed.");
      dispatch({
        type: "ASSESSMENT_SUBMIT_FAIL",
        payload: error.message,
      });
    }
  };
//submit assessment ends

//sprint creation
// This action creator creates a new sprint by making an API call
export const CREATE_SPRINT_REQUEST = "CREATE_SPRINT_REQUEST";
export const CREATE_SPRINT_SUCCESS = "CREATE_SPRINT_SUCCESS";
export const CREATE_SPRINT_FAILURE = "CREATE_SPRINT_FAILURE";

// Create Sprint Action
export const createSprint = (sprintData) => async (dispatch) => {
  dispatch({ type: CREATE_SPRINT_REQUEST });

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${baseUrl}/create/project`, sprintData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: CREATE_SPRINT_SUCCESS, payload: response.data });

    // Return data for the component to handle success
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({
      type: CREATE_SPRINT_FAILURE,
      payload: error.message,
    });

    // Return error for the component to handle
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};

// Update user profile

export const updateTaskStatus =
  (token, taskId, statusData) => async (dispatch) => {
    try {
      const response = await axios.put(
        `${baseUrl}/task/${taskId}/status`,
        statusData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: "UPDATE_TASK_STATUS_SUCCESS",
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  };
// This action creator assigns a project leader by making an API call
export const assignProjectLeader =
  (token, projectId, userId) => async (dispatch) => {
    try {
      const response = await axios.put(
        `${baseUrl}/project/${projectId}/assign-leader`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const assignedData = response.data;

      dispatch({
        type: "ASSIGN_PROJECT_LEADER",
        payload: assignedData,
      });

      return assignedData;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else if (error.request) {
        console.error("No response received:", error.request);
        return {
          status: "failed",
          message: "No response received from the server",
        };
      } else {
        console.error("Error setting up the request:", error.message);
        return { status: "failed", message: "Error setting up the request" };
      }
    }
  };

export const UpdateUserProfile = (token, updatedData) => async () => {
  try {
    const res = await axios.put(`${baseUrl}/me`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: res.data.message,
      user: res.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Update failed",
    };
  }
};
