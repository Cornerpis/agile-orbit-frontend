// src/redux/reducers.js
const initialState = {
  isAuthenticated: false,
  stats: {},
  loading: false,
  error: null,
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

    default:
      return state;
  }
};

export default authReducer;
