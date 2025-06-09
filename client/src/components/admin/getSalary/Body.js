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
  InputLabel,
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
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [salaryStructure] = useState({
    name: "Assistant Professor Salary Structure 2023",
    applicableFrom: "2023-04-01",
    status: "active",
    components: []
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
      name: "Associate Professor",
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setSearchedFaculty(faculty);
  }, [faculty]);

  const handleSearch = () => {
    const filtered = faculty.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    const updated = faculty.filter((f) => !selectedFaculty.includes(f._id));
    setFaculty(updated);
    setSelectedFaculty([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleDeleteSingle = (id) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const updated = faculty.filter((f) => f._id !== deleteItemId);
    setFaculty(updated);
    setSelectedFaculty((prev) => prev.filter((fid) => fid !== deleteItemId));
    setDeleteDialogOpen(false);
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

  return (
    <Box sx={{ 
      flex: 1, 
      mt: { xs: 2, sm: 3 }, 
      p: { xs: 1, sm: 2 },
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: { sm: 1 },
          alignSelf: { xs: 'flex-start', sm: 'center' }
        }}>
          <PaidIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">Salary Structure</Typography>
        </Box>
        
        <Chip
          label={`Total: ${faculty.length}`}
          color="primary"
          variant="outlined"
          sx={{ 
            ml: { sm: 2 },
            alignSelf: { xs: 'flex-start', sm: 'center' }
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate("/admin/addSalary")}
          sx={{
            ml: { sm: "auto" },
            px: 3,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "8px",
            boxShadow: 2,
            textTransform: "none",
            width: { xs: '100%', sm: 'auto' },
            mt: { xs: 1, sm: 0 }
          }}
        >
          Add Salary
        </Button>
      </Box>

      {/* Search & Table */}
      <Paper elevation={3} sx={{ 
        p: { xs: 1, sm: 3 }, 
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            name="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search"
            variant="outlined"
            size="small"
            sx={{ 
              flexGrow: 1, 
              height: '40px',
              minWidth: { xs: '100%', sm: 200 }
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <Search />
                </IconButton>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<ClearAll />}
            onClick={clearFilters}
            size="small"
            sx={{ 
              height: '40px', 
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Clear Filters
          </Button>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            mb: 3,
            maxWidth: '100%',
            overflowX: 'auto'
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
                {!isSmallScreen && (
                  <>
                    <TableCell>Name</TableCell>
                    <TableCell>Applicable From</TableCell>
                    <TableCell align="right">Basic Salary</TableCell>
                    <TableCell align="right">Net Salary</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Date</TableCell>
                  </>
                )}
                {isSmallScreen && (
                  <TableCell>Details</TableCell>
                )}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedFaculty.length > 0 ? (
                searchedFaculty.map((fac, idx) => (
                  <TableRow key={fac._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFaculty.includes(fac._id)}
                        onChange={() => handleCheckboxChange(fac._id)}
                      />
                    </TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    
                    {!isSmallScreen ? (
                      <>
                        <TableCell>{fac.name}</TableCell>
                        <TableCell>{fac.applicableFrom}</TableCell>
                        <TableCell align="right">₹{fac.basicSalary.toLocaleString()}</TableCell>
                        <TableCell align="right">₹{fac.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <FormControl size="small" fullWidth={isSmallScreen}>
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
                      </>
                    ) : (
                      <TableCell>
                        <Box>
                          <Typography variant="body2"><strong>Name:</strong> {fac.name}</Typography>
                          <Typography variant="body2"><strong>Applicable From:</strong> {fac.applicableFrom}</Typography>
                          <Typography variant="body2"><strong>Basic:</strong> ₹{fac.basicSalary.toLocaleString()}</Typography>
                          <Typography variant="body2"><strong>Net:</strong> ₹{fac.netSalary.toLocaleString()}</Typography>
                          <Typography variant="body2"><strong>Status:</strong> 
                            <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
                              <Select
                                value={fac.status}
                                onChange={(e) => handleStatusChange(fac._id, e.target.value)}
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {["Pending", "Approved", "Rejected"].map(status => (
                                  <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Typography>
                          <Typography variant="body2"><strong>Payment Date:</strong> {fac.paymentDate || "-"}</Typography>
                        </Box>
                      </TableCell>
                    )}

                    <TableCell>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'nowrap',
                        gap: { xs: 0.5, sm: 1 }
                      }}>
                        <Tooltip title="View">
                          <IconButton
                            color="primary"
                            onClick={() => navigate("/admin/viewSalary")}
                            size={isSmallScreen ? "small" : "medium"}
                          >
                            <VisibilityIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => navigate("/admin/editsalary")}
                            size={isSmallScreen ? "small" : "medium"}
                          >
                            <EditIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSingle(fac._id)}
                            size={isSmallScreen ? "small" : "medium"}
                          >
                            <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isSmallScreen ? 4 : 9} sx={{ textAlign: "center", py: 4 }}>
                    No salary records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedFaculty.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              backgroundColor: "action.selected",
              borderRadius: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}
          >
            <Typography>{selectedFaculty.length} selected</Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              size={isSmallScreen ? "small" : "medium"}
              sx={{ 
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Delete Selected
            </Button>
          </Box>
        )}
      </Paper>

      {/* Single Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this salary record?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedFaculty.length} selected salary records?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmBulkDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Body;