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
  AccountBalance,
  Description,
  Work,
  EventAvailable,
  EventBusy,
  Calculate,
  Note,
  Receipt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const paymentModes = ["Cash", "Bank Transfer", "Cheque"];

const Body = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    facultyId: "",
    salaryStructureId: "",
    month: "",
    year: "",
    paymentDate: "",
    paymentMode: "",
    bankDetails: "",
    chequeDetails: "",
    workingDays: "",
    presentDays: "",
    leaveDays: "",
    lopDays: "",
    earnings: "",
    deductions: "",
    netSalary: "",
    remarks: "",
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
          <Typography variant="h5">Edit Salary Payment</Typography>
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
          {/* Faculty ID + Salary Structure ID */}
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
              label="Salary Structure ID"
              name="salaryStructureId"
              value={form.salaryStructureId}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Receipt />
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

          {/* Payment Date + Payment Mode */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
          </Stack>

          {/* Bank/Cheque Details (conditional) */}
          {form.paymentMode === "Bank Transfer" && (
            <TextField
              label="Bank Details"
              name="bankDetails"
              value={form.bankDetails}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {form.paymentMode === "Cheque" && (
            <TextField
              label="Cheque Details"
              name="chequeDetails"
              value={form.chequeDetails}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Attendance Details */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Working Days"
              name="workingDays"
              type="number"
              value={form.workingDays}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Present Days"
              name="presentDays"
              type="number"
              value={form.presentDays}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventAvailable />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Leave Days"
              name="leaveDays"
              type="number"
              value={form.leaveDays}
              onChange={handleChange}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventBusy />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="LOP Days"
              name="lopDays"
              type="number"
              value={form.lopDays}
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

          {/* Salary Calculations */}
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

          <TextField
            label="Net Salary"
            name="netSalary"
            type="number"
            value={form.netSalary}
            onChange={handleChange}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Calculate />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Remarks"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            fullWidth
            size="small"
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Note />
                </InputAdornment>
              ),
            }}
          />

          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleSubmit}>
              Update
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Body;