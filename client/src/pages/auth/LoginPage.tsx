import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { login, clearError } from '../../services/user/userSlice';
import AuthForm from '../../components/auth/AuthForm';

const getSafeRedirectTarget = (redirect: string | null): string => {
  if (!redirect) {
    return '/';
  }

  // Allow only app-internal absolute paths.
  if (redirect.startsWith('/')) {
    return redirect;
  }

  return '/';
};

const LoginPage = () => {
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
    { name, password }: { name: string; password: string }
  ): Promise<boolean> => {
    dispatch(clearError());
    try {
      await dispatch(login({ name, password })).unwrap();
      const redirect = getSafeRedirectTarget(searchParams.get('redirect'));
      void navigate(redirect);
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
