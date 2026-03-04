import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { login, clearError } from '../../services/user/userSlice';
import AuthForm from '../../components/auth/AuthForm';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (
    { name, password }: { name: string; password: string }
  ): Promise<boolean> => {
    dispatch(clearError());
    try {
      await dispatch(login({ name, password })).unwrap();
      void navigate('/');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthForm
      title="Login"
      submitLabel="Login"
      loadingLabel="Logging in..."
      status={status}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginPage;
