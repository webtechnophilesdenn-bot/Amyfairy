import { useSelector, useDispatch } from "react-redux";
import {
  resetUserError,
  resetUser,
  selectAuthError,
  selectLoggedInUser,
  resetSignupDone,
} from "../authSlice";
import { Link, Navigate } from "react-router-dom";
import { logginUserAsync } from "../authSlice";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const user = useSelector(selectLoggedInUser);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(resetUser());
    dispatch(resetSignupDone());
    dispatch(resetUserError());
  }, [dispatch]);

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
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
                  Welcome Back
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Sign in to continue your shopping journey and explore our exclusive collection.
                </p>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    <span>Access your saved wishlist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    <span>Track your orders easily</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    <span>Faster checkout experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-200 p-6 sm:p-8">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-6">
                <img
                  className="h-12 w-auto mx-auto mb-3"
                  src="../../../logo.png"
                  alt="AmiFairy"
                />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:block mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  Sign In
                </h2>
                <p className="text-sm text-gray-600">Access your account</p>
              </div>

              <form
                noValidate
                onSubmit={handleSubmit((data) => {
                  dispatch(resetUserError());
                  dispatch(
                    logginUserAsync({ email: data.email, password: data.password })
                  );
                })}
                className="space-y-5"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                          message: "Please enter a valid email",
                        },
                      })}
                      type="email"
                      placeholder="you@example.com"
                      className="block w-full pl-10 pr-3 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <span>•</span> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      id="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-purple-400 hover:text-purple-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-purple-400 hover:text-purple-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <span>•</span> {errors.password.message}
                    </p>
                  )}
                  {error && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <span>•</span> {error.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-lg"
                  >
                    Sign In
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Don't have an account?
                    </span>
                  </div>
                </div>
              </div>

              {/* Signup Link */}
              <div className="mt-6">
                <Link
                  to="/signup"
                  className="w-full flex justify-center items-center py-3 px-4 border-2 border-purple-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                >
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
