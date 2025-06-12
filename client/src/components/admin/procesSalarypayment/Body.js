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
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
  TableContainer,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

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
      _id: "3",
      facultyId: "FAC002",
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
      _id: "7",
      facultyId: "FAC003",
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
      _id: "4",
      facultyId: "FAC004",
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
    // ... other data
  ]);

  const facultyIds = ["ravi", "rahul", "suraj"];
  const months = ["January", "February", "March", "April", "May", "June"];
  const years = [2023, 2024, 2025];
  const statuses = ["Approved", "Paid"];

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
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center" mb={isSmallScreen ? 2 : 0}>
          <PaymentsIcon color="primary" />
          <Typography variant={isSmallScreen ? "h6" : "h5"}>Faculty Salary Payment</Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate("/admin/addpsp")}
          sx={{ textTransform: "none", borderRadius: 2 }}
          size={isSmallScreen ? "small" : "medium"}
        >
          Add Salary Payment
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: { xs: 1, sm: 3 }, borderRadius: 2 }}>
        {/* Filter Section */}
        <Stack
          direction={isSmallScreen ? "column" : "row"}
          spacing={2}
          alignItems={isSmallScreen ? "stretch" : "flex-start"}
          justifyContent="flex-start"
          mb={3}
          flexWrap="wrap"
        >
          <FormControl size="small" sx={{ minWidth: isSmallScreen ? "100%" : 160 }}>
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

          <FormControl size="small" sx={{ minWidth: isSmallScreen ? "100%" : 140 }}>
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

          <FormControl size="small" sx={{ minWidth: isSmallScreen ? "100%" : 120 }}>
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

          {!isSmallScreen && (
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
          )}

          <TextField
            size="small"
            label="Search Faculty"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            sx={{ minWidth: isSmallScreen ? "100%" : 200 }}
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
            sx={{ 
              whiteSpace: "nowrap", 
              height: "40px", 
              width: isSmallScreen ? "100%" : 120 
            }}
            size={isSmallScreen ? "small" : "medium"}
          >
            Clear
          </Button>
        </Stack>

        {/* Table Section */}
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer component={Paper} sx={{ p: isSmallScreen ? 0 : 2 }}>
            <Table size="small" sx={{ minWidth: isSmallScreen ? 800 : "100%" }}>
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
                  {!isMediumScreen && (
                    <>
                      <TableCell>Month</TableCell>
                      <TableCell>Year</TableCell>
                    </>
                  )}
                  <TableCell>Payment Date</TableCell>
                  {!isSmallScreen && <TableCell>Payment Mode</TableCell>}
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
                      {!isMediumScreen && (
                        <>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>{row.year}</TableCell>
                        </>
                      )}
                      <TableCell>
                        {isSmallScreen ? row.paymentDate.split("-").reverse().join("-") : row.paymentDate}
                      </TableCell>
                      {!isSmallScreen && <TableCell>{row.paymentMode}</TableCell>}
                      <TableCell>
                        {isSmallScreen ? (
                          row.status
                        ) : (
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
                        )}
                      </TableCell>
                      <TableCell>₹{net.toLocaleString()}</TableCell>
                      <TableCell>
                        <Stack direction="row">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate("/admin/viewpsp")}
                          >
                            <VisibilityIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate("/admin/editsalary", { state: row })}
                          >
                            <EditIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleCheckbox(row._id)}
                          >
                            <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

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
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
              onClick={handleDeleteSelected}
              disabled={loading}
              size={isSmallScreen ? "small" : "medium"}
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