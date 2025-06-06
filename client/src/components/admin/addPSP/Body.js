import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Stack,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import {
  Save,
  ArrowBack,
  CalendarToday,
  Person,
  DateRange,
  Payment,
  Paid,
  MoneyOff,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const paymentModes = ["Cash", "Bank Transfer", "Cheque"];
const statusOptions = ["Approved", "Pending", "Rejected"];

const Body = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    facultyId: "",
    month: "",
    year: "",
    paymentDate: "",
    paymentMode: "",
    status: "Pending",
    earnings: "",
    deductions: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Submitting Salary Payment:", form);
    // Submit logic here...
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Save color="primary" />
          <Typography variant="h5">Add Salary Payment</Typography>
        </Stack>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Back
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          {/* Faculty ID + Payment Date in one row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Faculty ID"
              name="facultyId"
              value={form.facultyId}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Payment Date"
              name="paymentDate"
              type="date"
              value={form.paymentDate}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Month + Year */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select
                name="month"
                value={form.month}
                onChange={handleChange}
                label="Month"
                startAdornment={
                  <InputAdornment position="start">
                    <DateRange />
                  </InputAdornment>
                }
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Year"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Payment Mode + Status */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Mode</InputLabel>
              <Select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                label="Payment Mode"
                startAdornment={
                  <InputAdornment position="start">
                    <Payment />
                  </InputAdornment>
                }
              >
                {paymentModes.map((mode) => (
                  <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                label="Status"
                startAdornment={
                  <InputAdornment position="start">
                      <AssignmentTurnedIn />
                  </InputAdornment>
                }
              >
                {statusOptions.map((st) => (
                  <MenuItem key={st} value={st}>{st}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Earnings + Deductions */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Earnings"
              name="earnings"
              type="number"
              value={form.earnings}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Paid />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Deductions"
              name="deductions"
              type="number"
              value={form.deductions}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyOff />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Body;
