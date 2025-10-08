import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createUserAsync,
  selectAuthError,
  resetUserError,
  resetUser,
  selectSignupDone,
} from "../authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);
  const signupDone = useSelector(selectSignupDone);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(resetUser());
    dispatch(resetUserError());
  }, [dispatch]);

  useEffect(() => {
    if (signupDone) {
      navigate("/login", { replace: true });
    }
  }, [signupDone, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="text-center lg:text-left">
              <img
                className="h-16 w-auto mb-6"
                src="../../../logo.png"
                alt="AmiFairy"
              />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Welcome to AmiFairy
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your magical shopping destination for premium sarees and traditional wear.
              </p>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                  <span>Exclusive collection of premium sarees</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                  <span>Secure and fast checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                  <span>Track your orders in real-time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 p-6">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <img
                className="h-12 w-auto mx-auto mb-3"
                src="../../../logo.png"
                alt="AmiFairy"
              />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Account
              </h2>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                Create Account
              </h2>
              <p className="text-sm text-gray-600">Start your shopping journey</p>
            </div>

            <form
              noValidate
              className="space-y-4"
              onSubmit={handleSubmit((data) => {
                dispatch(
                  createUserAsync({
                    email: data.email,
                    password: data.password,
                    addresses: [],
                    role: "user",
                    name: data.name,
                    phoneNumber: data.number,
                  })
                );
              })}
            >
              {/* Two Column Layout for Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-purple-500" />
                    </div>
                    <input
                      id="name"
                      {...register("name", {
                        required: "Name is required",
                        pattern: {
                          value: /^[A-Za-z\s'-]+$/g,
                          message: "Invalid name",
                        },
                      })}
                      type="text"
                      placeholder="John Doe"
                      className="block w-full pl-9 pr-3 py-2.5 border border-purple-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="number" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-purple-500" />
                    </div>
                    <input
                      id="number"
                      {...register("number", {
                        required: "Phone required",
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/g,
                          message: "Invalid phone",
                        },
                      })}
                      type="tel"
                      placeholder="+91 1234567890"
                      className="block w-full pl-9 pr-3 py-2.5 border border-purple-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  {errors.number && (
                    <p className="mt-1 text-xs text-red-600">{errors.number.message}</p>
                  )}
                </div>
              </div>

              {/* Email Field - Full Width */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-purple-500" />
                  </div>
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^(?!.*\.\.)([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i,
                        message: "Invalid email",
                      },
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="block w-full pl-9 pr-3 py-2.5 border border-purple-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Fields - Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-purple-500" />
                    </div>
                    <input
                      id="password"
                      {...register("password", {
                        required: "Password required",
                        pattern: {
                          value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                          message: "Min 8 chars, 1 upper, 1 lower, 1 number",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="block w-full pl-9 pr-9 py-2.5 border border-purple-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-purple-400 hover:text-purple-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-purple-400 hover:text-purple-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-purple-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      {...register("confirmPassword", {
                        required: "Confirm password",
                        validate: (value, formValues) =>
                          value === formValues.password || "Passwords don't match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="block w-full pl-9 pr-9 py-2.5 border border-purple-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-purple-400 hover:text-purple-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-purple-400 hover:text-purple-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                  {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-lg"
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
