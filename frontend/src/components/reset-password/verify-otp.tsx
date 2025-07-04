import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Key, ArrowRight } from 'lucide-react';

import { verifyOtpSchemaForgetPassword, type VerifyOtpFormDataForgetPassword } from '../../schemas/reset-password-schema';
import { authService } from '../../lib/auth-api';

export const VerifyResetOtpForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormDataForgetPassword>({
    resolver: zodResolver(verifyOtpSchemaForgetPassword),
    defaultValues: { email: email || '' },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpFormDataForgetPassword) =>
      authService.verifyOTP(data.email, data.otp),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/reset-password', { state: { email } });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
    },
  });

  const onSubmit = (data: VerifyOtpFormDataForgetPassword) => {
    verifyOtpMutation.mutate(data);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6">
        <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-gray-200 text-center">
          <h2 className="text-3xl font-bold mb-4">Invalid Request</h2>
          <p className="text-gray-600 mb-6">
            Your password reset request is invalid or expired. Please try again.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Reset Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center rounded-full bg-indigo-100 w-16 h-16 mb-4">
            <Key className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-center">Verify Your Email</h2>
          <p className="text-gray-600 text-center mt-2">
            We’ve sent a 6-digit code to{' '}
            <span className="font-semibold text-indigo-600">{email}</span>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('email')} />

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('otp')}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter 6-digit code"
              />
            </div>
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 focus:ring-4 focus:ring-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {verifyOtpMutation.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <ArrowRight className="h-5 w-5 text-white" />
                </span>
                Verify Code
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Didn’t receive the code? Try again
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
