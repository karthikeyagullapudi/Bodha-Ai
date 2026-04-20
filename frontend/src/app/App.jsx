import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './app.routes';
import { useAuth } from '../features/auth/hook/useAuth';
import { useEffect } from 'react';

const App = () => {
  const { handleGetMe } = useAuth();
  useEffect(() => {
    handleGetMe().catch((err) => console.log('Auth check:', err.message));
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
