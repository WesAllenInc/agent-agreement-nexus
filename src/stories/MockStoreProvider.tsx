import { ReactNode, createContext, useContext } from 'react';

// Create a generic type for store data
type StoreData = Record<string, any>;

// Create a context with a default empty object
const MockStoreContext = createContext<StoreData>({});

// Create a provider component that will be used in stories
export const MockStoreProvider = <T extends StoreData>({ 
  children, 
  storeValue 
}: { 
  children: ReactNode; 
  storeValue: T;
}) => (
  <MockStoreContext.Provider value={storeValue}>
    {children}
  </MockStoreContext.Provider>
);

// Create a hook to access the mock store data
export const useMockStore = <T extends StoreData>(): T => {
  return useContext(MockStoreContext) as T;
};
