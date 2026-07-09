import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { login } from '@/api/auth';
import { getErrorMessage } from '@/api/client';
import { useAuthStore } from '@/stores/auth-store';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const labelClass =
  'mb-1.5 block text-[11px] font-normal uppercase tracking-[0.15em] text-[#060606]';
const inputClass =
  'w-full border border-[#d0d0cc] bg-white px-3.5 py-3.5 text-[13px] font-light tracking-[0.03em] text-[#060606] outline-none focus:border-[#060606]';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAuth(response.data.token, response.data.user);
      toast.success(response.message || 'Signed in successfully');
      navigate('/');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f3] px-5 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6b6b6b]">
            Admin portal
          </p>
          <h1 className="mt-2 font-serif text-2xl font-medium text-[#060606]">
            Sign in to Tag-It
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Manage users, assignments, and product verification.
          </p>
        </div>

        <div className="border border-[#e8e8e1] bg-white px-7 py-8">
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="space-y-5"
          >
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                className={inputClass}
                {...register('email')}
              />
              {errors.email ? (
                <p className="mt-1.5 text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`${inputClass} pr-16`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#060606] px-4 py-3.5 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#060606]/90 disabled:opacity-60"
            >
              {mutation.isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
