// src/redux/reducers.js
const initialState = {
  isAuthenticated: false,
  // user: null,
  user: {
    // Other user fields...
    firstName: "",
    lastName: "",
    // ...
  },
  verificationData: [],
  transactionData: [],
  verificationResult: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN":
      // Make API call for sign in, update state accordingly
      return { isAuthenticated: true, user: action.payload };
    case "SIGN_UP":
      // Make API call for sign in, update state accordingly
      return { isAuthenticated: true, user: action.payload };

    default:
      return state;
  }
};

export default authReducer;
