import React, {createContext, useState} from 'react';

function returnInitialState(storageKey) {
  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(storageKey);
    // Parse stored json or if none return an empty object
    return item ? JSON.parse(item) : {};
  } catch (error) {
    // If error also return an empty object
    console.log(error);
    return {};
  }
}

function useLocalStorage(storageKey) {
  const [storedValue, setStoredValue] = useState(
    returnInitialState(storageKey)
  );
  
  const setValue = (value) => {
    try {
    // Allow value to be a function so we have same API as useState
      const valueToStore =
      value instanceof Function ? value(storedValue) : value;
      // Save to local storage
      window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
      // Save state
      setStoredValue(valueToStore);
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  
  return [storedValue, setValue]
}

const MyProvider = ({storageKey, children}) => {
  const [state, setState] = useLocalStorage(storageKey)
  return(
    <div>
      <AppContext.Provider value={[state, setState]}>
        {children}
      </AppContext.Provider>
    </div>
  )
}

export default MyProvider;
export const AppContext = createContext();
