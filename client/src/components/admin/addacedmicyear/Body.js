import React, { useEffect, useState, useRef } from "react";
import {
  Engineering as EngineeringIcon,
  Clear,
  Send,
  Today,
  Subject,
  People,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createNotice } from "../../../redux/actions/adminActions";
import {
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
} from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { CREATE_NOTICE, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef();

  const [value, setValue] = useState({
    date: "",
    noticeFor: "",
    topic: "",
    content: "",
    from: "",
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
    dispatch(createNotice(value));
  };

  const resetForm = () => {
    setValue({
      date: "",
      noticeFor: "",
      topic: "",
      content: "",
      from: "",
    });
    setError({});
  };

  useEffect(() => {
    if (store.errors || store.admin.noticeCreated) {
      setLoading(false);
      if (store.admin.noticeCreated) {
        resetForm();
        dispatch({ type: CREATE_NOTICE, payload: false });
        dispatch({ type: SET_ERRORS, payload: {} });
      }
    }
  }, [store.errors, store.admin.noticeCreated, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <EngineeringIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">
            Create Acedmic Year
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-5">
                <Typography
                  variant="h6"
                  className="text-gray-700 mb-4 flex items-center"
                >
                  <Today className="text-indigo-600 mr-2" />
                  Add
                </Typography>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Subject className="text-gray-500 mr-2" fontSize="small" />
                    Name
                  </label>
                  <input
                    placeholder="Enter Name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.topic}
                    onChange={(e) =>
                      setValue({ ...value, topic: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Today className="text-gray-500 mr-2" fontSize="small" />
                    Start Date
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="date"
                    value={value.date}
                    onChange={(e) =>
                      setValue({ ...value, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Today className="text-gray-500 mr-2" fontSize="small" />
                    End Date
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="date"
                    value={value.date}
                    onChange={(e) =>
                      setValue({ ...value, date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <People className="text-gray-500 mr-2" fontSize="small" />
                    Is current
                  </label>
                  <FormControl fullWidth>
                    <Select
                      required
                      value={value.noticeFor}
                      onChange={(e) =>
                        setValue({ ...value, noticeFor: e.target.value })
                      }
                      sx={{
                        borderRadius: "8px",
                        height: "42px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d1d5db",
                        },
                      }}
                    >
                      <MenuItem value="">Select option</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="space-y-5">
                <Typography
                  variant="h6"
                  className="text-gray-700 mb-4 flex items-center"
                >
                  <Subject className="text-indigo-600 mr-2" />
                  Notice Content
                </Typography>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={10}
                    required
                    placeholder="Enter notice content..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={value.content}
                    onChange={(e) =>
                      setValue({ ...value, content: e.target.value })
                    }
                  />
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
                startIcon={<Send />}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    message="Creating Notice..."
                    height={24}
                    width={120}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Acedmic Year"
                )}
              </Button>
            </div>

            {/* Error Display */}
            <div ref={errorRef}>
              {(error.noticeError || error.backendError) && (
                <Box className="mt-4 p-3 bg-red-50 rounded-lg">
                  <Typography className="text-red-600 text-sm">
                    {error.noticeError || error.backendError}
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
