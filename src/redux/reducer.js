// src/redux/reducers.js
const initialState = {
  isAuthenticated: false,
  user: null,
  stats: {},
  loading: false,
  error: null,
  projects: [],
  users: [],
  sprint: null,
  token: localStorage.getItem('token') || null,
  projectMembers: [], // ✅ new: store members for selected project
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN":
    case "SIGN_UP":
      return { ...state, isAuthenticated: true, user: action.payload };

    case "GET_STATS_REQUEST":
    case "FETCH_PROJECT_REQUEST":
    case "FETCH_USER_REQUEST":
    case "CREATE_SPRINT_REQUEST":
      return { ...state, loading: true };

    case "GET_STATS_SUCCESS":
      return { ...state, stats: action.payload, loading: false };

    case "FETCH_PROJECT_SUCCESS":
      return { ...state, projects: action.payload, loading: false };

    case "FETCH_USERS_SUCCESS":
      return { ...state, users: action.payload, loading: false };

    case "CREATE_SPRINT_SUCCESS":
      return { ...state, sprint: action.payload, loading: false };

    case "FETCH_PROJECT_MEMBERS_SUCCESS":  // ✅ new case
      return { ...state, projectMembers: action.payload, loading: false };

    case "GET_STATS_FAILURE":
    case "FETCH_PROJECT_FAILURE":
    case "FETCH_USERS_FAILURE":
    case "CREATE_SPRINT_FAILURE":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default authReducer;
