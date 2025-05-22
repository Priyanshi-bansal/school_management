import React, { useEffect, useState, useRef } from "react";
import { 
  Add as AddIcon,
  Clear,
  Assignment,
  Book,
  CalendarToday,
  Class,
  School,
  Numbers
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createTest } from "../../../redux/actions/facultyActions";
import { 
  Select, 
  MenuItem, 
  Button, 
  TextField, 
  Box, 
  Typography,
  FormControl,
  Divider
} from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { ADD_TEST, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef();

  const [value, setValue] = useState({
    subjectCode: "",
    section: "",
    year: "",
    test: "",
    totalMarks: "",
    date: "",
    department: user.result.department,
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      errorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(createTest(value));
  };

  const resetForm = () => {
    setValue({
      subjectCode: "",
      section: "",
      year: "",
      test: "",
      totalMarks: "",
      date: "",
      department: user.result.department,
    });
    setError({});
  };

  useEffect(() => {
    if (store.errors || store.faculty.testAdded) {
      setLoading(false);
      if (store.faculty.testAdded) {
        resetForm();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_TEST, payload: false });
      }
    }
  }, [store.errors, store.faculty.testAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Create New Test</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Test Information */}
              <div className="space-y-5">
                <Typography variant="h6" className="text-gray-700 mb-4 flex items-center">
                  <Assignment className="text-indigo-600 mr-2" />
                  Test Details
                </Typography>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Assignment className="text-gray-500 mr-2" fontSize="small" />
                    Test Name
                  </label>
                  <input
                    placeholder="Enter test name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.test}
                    onChange={(e) => setValue({ ...value, test: e.target.value })}
                  />
                  {error.testError && (
                    <p className="text-red-500 text-xs mt-1">{error.testError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Book className="text-gray-500 mr-2" fontSize="small" />
                    Subject Code
                  </label>
                  <input
                    placeholder="Enter subject code"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.subjectCode}
                    onChange={(e) => setValue({ ...value, subjectCode: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <School className="text-gray-500 mr-2" fontSize="small" />
                    Department
                  </label>
                  <input
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    type="text"
                    value={user.result.department}
                  />
                </div>
              </div>

              {/* Right Column - Academic Information */}
              <div className="space-y-5">
                <Typography variant="h6" className="text-gray-700 mb-4 flex items-center">
                  <Class className="text-indigo-600 mr-2" />
                  Academic Information
                </Typography>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <FormControl fullWidth>
                      <Select
                        required
                        value={value.year}
                        onChange={(e) => setValue({ ...value, year: e.target.value })}
                        sx={{
                          borderRadius: '8px',
                          height: '42px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section
                    </label>
                    <FormControl fullWidth>
                      <Select
                        required
                        value={value.section}
                        onChange={(e) => setValue({ ...value, section: e.target.value })}
                        sx={{
                          borderRadius: '8px',
                          height: '42px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Numbers className="text-gray-500 mr-2" fontSize="small" />
                      Total Marks
                    </label>
                    <input
                      placeholder="Enter total marks"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="number"
                      value={value.totalMarks}
                      onChange={(e) => setValue({ ...value, totalMarks: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <CalendarToday className="text-gray-500 mr-2" fontSize="small" />
                      Date
                    </label>
                    <input
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="date"
                      value={value.date}
                      onChange={(e) => setValue({ ...value, date: e.target.value })}
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
                    message="Creating Test..."
                    height={24}
                    width={120}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Create Test"
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