import { clsx } from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { register, clearError } from '../../services/userSlice';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());
    const emailValue = email.trim() === '' ? undefined : email;
    try {
      await dispatch(register({ name, email: emailValue, password })).unwrap();
      setName('');
      setEmail('');
      setPassword('');
      void navigate('/');
    } catch {
      // Error is handled by the slice
    }
  };

  return (
    <div className="flex min-h-screen p-5 items-center justify-center">
      <div className="w-96">
        <h1 className='mb-5'>Create account</h1>
        <form className="max-w-sm mx-auto" onSubmit={(e) => void handleSubmit(e)}>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-heading">
              Username
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={clsx(
                "bg-white border border-gray-700 text-gray-900 text-sm",
                "rounded-xl focus:ring-teal-600 focus:border-teal-600 block w-full px-3 py-2.5",
                "shadow placeholder:text-gray-400"
              )}
              placeholder="username"
              autoComplete="on"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={clsx(
                "bg-white border border-gray-700 text-gray-900 text-sm",
                "rounded-xl focus:ring-teal-600 focus:border-teal-600 block w-full px-3 py-2.5",
                "shadow placeholder:text-gray-400"
              )}
              placeholder="name@example.com"
              autoComplete="on"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-heading">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={clsx(
                "bg-white border border-gray-700 text-gray-900 text-sm",
                "rounded-xl focus:ring-teal-600 focus:border-teal-600 block w-full px-3 py-2.5",
                "shadow placeholder:text-gray-400"
              )}
              placeholder="••••••••"
              autoComplete="on"
              required
            />
          </div>
          {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className={clsx(
              "text-white bg-teal-700 box-border border border-transparent hover:bg-teal-800",
              "focus:ring-4 focus:ring-teal-600 shadow-xs font-medium leading-5 rounded-xl",
              "text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50"
            )}>
              {status === 'loading' ? 'Submitting...' : 'Submit'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
