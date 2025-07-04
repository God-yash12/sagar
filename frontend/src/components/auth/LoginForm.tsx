import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

import { loginSchema, type LoginFormData } from '../../schemas/authSchemas';
import { authService } from '../../lib/auth-api';
import { useAuth } from '../../context/AuthContext';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (loginAttempts >= 5) {
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      setIsLocked(true);
      setLockTime(Date.now() + lockDuration);

      const timer = setInterval(() => {
        const remainingTime = lockTime - Date.now();
        if (remainingTime <= 0) {
          setIsLocked(false);
          setLoginAttempts(0);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loginAttempts, lockTime]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { user, accessToken, refreshToken, expiresIn } = data.data;
      login(accessToken, refreshToken, expiresIn, user);
      toast.success(data.message);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      setLoginAttempts((prev) => prev + 1);
      reset({ password: '' });
      recaptchaRef.current?.reset();
      setRecaptchaToken('');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    if (isLocked) {
      toast.error(`Account locked. Try again in ${Math.ceil((lockTime - Date.now()) / (60 * 1000))} minutes.`);
      return;
    }

    loginMutation.mutate({ ...data, recaptchaToken });
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token || '');
    setValue('recaptchaToken', token || '');
  };

  const formatLockTime = () => {
    const remainingSeconds = Math.ceil((lockTime - Date.now()) / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <LogIn className="h-10 w-10 text-indigo-600 mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Sign in to your account</h2>
          <p className="text-gray-500 mt-2">
            Or{' '}
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              create a new account
            </Link>
          </p>
        </div>

        {isLocked && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-lg">
            <p className="text-sm text-red-700">
              Too many failed attempts. Account locked for {formatLockTime()} minutes.
            </p>
          </div>
        )}

        {loginAttempts > 0 && loginAttempts < 5 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg">
            <p className="text-sm text-yellow-700">
              {5 - loginAttempts} attempt{loginAttempts === 4 ? '' : 's'} remaining before account is locked.
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              {...register('identifier')}
              type="text"
              placeholder="Email or Username"
              disabled={isLocked || loginMutation.isPending}
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition outline-none bg-gray-50 text-gray-800"
            />
            {errors.identifier && (
              <p className="text-sm text-red-600 mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              disabled={isLocked || loginMutation.isPending}
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition outline-none bg-gray-50 text-gray-800 pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLocked || loginMutation.isPending}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              onExpired={() => setRecaptchaToken('')}
              onErrored={() => toast.error('reCAPTCHA verification failed')}
            />
          </div>
          {errors.recaptchaToken && (
            <p className="text-sm text-red-600 text-center mt-1">{errors.recaptchaToken.message}</p>
          )}

          <button
            type="submit"
            disabled={isLocked || loginMutation.isPending}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 focus:ring-4 focus:ring-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        <div>
          <p className='text-center mt-5 underline cursor-pointer'><Link to="/reset-password">Forget Password</Link></p>

        </div>
      </div>
    </div>
  );
};
