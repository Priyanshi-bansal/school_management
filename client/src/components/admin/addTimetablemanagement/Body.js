import React, { useEffect, useState } from "react";
import {
  Add as AddIcon,
  AccessTime as TimeIcon,
  Numbers as NumbersIcon,
  Clear
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addFaculty } from "../../../redux/actions/adminActions";
import {
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { ADD_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    periodNumber: "",
    isBreak: false,
    breakName: "",
    description: ""
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addFaculty(value));
  };

  const resetForm = () => {
    setValue({
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      periodNumber: "",
      isBreak: false,
      breakName: "",
      description: ""
    });
    setError({});
  };

  useEffect(() => {
    if (store.errors || store.admin.facultyAdded) {
      setLoading(false);
      if (store.admin.facultyAdded) {
        resetForm();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_FACULTY, payload: false });
      }
    }
  }, [store.errors, store.admin.facultyAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Add New Schedule</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Start Time and End Time */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <TimeIcon className="text-gray-500 mr-2" fontSize="small" />
                  Start Time
                </label>
                <input
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="time"
                  value={value.startTime}
                  onChange={(e) =>
                    setValue({ ...value, startTime: e.target.value })
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <TimeIcon className="text-gray-500 mr-2" fontSize="small" />
                  End Time
                </label>
                <input
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="time"
                  value={value.endTime}
                  onChange={(e) =>
                    setValue({ ...value, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Period and Break Checkboxes */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <NumbersIcon className="text-gray-500 mr-2" fontSize="small" />
                  Period Number
                </label>
                <input
                  placeholder="Enter period number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="number"
                  value={value.periodNumber}
                  onChange={(e) =>
                    setValue({ ...value, periodNumber: e.target.value })
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Is Break Period:
                </label>
                <div className="flex space-x-6 mt-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.isBreak === true}
                        onChange={() =>
                          setValue({ ...value, isBreak: true })
                        }
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.isBreak === false}
                        onChange={() =>
                          setValue({ ...value, isBreak: false })
                        }
                      />
                    }
                    label="No"
                  />
                </div>
              </div>
            </div>

            {/* Break Name Field */}
            {value.isBreak && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break Name
                  </label>
                  <input
                    placeholder="Enter break name (e.g. Morning, Lunch)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.breakName}
                    onChange={(e) =>
                      setValue({ ...value, breakName: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button variant="outlined" startIcon={<Clear />} onClick={resetForm}>
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
                    message="Adding Schedule..."
                    height={24}
                    width={140}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Add Schedule"
                )}
              </Button>
            </div>

            {/* Error Message */}
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
    </div>
  );
};

export default Body;
