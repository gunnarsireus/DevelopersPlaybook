import React, { createContext, useContext, useReducer } from 'react';

// Define initial state
const initialState = {
  loading: false,
  // Add other global states here
};

// Define actions
const SET_LOADING = 'SET_LOADING';

// Create the context
const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

// Reducer function
const globalReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    // Add other cases here
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

// Global provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

// Custom hooks to use global state and dispatch
export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);
