import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';

import { verifyOtpSchema, type VerifyOtpFormData } from '../../schemas/authSchemas';
import { authService } from '../../lib/auth-api';

export const VerifyOtpForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, email } = location.state || {};

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { userId: userId || '' },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
    },
  });

  const onSubmit = (data: VerifyOtpFormData) => {
    verifyOtpMutation.mutate(data);
  };

  if (!userId || !email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6">
        <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-gray-200 text-center">
          <h2 className="text-3xl font-bold mb-4">Invalid Verification Link</h2>
          <p className="text-gray-600 mb-6">
            Your verification link is invalid or expired. Please start the signup process again.
          </p>
          <a
            href="/signup"
            className="inline-block py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Go to Signup
          </a>
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
            We’ve sent a 6-digit verification code to <span className="font-semibold">{email}</span>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('userId')} />

          <div>
            <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              {...register('otpCode')}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition outline-none bg-gray-50 text-gray-800"
              placeholder="Enter 6-digit code"
            />
            {errors.otpCode && (
              <p className="text-sm text-red-600 mt-1">{errors.otpCode.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 focus:ring-4 focus:ring-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifyOtpMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
