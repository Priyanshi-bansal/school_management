
import React, { useEffect, useState } from "react";
import {
 Edit as EditIcon,
  Cake,
  School,
  Image,
  Clear
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addFaculty } from "../../../redux/actions/adminActions";
import {
  Button,
  Avatar,
  Box,
  Typography,
  TextField
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
    numericValue: "",
    academic: "",
    capacity: "",
    description: "",
    avatar: ""
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
      numericValue: "",
      academic: "",
      capacity: "",
      description: "",
      avatar: ""
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
          <EditIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Class</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  placeholder="Enter class name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="text"
                  value={value.name}
                  onChange={(e) => setValue({ ...value, name: e.target.value })}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Cake className="text-gray-500 mr-2" fontSize="small" />
                  Numeric Value
                </label>
                <input
                  placeholder="e.g., 2024"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="number"
                  value={value.numericValue}
                  onChange={(e) =>
                    setValue({ ...value, numericValue: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Cake className="text-gray-500 mr-2" fontSize="small" />
                  Academic Year
                </label>
                <input
                  placeholder="e.g., 2024"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="number"
                  value={value.academic}
                  onChange={(e) =>
                    setValue({ ...value, academic: e.target.value })
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  placeholder="Enter capacity"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="number"
                  value={value.capacity}
                  onChange={(e) =>
                    setValue({ ...value, capacity: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <School className="text-gray-500 mr-2" fontSize="small" />
                Description
              </label>

              <TextField
                required
                fullWidth
                placeholder="Enter class description"
                value={value.description}
                onChange={(e) =>
                  setValue({ ...value, description: e.target.value })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    height: '160px',          // custom height
                    alignItems: 'flex-start', // align text at top
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366f1',
                  },
                }}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={resetForm}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<EditIcon />}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    message="Adding Class..."
                    height={24}
                    width={140}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Edit Class"
                )}
              </Button>
            </div>

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
