import React, { useEffect, useState } from "react";
import { 
  Add as AddIcon,
  School as DepartmentIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { 
  addDepartment, 
  deleteDepartment,
  getAllDepartment
} from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { ADD_DEPARTMENT, SET_ERRORS } from "../../../redux/actionTypes";
import { 
  Button, 
  Avatar, 
  TextField, 
  Box, 
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@mui/material";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [localDepartments, setLocalDepartments] = useState([]);
  const store = useSelector((state) => state);
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment) || [];

  // Initialize and update local departments state
  useEffect(() => {
    setLocalDepartments(departments);
  }, [departments]);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
    }
  }, [store.errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    if (!department.trim()) {
      setError({ departmentError: "Department name cannot be empty" });
      return;
    }
    setLoading(true);
    await dispatch(addDepartment({ department }));
    setDepartment("");
    // Immediately add to local state before refresh
    setLocalDepartments(prev => [
      ...prev,
      { _id: Date.now().toString(), department } // Temporary ID until real one comes
    ]);
  };

  const handleDelete = async (dept) => {
    if (window.confirm(`Are you sure you want to delete ${dept.department}?`)) {
      await dispatch(deleteDepartment(dept._id));
      // Immediately remove from local state
      setLocalDepartments(prev => prev.filter(d => d._id !== dept._id));
    }
  };

  const refreshDepartments = () => {
    dispatch(getAllDepartment());
  };

  useEffect(() => {
    if (store.errors || store.admin.departmentAdded) {
      setLoading(false);
      if (store.admin.departmentAdded) {
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_DEPARTMENT, payload: false });
        // Refresh to get the actual ID from server
        refreshDepartments();
      }
    }
  }, [store.errors, store.admin.departmentAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    refreshDepartments();
  }, []);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <DepartmentIcon className="text-indigo-600 mr-3" fontSize="large" />
            <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
          </div>
          <IconButton onClick={refreshDepartments} className="text-gray-500 hover:text-indigo-600">
            <RefreshIcon />
          </IconButton>
        </div>

        {/* Add Department Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <AddIcon className="text-green-600 mr-2" />
              Add New Department
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="flex items-start space-x-4">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter department name"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  error={!!error.departmentError}
                  helperText={error.departmentError}
                  InputProps={{
                    startAdornment: (
                      <DepartmentIcon className="text-gray-500 mr-2" fontSize="small" />
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-green-600 hover:bg-green-700 h-[56px] min-w-[100px]"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner
                      message="Adding..."
                      height={24}
                      width={80}
                      color="#ffffff"
                      messageColor="#ffffff"
                    />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Department List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Existing Departments ({localDepartments.length})
              </h2>
            </div>
            
            {localDepartments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No departments added yet
              </div>
            ) : (
              <List className="divide-y">
                {localDepartments.map((dept) => (
                  <React.Fragment key={dept._id}>
                    <ListItem className="hover:bg-gray-50">
                      <ListItemAvatar>
                        <Avatar className="bg-indigo-100 text-indigo-600">
                          <DepartmentIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography className="font-medium">
                            {dept.department}
                          </Typography>
                        }
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(dept)}
                        size="small"
                      >
                        Delete
                      </Button>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error.backendError && (
          <Box className="mt-4 p-3 bg-red-50 rounded-lg">
            <Typography className="text-red-600 text-sm">
              {error.backendError}
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default Body;