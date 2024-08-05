import React, { createContext, useContext, useReducer } from 'react';
import { checkPasswordOnServerAsync, logOutUserAsync } from './userAPI';
import { useGlobalState, useGlobalDispatch } from '../GlobalState';

// Create a context for the session user state
const SessionUserContext = createContext();

// Define the initial state of the session user
const initialState = {
  isAuthorized: false,
  token: null, // To store JWT token
};

// Define action types for better maintainability
const SET_IS_AUTHORIZED = 'SET_IS_AUTHORIZED';
const SET_TOKEN = 'SET_TOKEN';

// Reducer function to manage the session user state
const sessionUserReducer = (state, action) => {
  switch (action.type) {
    case SET_IS_AUTHORIZED:
      return { ...state, isAuthorized: action.payload };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export const SessionUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionUserReducer, initialState);
  const globalDispatch = useGlobalDispatch();

  const checkPasswordAsync = async (password) => {
    globalDispatch({ type: 'SET_LOADING', payload: true });
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
      console.error(error);
      throw error;
    } finally {
      globalDispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logOutAsync = async () => {
    globalDispatch({ type: 'SET_LOADING', payload: true });
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
      console.error(error);
      throw error;
    } finally {
      globalDispatch({ type: 'SET_LOADING', payload: false });
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
