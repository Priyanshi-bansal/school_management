import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAdmin } from "../../../redux/actions/adminActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../utils/Spinner";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// Validation schema
const schema = yup.object({
  dob: yup.string().required("Date of birth is required"),
  name: yup.string().required("Name is required"),
  avatar: yup.mixed().required("Avatar is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters")
    .matches(/(?=.*[A-Z])(?=.*[@])(?=.*\d)/, "Must include @, number, and uppercase letter"),
  department: yup.string().required("Department is required"),
  joiningYear: yup.string().required("Joining year is required"),
  contactNumber: yup
    .string()
    .required("Contact number is required")
    .matches(/^\d+$/, "Only numbers allowed"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const defaultValues = {
  dob: "",
  name: "",
  email: "",
  avatar: "",
  username: "",
  password: "",
  department: "",
  joiningYear: "",
  contactNumber: "",
};

const AdminRegister = () => {
  const [loading, setLoading] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const timer = setTimeout(() => setTranslate(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    const formData = {
      ...data,
      joiningYear: new Date(data.joiningYear).getFullYear(),
    };
    dispatch(addAdmin(formData));
  };

  return (
    <div className="bg-[#04bd7d] min-h-screen w-full flex flex-col items-center justify-center p-6">
      <a href="/" className="mb-6">
        <button className="w-32 hover:scale-105 transition-all duration-150 rounded-lg text-white text-base py-2 bg-[#FF2400]">
          Home
        </button>
      </a>
      <div className="flex flex-col md:flex-row w-full max-w-6xl space-y-8 md:space-y-0 md:space-x-8">
        {/* Left Card */}
        <div
          className={`w-full md:w-1/2 bg-white flex items-center justify-center rounded-3xl shadow-2xl p-10 transform transition-transform duration-1000 ${
            translate ? "translate-x-0 md:translate-x-12" : ""
          }`}
        >
          <h1 className="text-[2.5rem] font-bold text-center text-gray-800 leading-tight">
            Admin <br /> Register
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`w-full md:w-1/2 bg-[#2c2f35] rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-white transform transition-transform duration-1000 ${
            translate ? "translate-x-0 md:-translate-x-8" : ""
          }`}
        >
          <h2 className="col-span-full text-2xl font-semibold text-white mb-2">Admin Registration</h2>

          {/* Input Group Component */}
          {[
            { label: "Name", name: "name", placeholder: "John Doe", type: "text" },
            { label: "Email", name: "email", placeholder: "john@example.com", type: "email" },
            { label: "Username", name: "username", placeholder: "johndoe123", type: "text" },
            { label: "DOB", name: "dob", placeholder: "YYYY-MM-DD", type: "date" },
            { label: "Department", name: "department", placeholder: "Computer Science", type: "text" },
            { label: "Contact Number", name: "contactNumber", placeholder: "9876543210", type: "number" },
            { label: "Joining Year", name: "joiningYear", placeholder: "", type: "date" },
          ].map(({ label, name, placeholder, type }) => (
            <div key={name} className="space-y-1">
              <label className="text-sm font-semibold text-gray-400">{label}</label>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 rounded-lg outline-none bg-[#515966] placeholder:text-sm ${
                      errors[name] ? "border border-red-500" : "focus:ring-2 focus:ring-green-400"
                    }`}
                    {...field}
                  />
                )}
              />
              {errors[name] && (
                <p className="text-red-400 text-xs mt-1">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          {/* Password Field */}
          <div className="space-y-1 relative">
            <label className="text-sm font-semibold text-gray-400">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="flex items-center bg-[#515966] rounded-lg px-3">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`w-full py-2 bg-transparent text-white outline-none placeholder:text-sm ${
                      errors.password ? "border-red-500 border" : ""
                    }`}
                  />
                  {showPassword ? (
                    <VisibilityIcon
                      onClick={() => setShowPassword(false)}
                      className="cursor-pointer text-white"
                    />
                  ) : (
                    <VisibilityOffIcon
                      onClick={() => setShowPassword(true)}
                      className="cursor-pointer text-white"
                    />
                  )}
                </div>
              )}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password?.message}</p>
            )}
          </div>

          {/* Avatar Upload */}
          <div className="col-span-full space-y-1">
            <label className="text-sm font-semibold text-gray-400">Avatar (Image File)</label>
            <Controller
              name="avatar"
              control={control}
              render={({ field: { onChange } }) => (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onChange(reader.result); // Store base64 string
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg bg-[#515966] text-white ${
                    errors.avatar ? "border border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.avatar && (
              <p className="text-red-400 text-xs mt-1">{errors.avatar.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-full flex items-center gap-4 mt-4">
            <button
              type="submit"
              className="w-32 hover:scale-105 transition-all duration-150 rounded-lg text-white text-base py-2 bg-green-500"
            >
              Register
            </button>
            {loading && (
              <Spinner
                message="Registering..."
                height={30}
                width={150}
                color="#ffffff"
                messageColor="#fff"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
