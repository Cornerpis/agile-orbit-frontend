// src/redux/actions.js
import axios from "axios";
import baseUrl from "../apiConfig";
import { message } from 'antd';
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
export const signUp = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${baseUrl}/register`,
      credentials
    );
    const userData = response.data;

    dispatch({
      type: "SIGN_UP",
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
    console.log("Token:", token);
    console.log("Project ID:", projectId);
    console.log("User ID:", userId);

    const response = await axios.put(
      `${baseUrl}/project/${projectId}/add-member`,
      { userId }, // Request body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API error in inviteTeamMember:", error);
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
    } catch (error) {
      console.error("Error fetching users:", error);
      dispatch({
        type: "GET_USERS_FAILURE", // Ensure you handle this in your reducer
        payload: error,
      });
    }
  };
};
export const CreateUserModal = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${baseUrl}/register`,
      credentials
    );
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
    const response = await axios.post(
      `${baseUrl}/project/:projectId/task`,
      taskData
    );
    const userData = response.data;

    dispatch({
      type: "CREATE_TASK",
      payload: userData,
    });

    return userData;
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
// export const CreateTask = (credentials) => async (dispatch) => {
//   try {
//     const projectId = "projectid"; 
//     const response = await axios.post(
//       `${baseUrl}/project/${projectId}/task`,
//       credentials
//     );

//     const userData = response.data;

//     dispatch({
//       type: "CREATE_TASK",
//       payload: userData,
//     });

//     return userData;
//   } catch (error) {
//     console.error(error); // Log error for debugging
//     if (error.response) {
//       return error.response.data;
//     } else if (error.request) {
//       return {
//         status: "failed",
//         message: "No response received from the server",
//       };
//     } else {
//       return { status: "failed", message: "Error setting up the request" };
//     }
//   }
// };

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
          'Content-Type': 'application/json',
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
//start assessment
// This action creator starts an assessment by making an API call
export const startAssessment = (assessmentId, token) => {
  return async (dispatch) => {
    try {
      // Make an API call to start the assessment
      const response = await axios.get(`${baseUrl}/assessment/:assessmentId/start`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the bearer token
        },
      });

      // Dispatch the fetched data to the store
      dispatch({
        type: "START_ASSESSMENT_SUCCESS",
        payload: response.data,
      });
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
        headers:{
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
        
        }
       
      },
    );
    const userData = response.data;

    dispatch({
      type: "CREATE_PROJECT",
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

// add team member to a project
export const addProjectMember = (projectId, formData, token) => async (dispatch) => {
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
      message.success(response.data.message || 'Member added successfully');
      dispatch({
        type: "ADD_PROJECT_MEMBER_SUCCESS",
        payload: { projectId, member: response.data.data },
      });
    } else {
      message.error(response.data.message || 'Failed to add member');
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'An error occurred while adding team member';
    
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    message.error(errorMessage);
    console.error('Add member error:', error);
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

export const addTaskToProject = (token, projectId, taskData) => async (dispatch) => {
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

export const updateTaskStatus = (token, projectId, taskId, statusData) => async (dispatch) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/project/${projectId}/task/${taskId}`,
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





export const assignProjectLeader = (token, projectId, userId) => async (dispatch) => {
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