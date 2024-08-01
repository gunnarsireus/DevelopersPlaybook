import React, { createContext, useContext, useReducer } from 'react';
import { checkPasswordOnServerAsync, logOutUserAsync } from './userAPI';

// Create a context for the session user state
const SessionUserContext = createContext();

// Define the initial state of the session user
const initialState = {
  isIdentified: false,
  status: 'idle',
};

// Define action types for better maintainability
const SET_IS_IDENTIFIED = 'SET_IS_IDENTIFIED';
const SET_STATUS = 'SET_STATUS';

// Reducer function to manage the session user state
const userReducer = (state, action) => {
  switch (action.type) {
    case SET_IS_IDENTIFIED:
      return { ...state, isIdentified: action.payload };
    case SET_STATUS:
      return { ...state, status: action.payload };
    default:
      return state;
  }
};

// Utility function to handle errors and reset status
const handleAsyncError = (error, dispatch) => {
  console.error(error);
  dispatch({ type: SET_STATUS, payload: 'idle' });
  throw error;
};

// Provider component to supply session user state and actions
export const SessionUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const checkPasswordAsync = async (password) => {
    dispatch({ type: SET_STATUS, payload: 'loading' });
    try {
      const response = await checkPasswordOnServerAsync(password);
      if (response.data === 'PasswordOk') {
        dispatch({ type: SET_IS_IDENTIFIED, payload: true });
        return 'PasswordOk';
      } else {
        alert('Wrong password, please try again.');
        return 'PasswordIncorrect';
      }
    } catch (error) {
      handleAsyncError('Error checking password:', error, dispatch);
    } finally {
      dispatch({ type: SET_STATUS, payload: 'idle' });
    }
  };

  const logOutAsync = async () => {
    dispatch({ type: SET_STATUS, payload: 'loading' });
    try {
      const response = await logOutUserAsync();
      if (response.data === 'userLoggedOut' || response.data === 'userAlreadyLoggedOut') {
        dispatch({ type: SET_IS_IDENTIFIED, payload: false });
        return response.data;
      } else {
        alert(`Unexpected server response: ${response.data}`);
        return 'Error';
      }
    } catch (error) {
      handleAsyncError('Error logging out:', error, dispatch);
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
