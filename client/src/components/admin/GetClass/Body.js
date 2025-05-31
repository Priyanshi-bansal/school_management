import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Engineering as EngineeringIcon,
  Delete as DeleteIcon,
  Search,
  ClearAll,
  Add,
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
} from "@mui/material";

// ✅ Mock Data
const mockData = [
  {
    _id: "1",
    name: "Class A",
    teacher: "John Doe",
    capacity: "30",
    academic: "2023-2024",
    department: "Engineering",
  },
  {
    _id: "2",
    name: "Class B",
    teacher: "Jane Smith",
    capacity: "25",
    academic: "2023-2024",
    department: "Science",
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
    return faculty.filter(
      (fac) =>
        fac.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        fac.teacher.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        fac.capacity.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        fac.academic.toLowerCase().includes(filter.searchQuery.toLowerCase())
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

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <EngineeringIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">Class Management</Typography>
          <Chip
            label={`Total Classes: ${faculty.length}`}
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addclass")}
            sx={{
              ml: "auto",
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
            }}
          >
            Add Faculty
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={filter.department}
                onChange={handleFilterChange}
                label="Department"
                size="small"
                sx={{ height: '40px' }} 
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments.map((dp, idx) => (
                  <MenuItem key={idx} value={dp}>
                    {dp}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="searchQuery"
              value={filter.searchQuery}
              onChange={handleFilterChange}
              label="Search"
              variant="outlined"
              size="small"

              sx={{ flexGrow: 1, height: '40px' }}
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
              onClick={handleClearFilters}
              size="small"
              sx={{ height: '40px', whiteSpace: 'nowrap' }}
            >
              Clear Filters
            </Button>
          </Box>

          {loading && (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {(error.noFacultyError || error.backendError) && (
            <Alert severity="error">{error.noFacultyError || error.backendError}</Alert>
          )}

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
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
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Academic Year</TableCell>
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
                      <TableCell>{fac.name}</TableCell>
                      <TableCell>{fac.teacher}</TableCell>
                      <TableCell>{fac.capacity}</TableCell>
                      <TableCell>{fac.academic}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                      {loading ? "" : "No faculty found matching your criteria"}
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
              }}
            >
              <Typography>{selectedFaculty.length} selected</Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
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
