import clsx from 'clsx';
import { useState } from 'react';
import { registerUser } from '../../services/userService';
import { redirect } from 'react-router';
import axios from 'axios';

type ErrorResponse = {
  error: string;
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  void submitForm();
};

const submitForm = async () => {
  console.log({ name, email, password });
  try {
    await registerUser(name, email, password);
    setName('');
    setEmail(undefined);
    setPassword('');
    redirect('/');
  }
  catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
      const errorMessage: string = error.response.data.error;
      console.error('Registration failed:', errorMessage);
    }
  }
};

  return (
    <div className="flex min-h-screen p-5 items-center justify-center">
      <div className="w-96">
        <h1 className='mb-5'>Create account</h1>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className={clsx(
              "text-white bg-teal-700 box-border border border-transparent hover:bg-teal-800",
              "focus:ring-4 focus:ring-teal-600 shadow-xs font-medium leading-5 rounded-xl",
              "text-sm px-4 py-2.5 focus:outline-none"
            )}>
              Submit
            </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
