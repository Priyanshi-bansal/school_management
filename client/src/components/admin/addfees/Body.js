import React, { useEffect, useState } from "react";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Cake,
  School,
  Clear
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addFaculty } from "../../../redux/actions/adminActions";
import {
  Button,
  Box,
  Typography,
  TextField,
  IconButton
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
    feeComponents: [{ name: "", amount: "" }], // Changed from description to feeComponents
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
      class: "",
      academic: "",
      feeComponents: [{ name: "", amount: "" }],
      avatar: ""
    });
    setError({});
  };

  // Handle adding new fee component
  const addFeeComponent = () => {
    setValue({
      ...value,
      feeComponents: [...value.feeComponents, { name: "", amount: "" }]
    });
  };

  // Handle removing fee component
  const removeFeeComponent = (index) => {
    const newComponents = [...value.feeComponents];
    newComponents.splice(index, 1);
    setValue({
      ...value,
      feeComponents: newComponents
    });
  };

  // Handle fee component field changes
  const handleFeeComponentChange = (index, field, fieldValue) => {
    const newComponents = [...value.feeComponents];
    newComponents[index][field] = fieldValue;
    setValue({
      ...value,
      feeComponents: newComponents
    });
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
          <h1 className="text-2xl font-bold text-gray-800">Add New Fees</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <input
                  placeholder="Enter class"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  type="text"
                  value={value.class}
                  onChange={(e) => setValue({ ...value, class: e.target.value })}
                />
              </div>
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
            </div>

            {/* Fee Components Section */}
           <div>
  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
    <School className="text-gray-500 mr-2" fontSize="small" />
    Components
  </label>

  {/* ⬇️ Apply spacing here */}
  <div className="space-y-4">
    {value.feeComponents.map((component, index) => (
      <div key={index} className="grid grid-cols-12 gap-4 pb-5">
        <div className="col-span-5">
          <TextField
            fullWidth
            size="small"
            label=" Name"
            placeholder="e.g., Tuition Fee"
            value={component.name}
            onChange={(e) =>
              handleFeeComponentChange(index, "name", e.target.value)
            }
            required
          />
        </div>
        <div className="col-span-5">
          <TextField
            fullWidth
            size="small"
            label="Amount"
            placeholder="e.g., 5000"
            type="number"
            value={component.amount}
            onChange={(e) =>
              handleFeeComponentChange(index, "amount", e.target.value)
            }
            required
          />
        </div>
        <div className="col-span-2 flex space-x-2">
          {index === value.feeComponents.length - 1 && (
            <IconButton
              color="primary"
              onClick={addFeeComponent}
              aria-label="add component"
            >
              <AddIcon />
            </IconButton>
          )}
          {value.feeComponents.length > 1 && (
            <IconButton
              color="error"
              onClick={() => removeFeeComponent(index)}
              aria-label="remove component"
            >
              <RemoveIcon />
            </IconButton>
          )}
        </div>
      </div>
    ))}
  </div>
</div>



            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                variant="contained"
                startIcon={<Clear />}
                onClick={resetForm}
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
                    message="Adding Class..."
                    height={24}
                    width={140}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Add Fees"
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