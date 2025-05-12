import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { adminSignIn } from "../../../redux/actions/adminActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../utils/Spinner";
import { Link } from "react-router-dom";
 
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
 
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});
 
const defaultValues = {
  username: "",
  password: "",
};
 
const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
 
  const onSubmit = ({ username, password }) => {
    setLoading(true);
    dispatch(adminSignIn({ username, password }, navigate));
  };
 
  return (
    <div

    className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-cover bg-center relative px-4 sm:px-6 lg:px-8"
    style={{ backgroundImage: "url('/asset/top.avif')" }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
  
    <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="/asset/top.avif"
          alt="Admin background"
          className="h-full w-full object-cover"
        />
      </div>
  
      {/* Right Panel */}
      <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Admin Login</h2>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
          Please login to your account
        </p>
  
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 sm:mt-10 flex flex-col gap-6">
          {/* Username */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-600">Username</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full px-4 py-3 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    errors.username ? "border border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>
  
          {/* Password */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-600">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityIcon className="text-gray-500" />
                    ) : (
                      <VisibilityOffIcon className="text-gray-500" />
                    )}
                  </div>
                </div>
              )}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
  
          <button
            type="submit"
            className="w-full px-4 py-3 mt-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Login
          </button>
  
          {loading && (
            <div className="flex justify-center mt-2">
              <Spinner
                message="Logging In..."
                height={30}
                width={150}
                color="#000000"
                messageColor="#000"
              />
            </div>
          )}
        </form>
  
        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register/admin-register" className="text-yellow-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
};
 
export default AdminLogin;