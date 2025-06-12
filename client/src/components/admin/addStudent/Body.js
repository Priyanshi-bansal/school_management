import React, { useEffect, useState, useRef } from "react";
import {
  Add as AddIcon,
  Person,
  Cake,
  Email,
  Phone,
  School,
  Image,
  Transgender,
  FamilyRestroom,
  Clear,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addStudent } from "../../../redux/actions/adminActions";
import {
  Select,
  MenuItem,
  Button,
  Avatar,
  Box,
  Typography,
  FormControl,
  Divider,
} from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { ADD_STUDENT, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef();

  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    batch: "",
    gender: "",
    year: "",
    fatherName: "",
    motherName: "",
    section: "",
    fatherContactNumber: "",
    motherContactNumber: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      errorRef.current.scrollIntoView({ behavior: "smooth" });
      setValue((prev) => ({ ...prev, email: "" }));
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addStudent(value));
  };

  const resetForm = () => {
    setValue({
      name: "",
      dob: "",
      email: "",
      department: "",
      contactNumber: "",
      avatar: "",
      batch: "",
      gender: "",
      year: "",
      fatherName: "",
      motherName: "",
      section: "",
      fatherContactNumber: "",
      motherContactNumber: "",
    });
    setError({});
  };

  useEffect(() => {
    if (store.errors || store.admin.studentAdded) {
      setLoading(false);
      if (store.admin.studentAdded) {
        resetForm();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_STUDENT, payload: false });
      }
    }
  }, [store.errors, store.admin.studentAdded, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">
            Student Registration
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Student Information */}
              <div className="space-y-5">
                <Typography
                  variant="h6"
                  className="text-gray-700 mb-4 flex items-center"
                >
                  <Person className="text-indigo-600 mr-2" />
                  Student Details
                </Typography>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Person className="text-gray-500 mr-2" fontSize="small" />
                    Full Name
                  </label>
                  <input
                    placeholder="Enter student's full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.name}
                    onChange={(e) =>
                      setValue({ ...value, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Cake className="text-gray-500 mr-2" fontSize="small" />
                      Date of Birth
                    </label>
                    <input
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
                      <Transgender
                        className="text-gray-500 mr-2"
                        fontSize="small"
                      />
                      Gender
                    </label>
                    <FormControl fullWidth>
                      <Select
                        required
                        value={value.gender}
                        onChange={(e) =>
                          setValue({ ...value, gender: e.target.value })
                        }
                        sx={{
                          borderRadius: "8px",
                          height: "42px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db",
                          },
                        }}
                      >
                        <MenuItem value="">Select gender</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Email className="text-gray-500 mr-2" fontSize="small" />
                    Email Address
                  </label>
                  <input
                    placeholder="Enter student's email"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Phone className="text-gray-500 mr-2" fontSize="small" />
                      Contact Number
                    </label>
                    <input
                      placeholder="Student's phone"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch (yyyy-yyyy)
                    </label>
                    <input
                      placeholder="e.g. 2022-2026"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                      value={value.batch}
                      onChange={(e) =>
                        setValue({ ...value, batch: e.target.value })
                      }
                    />
                  </div>
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

              {/* Right Column - Academic & Family Information */}
              <div className="space-y-5">
                <Typography
                  variant="h6"
                  className="text-gray-700 mb-4 flex items-center"
                >
                  <School className="text-indigo-600 mr-2" />
                  Academic Information
                </Typography>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Department
                    </label>
                    <FormControl fullWidth>
                      <Select
                        required
                        value={value.department}
                        onChange={(e) =>
                          setValue({ ...value, department: e.target.value })
                        }
                        sx={{
                          borderRadius: "8px",
                          height: "42px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db",
                          },
                        }}
                      >
                        <MenuItem value="">Select department</MenuItem>
                        {departments?.map((dp, idx) => (
                          <MenuItem key={idx} value={dp.department}>
                            {dp.department}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <FormControl fullWidth>
                      <Select
                        required
                        value={value.year}
                        onChange={(e) =>
                          setValue({ ...value, year: e.target.value })
                        }
                        sx={{
                          borderRadius: "8px",
                          height: "42px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db",
                          },
                        }}
                      >
                        <MenuItem value="">Select year</MenuItem>
                        <MenuItem value="1">1st Year</MenuItem>
                        <MenuItem value="2">2nd Year</MenuItem>
                        <MenuItem value="3">3rd Year</MenuItem>
                        <MenuItem value="4">4th Year</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <FormControl fullWidth>
                    <Select
                      required
                      value={value.section}
                      onChange={(e) =>
                        setValue({ ...value, section: e.target.value })
                      }
                      sx={{
                        borderRadius: "8px",
                        height: "42px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d5db",
                        },
                      }}
                    >
                      <MenuItem value="">Select section</MenuItem>
                      <MenuItem value="1">Section 1</MenuItem>
                      <MenuItem value="2">Section 2</MenuItem>
                      <MenuItem value="3">Section 3</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <Divider className="my-4" />

                <Typography
                  variant="h6"
                  className="text-gray-700 mb-4 flex items-center"
                >
                  <FamilyRestroom className="text-indigo-600 mr-2" />
                  Parent Information
                </Typography>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Name
                    </label>
                    <input
                      placeholder="Father's name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                      value={value.fatherName}
                      onChange={(e) =>
                        setValue({ ...value, fatherName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Name
                    </label>
                    <input
                      placeholder="Mother's name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                      value={value.motherName}
                      onChange={(e) =>
                        setValue({ ...value, motherName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Contact
                    </label>
                    <input
                      placeholder="Father's phone"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="tel"
                      value={value.fatherContactNumber}
                      onChange={(e) =>
                        setValue({
                          ...value,
                          fatherContactNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Contact
                    </label>
                    <input
                      placeholder="Mother's phone"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="tel"
                      value={value.motherContactNumber}
                      onChange={(e) =>
                        setValue({
                          ...value,
                          motherContactNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={resetForm}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    message="Registering..."
                    height={24}
                    width={120}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Register Student"
                )}
              </Button>
            </div>

            {/* Error Display */}
            <div ref={errorRef}>
              {error.backendError && (
                <Box className="mt-4 p-3 bg-red-50 rounded-lg">
                  <Typography className="text-red-600 text-sm">
                    {error.backendError}
                  </Typography>
                </Box>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
