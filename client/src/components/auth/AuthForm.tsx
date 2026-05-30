import { useState } from 'react';
import { clsx } from 'clsx';
import { TbArrowBackUp } from "react-icons/tb";
import { Link } from 'react-router';

type AuthFormProps = {
  title: string;
  submitLabel: string;
  loadingLabel: string;
  showEmail?: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  onSubmit: (
    fields: { name: string; email?: string; password: string }
  ) => Promise<boolean>;
};

const inputClass = clsx(
  'w-full rounded-xl border border-white/50 bg-white/85 px-3 py-2.5 text-sm text-slate-800',
  'shadow-sm placeholder:text-slate-400 backdrop-blur-sm transition-all duration-200',
  'focus:border-[var(--color-popup)] focus:outline-none focus:ring-2',
  'focus:ring-[var(--color-popup)]/30'
);

const pageBackgroundClass = clsx(
  'absolute inset-0',
  'bg-[radial-gradient(circle_at_top_left,_var(--color-light),_transparent_55%),',
  'radial-gradient(circle_at_bottom_right,_var(--color-extra-light),_transparent_45%)]'
);

const AuthForm = ({
  title,
  submitLabel,
  loadingLabel,
  showEmail = false,
  status,
  error,
  onSubmit,
}: AuthFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailValue = email.trim() === '' ? undefined : email;
    const success = await onSubmit({ name, email: emailValue, password });
    if (success) {
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden
        px-4 py-8"
    >
      <div className={pageBackgroundClass} />

      <div
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/40
          bg-(--color-medium)/55 p-6 shadow-xl backdrop-blur-md sm:p-8"
      >
        <Link
          to="/"
          className="mb-5 inline-flex items-center rounded-full border border-white/50
            bg-white/70 px-3 py-1 text-sm font-medium text-slate-700
            transition-colors duration-200 hover:bg-white"
        >
          <TbArrowBackUp className="mr-2" />
          Back to home
        </Link>

        <h1 className="mb-2 text-3xl font-semibold text-slate-900">{title}</h1>

        <form className="mx-auto max-w-sm" onSubmit={(e) => void handleSubmit(e)}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-2.5 block text-sm font-medium text-slate-900"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="username"
              autoComplete="on"
              required
            />
          </div>
          {showEmail && (
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2.5 block text-sm font-medium text-slate-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="name@example.com"
                autoComplete="on"
              />
            </div>
          )}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2.5 block text-sm font-medium text-slate-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
              autoComplete="on"
              required
            />
          </div>
          {error && (
            <p
              className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2
                text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className={clsx(
              'w-full rounded-xl border border-transparent bg-(--color-popup) px-4 py-2.5',
              'text-sm font-semibold leading-5 text-white shadow-sm transition-colors duration-200',
              'hover:bg-(--color-extra-dark) focus:outline-none focus:ring-4',
              'focus:ring-(--color-popup)/35 disabled:opacity-50'
            )}
          >
            {status === 'loading' ? loadingLabel : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
