import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paid as PaidIcon,
  Delete as DeleteIcon,
  Search,
  ClearAll,
  Add,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
 
} from "@mui/icons-material";
import {
  Button,
  Box,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  const [salaryStructure] = useState({
    name: "Assistant Professor Salary Structure 2023",
    applicableFrom: "2023-04-01",
    status: "active",
    components: [
      
    ]
  });

  const [faculty, setFaculty] = useState([
    {
      _id: "1",
      name: "Professor",
   applicableFrom: "2023-04-01",
      basicSalary: 80000,
      allowances: 20000,
      deductions: 5000,
      netSalary: 95000,
      status: "Approved",
      paymentDate: "2023-06-15"
    },
    {
      _id: "2",
      name: "Associate mr Professor",
    applicableFrom: "2023-04-01",
      basicSalary: 60000,
      allowances: 15000,
      deductions: 4000,
      netSalary: 71000,
      status: "Pending",
      paymentDate: ""
    }
    
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFaculty, setSearchedFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);

 

  useEffect(() => {
    setSearchedFaculty(faculty);
  }, [faculty]);

  const handleSearch = () => {
    const filtered = faculty.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchedFaculty(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchedFaculty(faculty);
  };

  const handleCheckboxChange = (id) => {
    setSelectedFaculty((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    const updated = faculty.filter((f) => !selectedFaculty.includes(f._id));
    setFaculty(updated);
    setSelectedFaculty([]);
  };

  const handleDeleteSingle = (id) => {
    const updated = faculty.filter((f) => f._id !== id);
    setFaculty(updated);
    setSelectedFaculty((prev) => prev.filter((fid) => fid !== id));
  };
  const handleClearFilters = () => {
  setSearchQuery("");
  setSearchedFaculty(faculty);
};


  const handleStatusChange = (id, newStatus) => {
    const updated = faculty.map(f => {
      if (f._id === id) {
        return {
          ...f,
          status: newStatus,
          paymentDate: newStatus === "Approved" ? new Date().toISOString().split('T')[0] : ""
        };
      }
      return f;
    });
    setFaculty(updated);
  };

  const calculateComponentAmount = (component) => {
    const basicSalary = salaryStructure.components.find(c => c.name === "Basic Salary")?.amount || 0;
    return component.calculationType === "percentage"
      ? (component.percentage / 100) * basicSalary
      : component.amount;
  };

  const totalEarnings = salaryStructure.components
    .filter(c => c.type === "earning")
    .reduce((sum, c) => sum + calculateComponentAmount(c), 0);

  const totalDeductions = salaryStructure.components
    .filter(c => c.type === "deduction")
    .reduce((sum, c) => sum + calculateComponentAmount(c), 0);

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 2 }}>
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PaidIcon color="primary" sx={{ mr: 1, height: 42, width: 42 }} />
          <Typography variant="h5">Salary Management</Typography>
          <Chip label={`Total Faculty: ${faculty.length}`} sx={{ ml: 2 }} />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ ml: "auto" }}
            onClick={() => navigate("/admin/addSalary")}
          >
            Add Salary Record
          </Button>
        </Box>

      

        {/* Search & Table */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Search Faculty"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}><Search /></IconButton>
                )
              }}
            />
             <Button
            variant="outlined"
            startIcon={<ClearAll />}
            onClick={handleClearFilters}
            size="small"
            sx={{ height: "40px", whiteSpace: "nowrap" }}
          >
            Clear Filters
          </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedFaculty.length > 0 &&
                        selectedFaculty.length < searchedFaculty.length
                      }
                      checked={
                        searchedFaculty.length > 0 &&
                        selectedFaculty.length === searchedFaculty.length
                      }
                      onChange={() => {
                        const allIds = searchedFaculty.map(f => f._id);
                        setSelectedFaculty(
                          selectedFaculty.length === allIds.length ? [] : allIds
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                   <TableCell>applicableFrom</TableCell>
                  <TableCell align="right">Basic Salary</TableCell>
                  <TableCell align="right">Net Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedFaculty.length > 0 ? (
                  searchedFaculty.map((fac, idx) => (
                    <TableRow key={fac._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedFaculty.includes(fac._id)}
                          onChange={() => handleCheckboxChange(fac._id)}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{fac.name}</TableCell>
                      <TableCell>{fac.applicableFrom}</TableCell>
                      <TableCell align="right">₹{fac.basicSalary}</TableCell>
                      <TableCell align="right">₹{fac.netSalary}</TableCell>
                      <TableCell>
                        <FormControl size="small">
                          <Select
                            value={fac.status}
                            onChange={(e) => handleStatusChange(fac._id, e.target.value)}
                          >
                            {["Pending", "Approved", "Rejected"].map(status => (
                              <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>{fac.paymentDate || "-"}</TableCell>
                      <TableCell>
                        <Tooltip title="View">
                          <IconButton 
                             color="primary"
                          onClick={() => navigate("/admin/viewSalary")}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                             color="primary"
                          onClick={() => navigate("/admin/viewSalary")}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSingle(fac._id)} // Call your delete handler
                        >
                          <DeleteIcon />
                        </IconButton>
                        </Tooltip>
                        
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No salary records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedFaculty.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              <Typography>{selectedFaculty.length} selected</Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;

 
