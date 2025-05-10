import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAdmin } from "../../../redux/actions/adminActions";
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
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    const formData = {
      ...data,
      joiningYear: new Date(data.joiningYear).getFullYear(),
    };
    dispatch(addAdmin(formData));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen" style={{ backgroundImage: "url('/asset/top.avif')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Left Side Content */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-white p-8" style={{ backgroundColor: "inherit" }}>
        <h1 className="text-4xl font-bold text-gray-800 mb-2"></h1>
        <p className="text-lg text-gray-600"></p>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8" style={{ backgroundColor: "inherit" }}>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md grid grid-cols-2 gap-4"
        >
          {[{
            label: "Name",
            name: "name",
            placeholder: "Name",
            type: "text",
          },
          {
            label: "Email",
            name: "email",
            placeholder: "Email",
            type: "email",
          },
          {
            label: "DOB",
            name: "dob",
            placeholder: "MM/DD/YYYY",
            type: "date",
          },
          {
            label: "Department",
            name: "department",
            placeholder: "Department",
            type: "text",
          },
          {
            label: "Contact Number",
            name: "contactNumber",
            placeholder: "Contact Number",
            type: "number",
          },
          {
            label: "Password",
            name: "password",
            placeholder: "Password",
            type: "password",
          },
          {
            label: "Joining Year",
            name: "joiningYear",
            placeholder: "Joining Year",
            type: "date",
          },
          {
            label: "Avatar (image File)",
            name: "avatar",
            placeholder: "Choose File",
            type: "file",
          }].map(({ label, name, placeholder, type }) => (
            <div key={name} className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-semibold text-gray-800">{label}</label>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 border rounded-md outline-none bg-gray-50 text-gray-800 placeholder-gray-400 ${
                      errors[name] ? "border-red-500" : "focus:ring-2 focus:ring-green-500"
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

          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;