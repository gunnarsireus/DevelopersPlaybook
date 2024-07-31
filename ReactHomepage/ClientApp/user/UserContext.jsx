import React, { createContext, useContext, useReducer } from 'react';
import { checkPasswordOnServerAsync, logOutUserAsync } from './userAPI';

// Create the context
const UserContext = createContext();

// Define the initial state
const initialState = {
  isIdentified: false,
  status: 'idle',
};

// Define the reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_IS_IDENTIFIED':
      return { ...state, isIdentified: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    default:
      return state;
  }
};

// Create the provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const checkPasswordAsync = async (password) => {
    dispatch({ type: 'SET_STATUS', payload: 'loading' });
    try {
      const response = await checkPasswordOnServerAsync(password);
      if (response.data === 'PasswordOk') {
        dispatch({ type: 'SET_IS_IDENTIFIED', payload: true });
        return 'PasswordOk';
      } else {
        const message = 'Wrong password, please try again.';
        alert(message);
        return 'PasswordIncorrect';
      }
    } catch (error) {
      console.error('Error checking password:', error);
      dispatch({ type: 'SET_STATUS', payload: 'idle' });
      throw error;
    } finally {
      dispatch({ type: 'SET_STATUS', payload: 'idle' });
    }
  };

  const logOutAsync = async () => {
    dispatch({ type: 'SET_STATUS', payload: 'loading' });
    try {
      const response = await logOutUserAsync();
      if (response.data === 'userLoggedOut' || response.data === 'userAlreadyLoggedOut') {
        dispatch({ type: 'SET_IS_IDENTIFIED', payload: false });
        return response.data;
      } else {
        alert("Konstigt svar från server: ", response.data);
        return 'Error';
      }
    } catch (error) {
      console.error('Error logging out:', error);
      dispatch({ type: 'SET_STATUS', payload: 'idle' });
      throw error;
    } finally {
      dispatch({ type: 'SET_STATUS', payload: 'idle' });
    }
  };

  return (
    <UserContext.Provider value={{ state, dispatch, checkPasswordAsync, logOutAsync }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};
