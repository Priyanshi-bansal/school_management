import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Engineering as EngineeringIcon,
  Search,
  ClearAll,
  Add,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

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
  Chip,
  TextField,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";

// Mock Data
const mockData = [
  {
    _id: "1",
    startTime: "09:00 AM",
    endTime: "09:45 AM",
    periodNumber: 1,
    isBreak: false,
    breakName: true,
  },
  {
    _id: "2",
    startTime: "09:45 AM",
    endTime: "10:30 AM",
    periodNumber: 2,
    isBreak: true,
    breakName: false,
  },
];

const departments = ["Engineering", "Science", "Arts"];

const Body = () => {
  const navigate = useNavigate();
  const [allFaculty, setAllFaculty] = useState(mockData);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [filter, setFilter] = useState({ department: "all", searchQuery: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const faculty =
    filter.department === "all"
      ? allFaculty
      : allFaculty.filter((f) => f.department === filter.department);

  const searchedFaculty = useMemo(() => {
    const q = filter.searchQuery.toLowerCase();
    return faculty.filter(
      (fac) =>
        fac.startTime.toLowerCase().includes(q) ||
        fac.endTime.toLowerCase().includes(q) ||
        fac.periodNumber.toString().includes(q) ||
        (fac.isBreak ? "yes" : "no").includes(q) ||
        (fac.breakNumber ? fac.breakNumber.toString() : "").includes(q)
    );
  }, [faculty, filter.searchQuery]);

  const handleCheckboxChange = (id) => {
    setSelectedFaculty((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilter({ department: "all", searchQuery: "" });
    setError({});
  };

  const handleDelete = () => {
    if (
      selectedFaculty.length > 0 &&
      window.confirm(`Delete ${selectedFaculty.length} selected item(s)?`)
    ) {
      setLoading(true);
      setTimeout(() => {
        setAllFaculty((prev) =>
          prev.filter((fac) => !selectedFaculty.includes(fac._id))
        );
        setSelectedFaculty([]);
        setLoading(false);
      }, 1000);
    }
  };

  const handleDeleteSingle = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setLoading(true);
      setTimeout(() => {
        setAllFaculty((prev) => prev.filter((fac) => fac._id !== id));
        setSelectedFaculty((prev) => prev.filter((fid) => fid !== id));
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        {/* Top Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EngineeringIcon color="primary" />
            <Typography variant="h5">Time Table</Typography>
          </Box>

          <Chip
            label={`Total Classes: ${faculty.length}`}
            color="primary"
            variant="outlined"
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/AddTimetablemanagement")}
            sx={{
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Add Time
          </Button>
        </Box>

        {/* Filters */}
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={filter.department}
                  onChange={handleFilterChange}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map((dp, idx) => (
                    <MenuItem key={idx} value={dp}>
                      {dp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                name="searchQuery"
                value={filter.searchQuery}
                onChange={handleFilterChange}
                label="Search"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <Search />
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                startIcon={<ClearAll />}
                onClick={handleClearFilters}
                size="small"
                fullWidth
                sx={{ height: "40px", whiteSpace: "nowrap" }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          {/* Loading & Error */}
          {loading && (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {(error.noFacultyError || error.backendError) && (
            <Alert severity="error">
              {error.noFacultyError || error.backendError}
            </Alert>
          )}

          {/* Table */}
          <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
            <Table size="small">
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
                      onChange={() =>
                        setSelectedFaculty(
                          selectedFaculty.length === searchedFaculty.length
                            ? []
                            : searchedFaculty.map((f) => f._id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Period Number</TableCell>
                  <TableCell>Is Break</TableCell>
                  <TableCell>Break Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedFaculty.length > 0 ? (
                  searchedFaculty.map((fac) => (
                    <TableRow key={fac._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedFaculty.includes(fac._id)}
                          onChange={() => handleCheckboxChange(fac._id)}
                        />
                      </TableCell>
                      <TableCell>{fac.startTime}</TableCell>
                      <TableCell>{fac.endTime}</TableCell>
                      <TableCell>{fac.periodNumber}</TableCell>
                      <TableCell>{fac.isBreak ? "No" : "Yes"}</TableCell>
                      <TableCell>{fac.breakName ? "Morning" : "-"}</TableCell>
                      <TableCell>
                        <IconButton color="primary" sx={{ mr: 1 }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate("/admin/AddTimetablemanagement", {
                              state: { section: fac },
                            })
                          }
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSingle(fac._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                      {loading ? "" : "No classes found matching your criteria"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Bulk Delete */}
          {selectedFaculty.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                p: 2,
                backgroundColor: "action.selected",
                borderRadius: 1,
              }}
            >
              <Typography>{selectedFaculty.length} selected</Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
                fullWidth={true}
                sx={{ maxWidth: { sm: 200 } }}
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
