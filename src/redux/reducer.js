// src/redux/reducers.js
const initialState = {
  isAuthenticated: false,
  stats: {},
  loading: false,
  error: null,
  projects: [],
  users: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN":
      // Make API call for sign in, update state accordingly
      return { isAuthenticated: true, user: action.payload };
    case "SIGN_UP":
      // Make API call for sign in, update state accordingly
      return { isAuthenticated: true, user: action.payload };
    case "GET_STATS_SUCCESS":
      return { ...state, stats: action.payload, loading: false };
    case "GET_STATS_FAILURE":
      return { ...state, error: action.payload, loading: false };
    case "GET_STATS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_PROJECT_SUCCESS":
      return { ...state, projects: action.payload, loading: false };
    case "FETCH_PROJECT_FAILURE":
      return { ...state, error: action.payload, loading: false };
    case "FETCH_PROJECT_REQUEST":
      return { ...state, loading: true };
    case "FETCH_USERS_SUCCESS":
      return { ...state, users: action.payload, loading: false };
    case "FETCH_USERS_FAILURE":
      return { ...state, error: action.payload, loading: false };
    case "FETCH_USER_REQUEST":
      return { ...state, loading: true };

    default:
      return state;
  }
};

export default authReducer;
