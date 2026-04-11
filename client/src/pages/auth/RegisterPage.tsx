import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { register, clearError } from '../../services/user/userSlice';
import AuthForm from '../../components/auth/AuthForm';

const getSafeRedirectTarget = (redirect: string | null): string => {
  if (!redirect) {
    return '/';
  }

  if (redirect.startsWith('/')) {
    return redirect;
  }

  return '/';
};

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());

    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (
    { name, email, password }: { name: string; email?: string; password: string }
  ): Promise<boolean> => {
    dispatch(clearError());
    try {
      await dispatch(register({ name, email, password })).unwrap();
      const redirect = getSafeRedirectTarget(searchParams.get('redirect'));
      void navigate(redirect);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthForm
      title="Create an account"
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
