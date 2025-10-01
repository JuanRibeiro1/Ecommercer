import React, { createContext, useContext, useState, useEffect } from 'react';

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter deve ser usado dentro de RouterProvider');
  }
  return context;
};

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [params, setParams] = useState({});

  const navigate = (path, pathParams = {}) => {
    setCurrentPath(path);
    setParams(pathParams);

    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', path);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const RouterContext = createContext();