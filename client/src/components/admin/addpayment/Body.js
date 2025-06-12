import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Clear,
  Payments,
  DateRange,
  Person,
  Assignment,
  Receipt,
  Edit,
  Comment,
  AdminPanelSettings,
} from "@mui/icons-material";

const Spinner = ({ message }) => <span>{message}</span>;

const Body = () => {
  const [value, setValue] = useState({
    studentName: "",
    amountPaid: "",
    paymentDate: "",
    mode: "",
    status: "",
    transactionId: "",
    remark: "",
    createdBy: "",
  });

  const [error, setError] = useState({ backendError: "" });
  const [loading, setLoading] = useState(false);

  const students = ["Alice", "Bob", "Charlie"];
  const modes = ["Cash", "Online", "Cheque"];
  const statuses = ["Paid", "Pending"];
  const remarks = ["Fee for Term 1", "Fee for Books", "Late Payment"];
  const createdByOptions = ["Admin", "Accounts", "Clerk"];

  const resetForm = () => {
    setValue({
      studentName: "",
      amountPaid: "",
      paymentDate: "",
      mode: "",
      status: "",
      transactionId: "",
      remark: "",
      createdBy: "",
    });
    setError({ backendError: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log("Submitted Data:", value);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleChange = (field, val) => {
    setValue({ ...value, [field]: val });
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Payments className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">
            Add Student Payment
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <FormControl fullWidth size="small">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Person className="text-gray-500 mr-2" fontSize="small" />
                  Student Name
                </label>
                <Select
                  required
                  displayEmpty
                  value={value.studentName}
                  onChange={(e) => handleChange("studentName", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select student</em>
                  </MenuItem>
                  {students.map((s, idx) => (
                    <MenuItem key={idx} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Amount Paid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Payments className="text-gray-500 mr-2" fontSize="small" />
                  Amount Paid
                </label>
                <TextField
                  type="number"
                  required
                  fullWidth
                  size="small"
                  placeholder="Enter amount"
                  value={value.amountPaid}
                  onChange={(e) => handleChange("amountPaid", e.target.value)}
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <DateRange className="text-gray-500 mr-2" fontSize="small" />
                  Payment Date
                </label>
                <TextField
                  type="date"
                  required
                  fullWidth
                  size="small"
                  value={value.paymentDate}
                  onChange={(e) => handleChange("paymentDate", e.target.value)}
                />
              </div>

              {/* Mode */}
              <FormControl fullWidth size="small">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Assignment className="text-gray-500 mr-2" fontSize="small" />
                  Mode
                </label>
                <Select
                  required
                  displayEmpty
                  value={value.mode}
                  onChange={(e) => handleChange("mode", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select mode</em>
                  </MenuItem>
                  {modes.map((m, idx) => (
                    <MenuItem key={idx} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status */}
              <FormControl fullWidth size="small">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Receipt className="text-gray-500 mr-2" fontSize="small" />
                  Status
                </label>
                <Select
                  required
                  displayEmpty
                  value={value.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select status</em>
                  </MenuItem>
                  {statuses.map((s, idx) => (
                    <MenuItem key={idx} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Edit className="text-gray-500 mr-2" fontSize="small" />
                  Transaction ID
                </label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter transaction ID"
                  value={value.transactionId}
                  onChange={(e) =>
                    handleChange("transactionId", e.target.value)
                  }
                />
              </div>

              {/* Remark - Dropdown */}
              <FormControl fullWidth size="small">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Comment className="text-gray-500 mr-2" fontSize="small" />
                  Remark
                </label>
                <Select
                  required
                  displayEmpty
                  value={value.remark}
                  onChange={(e) => handleChange("remark", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select remark</em>
                  </MenuItem>
                  {remarks.map((r, idx) => (
                    <MenuItem key={idx} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Created By - Dropdown */}
              <FormControl fullWidth size="small">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <AdminPanelSettings
                    className="text-gray-500 mr-2"
                    fontSize="small"
                  />
                  Created By
                </label>
                <Select
                  required
                  displayEmpty
                  value={value.createdBy}
                  onChange={(e) => handleChange("createdBy", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select user</em>
                  </MenuItem>
                  {createdByOptions.map((c, idx) => (
                    <MenuItem key={idx} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
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
                startIcon={<AddIcon />}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner message="Saving Payment..." />
                ) : (
                  "Save Payment"
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
