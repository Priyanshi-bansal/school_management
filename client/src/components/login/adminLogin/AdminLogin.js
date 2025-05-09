import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { adminSignIn } from "../../../redux/actions/adminActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../utils/Spinner";

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
  const [translate, setTranslate] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => setTranslate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = ({ username, password }) => {
    setLoading(true);
    dispatch(adminSignIn({ username, password }, navigate));
  };

  return (
    <div className="bg-[#04bd7d] min-h-screen w-full flex flex-col items-center justify-center px-4 py-10">
      <a href="/" className="mb-4">
        <button className="w-32 hover:scale-105 transition duration-150 rounded-lg text-white text-base py-2 bg-[#FF2400]">
          Home
        </button>
      </a>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl w-full">
        {/* Left Panel */}
        <div
          className={`w-full md:w-1/2 h-72 flex items-center justify-center bg-white rounded-3xl shadow-2xl transform transition-transform duration-1000 ${
            translate ? "translate-x-0 md:translate-x-12" : ""
          }`}
        >
          <h1 className="text-[2.5rem] font-bold text-center text-gray-800">
            Admin <br /> Login
          </h1>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`w-full md:w-1/2 bg-[#2c2f35] rounded-3xl shadow-2xl p-8 flex flex-col gap-6 transform transition-transform duration-1000 ${
            translate ? "translate-x-0 md:-translate-x-12" : ""
          }`}
        >
          <h2 className="text-white text-2xl font-semibold text-center">Welcome Back</h2>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-400">Username</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full px-4 py-2 rounded-lg bg-[#515966] text-white outline-none placeholder:text-sm ${
                    errors.username ? "border border-red-500" : "focus:ring-2 focus:ring-green-400"
                  }`}
                />
              )}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-400">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="flex items-center px-4 py-2 rounded-lg bg-[#515966]">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="flex-1 bg-transparent text-white outline-none placeholder:text-sm"
                  />
                  {showPassword ? (
                    <VisibilityIcon
                      onClick={() => setShowPassword(false)}
                      className="cursor-pointer text-white ml-2"
                    />
                  ) : (
                    <VisibilityOffIcon
                      onClick={() => setShowPassword(true)}
                      className="cursor-pointer text-white ml-2"
                    />
                  )}
                </div>
              )}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full md:w-32 mx-auto hover:scale-105 transition duration-150 rounded-lg text-white text-base py-2 bg-[#04bd7d]"
          >
            Login
          </button>

          {/* Spinner */}
          {loading && (
            <div className="flex justify-center mt-4">
              <Spinner
                message="Logging In..."
                height={30}
                width={150}
                color="#ffffff"
                messageColor="#fff"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
