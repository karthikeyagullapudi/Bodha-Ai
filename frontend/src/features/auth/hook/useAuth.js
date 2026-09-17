import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../auth.slice';
import { resetChats } from '../../chat/chat.slice';
import { Register, Login, getMe, Logout } from '../services/auth.api';

const getErrorMessage = (error) =>
  error.response?.data?.errors?.[0]?.msg ||
  error.response?.data?.message ||
  error.message;

export const useAuth = () => {
  const dispatch = useDispatch();

  const clearError = () => dispatch(setError(null));

  const handleRegister = async (userData) => {
    try {
      clearError();
      dispatch(setLoading(true));
      // Registering doesn't log the user in: they must verify their email
      // first, so the user stays null here
      const response = await Register(userData);
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const handleLogin = async (userData) => {
    try {
      clearError();
      dispatch(setLoading(true));
      const response = await Login(userData);
      dispatch(setUser(response.data));
      dispatch(setLoading(false));
      return response;
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      dispatch(setLoading(false));
      throw error;
    }
  };

  // Session check on page load. A 401 just means "not logged in", so it is
  // not shown as an error on the login page.
  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getMe();
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      dispatch(setUser(null));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      await Logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(setUser(null));
      dispatch(resetChats());
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
};
