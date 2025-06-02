import React, { useState, useEffect } from "react";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchedFaculty, setSearchedFaculty] = useState(faculty);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchedFaculty(faculty);
  }, [faculty]);

  const handleSearch = () => {
    let filtered = [...faculty];
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((f) => f.department === selectedDepartment);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setSearchedFaculty(filtered);
  };

  const handleDelete = () => {
    const updated = faculty.filter((f) => !selectedFaculty.includes(f._id));
    setFaculty(updated);
    setSelectedFaculty([]);
    setSearchedFaculty(updated);
  };

  const clearFilters = () => {
    setSelectedDepartment("all");
    setSearchQuery("");
    setSearchedFaculty(faculty);
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
          <Typography variant="h5">Session Management</Typography>
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
            Add Section
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
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
            fullWidth
            size="small"
            variant="outlined"
            label="Search Test"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            fullWidth={isMobile}
          >
            Clear Filters
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ overflowX: "auto", mb: 2, borderRadius: 2 }}
          >
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
                <TableRow>
                  <TableCell>Midterm</TableCell>
                  <TableCell>Math</TableCell>
                  <TableCell>Science</TableCell>
                  <TableCell>100</TableCell>
                  <TableCell>A</TableCell>
                  <TableCell>2025-06-01</TableCell>
                  <TableCell>2025</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton color="primary">
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
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Bulk Delete Notice */}
        {selectedFaculty.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mt: 2,
              p: 2,
              backgroundColor: "action.selected",
              borderRadius: 1,
            }}
          >
            <Typography>
              {selectedFaculty.length} faculty member(s) selected
            </Typography>
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
