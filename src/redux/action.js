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
      `${baseUrl}/auth/registration`,
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
