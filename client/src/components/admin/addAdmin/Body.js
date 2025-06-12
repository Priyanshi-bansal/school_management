import React, { useEffect, useState } from "react";
import {
  Engineering as AdminIcon,
  Person,
  Cake,
  Email,
  Phone,
  School,
  Image,
} from "@mui/icons-material";
import {
  Select,
  MenuItem,
  Button,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { addAdmin } from "../../../redux/actions/adminActions";

import Spinner from "../../../utils/Spinner";
import { ADD_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    joiningYear: new Date().getFullYear().toString(),
    password: "",
    username: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue((prev) => ({ ...prev, email: "" }));
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addAdmin(value));
  };

  useEffect(() => {
    if (store.errors || store.admin.adminAdded) {
      setLoading(false);
      if (store.admin.adminAdded) {
        resetForm();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_ADMIN, payload: false });
      }
    }
  }, [store.errors, store.admin.adminAdded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  const resetForm = () => {
    setValue({
      name: "",
      dob: "",
      email: "",
      department: "",
      contactNumber: "",
      avatar: "",
      joiningYear: new Date().getFullYear().toString(),
      password: "",
      username: "",
    });
    setError({});
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <AdminIcon className="text-indigo-600" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Add New Admin</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <FormField
                icon={<Person fontSize="small" />}
                label="Full Name"
                value={value.name}
                placeholder="Enter full name"
                onChange={(e) => setValue({ ...value, name: e.target.value })}
              />

              <FormField
                icon={<Cake fontSize="small" />}
                label="Date of Birth"
                value={value.dob}
                type="date"
                onChange={(e) => setValue({ ...value, dob: e.target.value })}
              />

              <FormField
                icon={<Email fontSize="small" />}
                label="Email Address"
                value={value.email}
                placeholder="Enter email"
                type="email"
                errorMsg={error.emailError}
                onChange={(e) => setValue({ ...value, email: e.target.value })}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <School className="text-gray-500 mr-2" fontSize="small" />
                  Department
                </label>
                <Select
                  required
                  fullWidth
                  displayEmpty
                  value={value.department}
                  onChange={(e) =>
                    setValue({ ...value, department: e.target.value })
                  }
                  sx={{
                    height: 42,
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d1d5db",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6366f1",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select department</em>
                  </MenuItem>
                  {departments?.map((dp, idx) => (
                    <MenuItem key={idx} value={dp.department}>
                      {dp.department}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <FormField
                icon={<Phone fontSize="small" />}
                label="Contact Number"
                value={value.contactNumber}
                placeholder="Enter phone number"
                type="tel"
                onChange={(e) =>
                  setValue({ ...value, contactNumber: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700  flex items-center">
                  <Image className="text-gray-500 mr-2" fontSize="small" />
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) =>
                        setValue({ ...value, avatar: base64 })
                      }
                    />
                  </div>
                  {value.avatar && (
                    <Avatar
                      src={value.avatar}
                      sx={{ width: 48, height: 48 }}
                      className="border-2 border-white shadow-sm"
                    />
                  )}
                </div>
              </div>
{/* =======
       
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Person className="text-gray-500 mr-2" fontSize="small" />
                    Full Name
                  </label>
                  <input
                    placeholder="Enter full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.name}
                    onChange={(e) =>
                      setValue({ ...value, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Cake className="text-gray-500 mr-2" fontSize="small" />
                    Date of Birth
                  </label>
                  <input
                    placeholder="Select date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="date"
                    value={value.dob}
                    onChange={(e) =>
                      setValue({ ...value, dob: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Email className="text-gray-500 mr-2" fontSize="small" />
                    Email Address
                  </label>
                  <input
                    placeholder="Enter email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="email"
                    value={value.email}
                    onChange={(e) =>
                      setValue({ ...value, email: e.target.value })
                    }
                  />
                  {error.emailError && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.emailError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <School className="text-gray-500 mr-2" fontSize="small" />
                    Department
                  </label>
                  <Select
                    required
                    displayEmpty
                    className="w-full"
                    value={value.department}
                    onChange={(e) =>
                      setValue({ ...value, department: e.target.value })
                    }
                    sx={{
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d5db",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6366f1",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select department</em>
                    </MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="text-gray-500 mr-2" fontSize="small" />
                    Contact Number
                  </label>
                  <input
                    placeholder="Enter phone number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="tel"
                    value={value.contactNumber}
                    onChange={(e) =>
                      setValue({ ...value, contactNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Image className="text-gray-500 mr-2" fontSize="small" />
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) =>
                          setValue({ ...value, avatar: base64 })
                        }
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                      />
                    </div>
                    {value.avatar && (
                      <Avatar
                        src={value.avatar}
                        sx={{ width: 48, height: 48 }}
                        className="border-2 border-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
>>>>>>> c01fec09ca167dfe3c8cf7cac45e9771162a1419 */}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 border-t pt-4 border-gray-200">
            <Button
              variant="outlined"
              onClick={resetForm}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <Spinner
                  message="Creating Admin..."
                  height={24}
                  width={140}
                  color="#ffffff"
                  messageColor="#ffffff"
                />
              ) : (
                "Create Admin"
              )}
            </Button>
          </div>

          {/* Backend Error */}
          {error.backendError && (
            <Box className="mt-4 p-3 bg-red-50 rounded-lg">
              <Typography className="text-red-600 text-sm">
                {error.backendError}
              </Typography>
            </Box>
          )}
        </form>
      </div>
    </div>
  );
};


// Reusable input component
const FormField = ({
  icon,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  errorMsg,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      {icon && <span className="text-gray-500 mr-2">{icon}</span>}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    />
    {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
  </div>
);

export default Body;
