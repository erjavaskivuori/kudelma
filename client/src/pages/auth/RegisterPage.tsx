import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { register, clearError } from '../../services/userSlice';
import AuthForm from '../../components/auth/AuthForm';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (
    { name, email, password }: { name: string; email?: string; password: string }
  ): Promise<boolean> => {
    dispatch(clearError());
    try {
      await dispatch(register({ name, email, password })).unwrap();
      void navigate('/');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthForm
      title="Create account"
      submitLabel="Submit"
      loadingLabel="Submitting..."
      showEmail
      status={status}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default RegisterPage;
