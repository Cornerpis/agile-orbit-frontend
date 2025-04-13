// src/redux/actions.js
import axios from "axios";
import baseUrl from "../apiConfig";
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
export const MyModal = (token,credentials) => async (dispatch) => {
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
      type: "MY_MODAL",
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