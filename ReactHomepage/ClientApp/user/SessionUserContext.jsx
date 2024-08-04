import React, { createContext, useContext, useReducer } from 'react';
import { checkPasswordOnServerAsync, logOutUserAsync } from './userAPI'; 

// Create a context for the session user state
const SessionUserContext = createContext();

// Define the initial state of the session user
const initialState = {
  isAuthorized: false,
  status: 'idle',
  token: null, // To store JWT token
};

// Define action types for better maintainability
const SET_IS_AUTHORIZED = 'SET_IS_AUTHORIZED';
const SET_STATUS = 'SET_STATUS';
const SET_TOKEN = 'SET_TOKEN';

// Reducer function to manage the session user state
const userReducer = (state, action) => {
  switch (action.type) {
    case SET_IS_AUTHORIZED:
      return { ...state, isAuthorized: action.payload };
    case SET_STATUS:
      return { ...state, status: action.payload };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

// Handle async errors
const handleAsyncError = (error, dispatch) => {
  console.error(error);
  dispatch({ type: SET_STATUS, payload: 'idle' });
  throw error;
};

export const SessionUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const checkPasswordAsync = async (password) => {
    dispatch({ type: SET_STATUS, payload: 'loading' });
    try {
      const response = await checkPasswordOnServerAsync(password);
      if (response.data.token) {
        dispatch({ type: SET_IS_AUTHORIZED, payload: true });
        dispatch({ type: SET_TOKEN, payload: response.data.token });
        return 'PasswordOk';
      } else {
        alert('Wrong password, please try again.');
        return 'PasswordIncorrect';
      }
    } catch (error) {
      handleAsyncError(error, dispatch);
    } finally {
      dispatch({ type: SET_STATUS, payload: 'idle' });
    }
  };

  const logOutAsync = async () => {
    dispatch({ type: SET_STATUS, payload: 'loading' });
    try {
      const response = await logOutUserAsync();
      if (response.data === 'userLoggedOut' || response.data === 'userAlreadyLoggedOut') {
        dispatch({ type: SET_IS_AUTHORIZED, payload: false });
        dispatch({ type: SET_TOKEN, payload: null });
        return 'userLoggedOut';
      } else {
        alert(`Unexpected server response: ${response.data}`);
        return 'Error';
      }
    } catch (error) {
      handleAsyncError(error, dispatch);
    } finally {
      dispatch({ type: SET_STATUS, payload: 'idle' });
    }
  };

  return (
    <SessionUserContext.Provider value={{ state, dispatch, checkPasswordAsync, logOutAsync }}>
      {children}
    </SessionUserContext.Provider>
  );
};

// Custom hook to access the session user context
export const useSessionUserContext = () => useContext(SessionUserContext);
