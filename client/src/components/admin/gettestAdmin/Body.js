import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Engineering as EngineeringIcon,
  Delete as DeleteIcon,
  Search,
  ClearAll,
  Add,
  Edit as EditIcon,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [faculty, setFaculty] = useState([
    {
      _id: "1",
      name: "Dr. John Doe",
      class: "10A",
      academicYear: "2024-2025",
      classTeacher: "ravi",
    },
    {
      _id: "2",
      name: "Ms. Jane Smith",
      class: "9B",
      academicYear: "2024-2025",
      classTeacher: "rahul",
    },
  ]);

  const [departments] = useState([
    { department: "Computer Science" },
    { department: "Mechanical" },
    { department: "Electrical" },
  ]);

  const [filter, setFilter] = useState({ department: "all", searchQuery: "" });
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoized filtered data
  const searchedFaculty = useMemo(() => {
    let data = [...faculty];
    if (filter.department !== "all") {
      data = data.filter((f) => f.department === filter.department);
    }
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      data = data.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.username?.toLowerCase().includes(q) ||
          f.email?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [faculty, filter]);

  const handleDelete = () => {
    const updated = faculty.filter((f) => !selectedFaculty.includes(f._id));
    setFaculty(updated);
    setSelectedFaculty([]);
  };

  const handleClearFilters = () => {
    setFilter({ department: "all", searchQuery: "" });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ mt: 3, p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EngineeringIcon color="primary" />
          <Typography variant="h5">Manage Test</Typography>
        </Box>
        <Chip
          label={`Total Faculty: ${faculty.length}`}
          color="primary"
          variant="outlined"
        />
        <Box sx={{ ml: "auto", width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="contained"
            fullWidth={isMobile}
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/AddgeTtest")}
            sx={{
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
            }}
          >
            Add Test
          </Button>
        </Box>
      </Box>

      {/* Filters - Updated UI */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={filter.department}
              onChange={handleFilterChange}
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
            value={filter.searchQuery}
            onChange={handleFilterChange}
            label="Search"
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
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
            sx={{ height: "40px", whiteSpace: "nowrap" }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Table Section */}
        {loading ? (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ overflowX: "auto", mb: 2, borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Test</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedFaculty.length > 0 ? (
                  searchedFaculty.map((fac) => (
                    <TableRow key={fac._id}>
                      <TableCell>{fac.test || "Midterm"}</TableCell>
                      <TableCell>{fac.subject || "Math"}</TableCell>
                      <TableCell>{fac.department || "Science"}</TableCell>
                      <TableCell>{fac.totalMarks || 100}</TableCell>
                      <TableCell>{fac.section || "A"}</TableCell>
                      <TableCell>{fac.date || "2025-06-01"}</TableCell>
                      <TableCell>{fac.year || "2025"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate("/admin/edittestmanage", {
                                state: { section: fac },
                              })
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="primary">
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      No tests found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Bulk Delete UI */}
        {selectedFaculty.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
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
