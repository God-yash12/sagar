import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

import { signupSchema, type SignupFormData } from "../../schemas/authSchemas";
import { authService } from "../../lib/auth-api";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const checkPasswordStrength = (password: string, username: string, fullName: string) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  const containsUsername = Boolean(username && password.toLowerCase().includes(username.toLowerCase()));
  const containsFullName = Boolean(fullName && fullName.split(' ').some(name => 
    name.length > 2 && password.toLowerCase().includes(name.toLowerCase())
  ));

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpperCase) score++;
  if (hasLowerCase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;
  if (!containsUsername && !containsFullName) score++;

  return {
    strength: score < 3 ? 'Weak' : score < 5 ? 'Medium' : 'Strong',
    strengthColor: score < 3 ? 'red' : score < 5 ? 'orange' : 'green',
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    containsUsername,
    containsFullName,
  };
};

export const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(() => checkPasswordStrength("", "", ""));
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/verify-otp", { state: { userId: data.data.userId, email: data.data.email } });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      recaptchaRef.current?.reset();
      setRecaptchaToken("");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate({ ...data, recaptchaToken });
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token || "");
    setValue("recaptchaToken", token || "");
  };

  // Live watch for password, username, and full name
  const passwordValue = watch("password", "");
  const usernameValue = watch("username", "");
  const fullNameValue = watch("fullName", "");

  React.useEffect(() => {
    setPasswordStrength(checkPasswordStrength(passwordValue, usernameValue, fullNameValue));
  }, [passwordValue, usernameValue, fullNameValue]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-gray-200">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-8">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition outline-none bg-gray-50 text-gray-800"
            />
            {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition outline-none bg-gray-50 text-gray-800"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition outline-none bg-gray-50 text-gray-800"
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition outline-none bg-gray-50 text-gray-800 pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          {/* Password strength bar */}
          {passwordValue && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-700">Strength:</span>
                <span className={`text-sm font-bold`} style={{ color: passwordStrength.strengthColor }}>
                  {passwordStrength.strength}
                </span>
              </div>
              <div className="h-2 w-full rounded bg-gray-200">
                <div
                  className="h-2 rounded transition-all"
                  style={{
                    width: `${Math.min((passwordStrength.strength === 'Weak' ? 33 : passwordStrength.strength === 'Medium' ? 66 : 100), 100)}%`,
                    backgroundColor: passwordStrength.strengthColor,
                  }}
                ></div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Requirement label="At least 8 characters" met={passwordStrength.hasMinLength} />
                <Requirement label="Uppercase letter" met={passwordStrength.hasUpperCase} />
                <Requirement label="Lowercase letter" met={passwordStrength.hasLowerCase} />
                <Requirement label="Number" met={passwordStrength.hasNumber} />
                <Requirement label="Special character" met={passwordStrength.hasSpecialChar} />
                <Requirement label="Doesn't include username/full name" met={!passwordStrength.containsUsername && !passwordStrength.containsFullName} />
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
            />
          </div>
          {errors.recaptchaToken && (
            <p className="text-sm text-red-600 text-center mt-1">{errors.recaptchaToken.message}</p>
          )}

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 focus:ring-4 focus:ring-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signupMutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Requirement: React.FC<{ label: string; met: boolean }> = ({ label, met }) => (
  <div className="flex items-center gap-1">
    {met ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-400" />}
    <span className={met ? "text-green-600" : "text-gray-600"}>{label}</span>
  </div>
);
