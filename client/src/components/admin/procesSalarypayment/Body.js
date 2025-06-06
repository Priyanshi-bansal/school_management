import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Search, ClearAll, Add } from "@mui/icons-material";

import {
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";

const Body = () => {
  const navigate = useNavigate();

  const [salaryData, setSalaryData] = useState([
    {
      _id: "1",
      facultyId: "FAC001",
      month: "June",
      year: 2025,
      paymentDate: "2025-06-05",
      paymentMode: "Bank Transfer",
      status: "Approved",
      components: [
        { type: "earning", amount: 50000 },
        { type: "deduction", amount: 5000 },
      ],
    },
    {
      _id: "2",
      facultyId: "FAC002",
      month: "May",
      year: 2025,
      paymentDate: "2025-05-25",
      paymentMode: "Cash",
      status: "Approved",
      components: [
        { type: "earning", amount: 48000 },
        { type: "deduction", amount: 3000 },
      ],
    },
    {
      _id: "3",
      facultyId: "FAC003",
      month: "June",
      year: 2024,
      paymentDate: "2024-06-04",
      paymentMode: "Cheque",
      status: "Approved",
      components: [
        { type: "earning", amount: 45000 },
        { type: "deduction", amount: 4000 },
      ],
    },
  ]);

  const facultyIds = ["ravi", "rahul", "suraj"];
  const months = ["January", "February", "March", "April", "May", "June"];
  const years = [2023, 2024, 2025];
  const statuses = ["Approved", "Paid",];

  const [filters, setFilters] = useState({
    facultyId: "",
    month: "",
    year: "",
    status: "",
    searchQuery: "",
  });

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckbox = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = salaryData.filter((row) => !selected.includes(row._id));
      setSalaryData(updated);
      setSelected([]);
      setLoading(false);
    }, 500);
  };

  const handleStatusChange = (id, newStatus) => {
    setSalaryData((prev) =>
      prev.map((row) =>
        row._id === id ? { ...row, status: newStatus } : row
      )
    );
  };

  const calculateAmount = (components, type) =>
    components
      .filter((c) => c.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);

  const clearFilters = () => {
    setFilters({
      facultyId: "",
      month: "",
      year: "",
      status: "",
      searchQuery: "",
    });
    setSelected([]);
  };

  const filteredData = salaryData.filter((row) => {
    return (
      (filters.facultyId === "" || row.facultyId === filters.facultyId) &&
      (filters.month === "" || row.month === filters.month) &&
      (filters.year === "" || row.year.toString() === filters.year) &&
      (filters.status === "" || row.status === filters.status) &&
      (filters.searchQuery === "" ||
        row.facultyId.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PaymentsIcon color="primary" />
          <Typography variant="h5">Faculty Salary Payment</Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate("/admin/addpsp")}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Salary Payment
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          justifyContent="flex-start"
          mb={3}
          flexWrap="wrap"
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Faculty Name</InputLabel>
            <Select
              value={filters.facultyId}
              label="Faculty ID"
              onChange={(e) => setFilters({ ...filters, facultyId: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {facultyIds.map((f) => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={filters.month}
              label="Month"
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {months.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {years.map((y) => (
                <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Search Faculty"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            sx={{ minWidth: 200 }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <Search />
                </IconButton>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<ClearAll />}
            onClick={clearFilters}
            sx={{ whiteSpace: "nowrap", height: "40px", width: 120 }}
          >
            Clear
          </Button>
        </Stack>

        {/* Table remains unchanged except using filteredData */}
        <TableContainer component={Paper} sx={{p:2}}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < filteredData.length
                    }
                    checked={
                      filteredData.length > 0 &&
                      selected.length === filteredData.length
                    }
                    onChange={() =>
                      setSelected(
                        selected.length === filteredData.length
                          ? []
                          : filteredData.map((d) => d._id)
                      )
                    }
                  />
                </TableCell>
                <TableCell>#</TableCell>
                <TableCell>Faculty ID</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Net Salary</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, idx) => {
                const earnings = calculateAmount(row.components, "earning");
                const deductions = calculateAmount(row.components, "deduction");
                const net = earnings - deductions;

                return (
                  <TableRow key={row._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row._id)}
                        onChange={() => handleCheckbox(row._id)}
                      />
                    </TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.facultyId}</TableCell>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.paymentDate}</TableCell>
                    <TableCell>{row.paymentMode}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={row.status}
                        onChange={(e) =>
                          handleStatusChange(row._id, e.target.value)
                        }
                      >
                        {statuses.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>₹{net.toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => navigate("/admin/viewpsp" )}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => navigate("/admin/editsalary", { state: row })}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleCheckbox(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: "action.selected",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography>{selected.length} salary payment(s) selected</Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              disabled={loading}
            >
              Delete Selected
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Body;
