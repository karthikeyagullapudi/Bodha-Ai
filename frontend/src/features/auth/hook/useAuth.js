import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../auth.slice';
import { Register, Login, getMe } from '../services/auth.api';

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async (userData) => {
    try {
      dispatch(setLoading(true));
      const response = await Register(userData);
      dispatch(setUser(response.data));
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        error.message;
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const handleLogin = async (userData) => {
    try {
      dispatch(setLoading(true));
      const response = await Login(userData);
      dispatch(setUser(response.data));
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        error.message;
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getMe();
      dispatch(setUser(response.data));
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        error.message;
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      throw error;
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };
};
