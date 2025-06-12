import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Search, ClearAll, Add } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([
    {
      _id: "1",
      student: "Ankit Sharma",
      amountPaid: 5000,
      mode: "Online",
      status: "Paid",
      transactionId: "TXN12345",
      updateBy: "First installment",
      createdBy: "Admin",
      department: "Computer Science",
    },
    {
      _id: "2",
      student: "Riya Patel",
      amountPaid: 2500,
      mode: "Cash",
      status: "Pending",
      transactionId: "TXN67890",
      updateBy: "Due clearance",
      createdBy: "Clerk",
      department: "Mechanical",
    },
  ]);

  const [departments, setDepartments] = useState([
    { department: "Computer Science" },
    { department: "Mechanical" },
    { department: "Electrical" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [filteredPayments, setFilteredPayments] = useState(payments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredPayments(payments);
  }, [payments]);

  const handleSearch = () => {
    let filtered = [...payments];
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((p) => p.department === selectedDepartment);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.updateBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPayments(filtered);
  };

  const clearFilters = () => {
    setSelectedDepartment("all");
    setSearchQuery("");
    setFilteredPayments(payments);
  };

  const handleDownload = (payment) => {
    // TODO: implement download logic
    alert(`Download receipt for ${payment.student}`);
  };

  const handleViewReceipt = (payment) => {
    // TODO: implement view logic
    alert(`View receipt for ${payment.student}`);
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box display="flex" alignItems="center">
            <PaymentsIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" color="textPrimary" sx={{ mr: 2 }}>
              Student Payment Records
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addfees")}
            sx={{
              ml: { sm: "auto" },
              mt: { xs: 1, sm: 0 },
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Add Payment
          </Button>
        </Stack>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          {/* Filters */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ mb: 3 }}
          >
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                label="Department"
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments.map((dp, idx) => (
                  <MenuItem key={idx} value={dp.department}>
                    {dp.department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <Search />
                  </IconButton>
                ),
              }}
            />

            <IconButton
              onClick={clearFilters}
              color="primary"
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                px: 2,
                alignSelf: "center",
              }}
            >
              <ClearAll />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Clear Filters
              </Typography>
            </IconButton>
          </Stack>

          {/* Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Amount Paid</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>updateBy</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Receipt</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment, idx) => (
                      <TableRow key={payment._id} hover>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{payment.student}</TableCell>
                        <TableCell>₹{payment.amountPaid}</TableCell>
                        <TableCell>{payment.mode}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            color={
                              payment.status === "Paid" ? "success" : "warning"
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell>{payment.updateBy}</TableCell>
                        <TableCell>{payment.createdBy}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleDownload(payment)}
                            >
                              <DownloadIcon />
                            </IconButton>

                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate("/admin/viewpaymentfee", {
                                  state: { payment },
                                })
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>


                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate("/admin/editpayment", {
                                state: { payment },
                              })
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                        No payment data found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;
