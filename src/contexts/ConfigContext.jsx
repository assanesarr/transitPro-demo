import React, { createContext, useContext } from 'react';
import { useConfig } from '../hooks/useConfig';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const configHook = useConfig();
  
  return (
    <ConfigContext.Provider value={configHook}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => useContext(ConfigContext);