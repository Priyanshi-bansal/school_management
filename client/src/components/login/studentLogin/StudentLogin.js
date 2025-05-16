import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../utils/Spinner";
import { studentSignIn } from "../../../redux/actions/studentActions";
 
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
 
const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
 
const defaultValues = {
  username: "",
  password: "",
};
 
const StudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
 
  const onSubmit = ({ username, password }) => {
    setLoading(true);
 
    dispatch(studentSignIn({ username, password }, navigate));
  };
 
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/asset/bbb.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="absolute top-4 left-4 cursor-pointer text-white" onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </div>
      <div className="relative flex w-3/4 max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Panel */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center">
        <img
          src="/asset/bbb.jpg"
          alt="Admin background"
          className="h-full w-full object-fill"
          style={{ backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
        />
      </div>
 
        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-16">
          <h2 className="text-4xl font-bold text-gray-800">Student Login</h2>
          <p className="mt-4 text-lg text-gray-600">Please login to your account</p>
 
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-8">
            {/* Username */}
            <div>
              <label className="block text-base font-semibold text-gray-600">Username</label>
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
 
            <div>
              <label className="block text-base font-semibold text-gray-600">Password</label>
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
              className="w-full px-4 py-3 mt-6 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Login
            </button>
 
            {loading && (
              <div className="flex justify-center mt-4">
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

          <p className="mt-8 text-sm text-gray-600 text-center">
            Don't have an account? 
            <a href="/register/student-register" className="text-yellow-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default StudentLogin;