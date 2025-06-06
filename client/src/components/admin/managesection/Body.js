import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
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
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [faculty, setFaculty] = useState([
    {
      _id: "1",
      name: "Dr. John Doe",
      class: "10",
      academicYear: "2024-2025",
      classTeacher: "ravi",
    },
    {
      _id: "2",
      name: "Ms. Jane Smith",
      class: "9",
      academicYear: "2024-2025",
      classTeacher: "rahul",
    },
  ]);

  const [departments, setDepartments] = useState([
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

  const handleCheckboxChange = (id) => {
    setSelectedFaculty((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
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

  const handleDeleteSingle = (id) => {
    const updatedFaculty = faculty.filter((f) => f._id !== id);
    setFaculty(updatedFaculty);
    setSearchedFaculty(updatedFaculty);
    setSelectedFaculty((prev) => prev.filter((fid) => fid !== id));
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <EngineeringIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" color="textPrimary">
              Section Management
            </Typography>
            <Chip
              label={`Total Faculty: ${faculty.length}`}
              color="primary"
              variant="outlined"
              size={isSmallScreen ? "small" : "medium"}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addsection")}
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1,
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "16px" },
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 1, sm: 0 },
            }}
          >
            Add Section
          </Button>
        </Stack>

        <Paper elevation={3} sx={{ p: { xs: 1, sm: 3 }, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 3 }}
          >
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 }, height: '40px' }} size="small">
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
              label="Search Faculty"
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

            <Button
              variant="outlined"
              startIcon={<ClearAll />}
              onClick={clearFilters}
              sx={{ 
                minWidth: { xs: "100%", sm: "150px" }, 
                whiteSpace: "nowrap",
                height: '40px'
              }}
            >
              Clear Filters
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
                <Table size={isSmallScreen ? "small" : "medium"}>
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
                            if (
                              selectedFaculty.length === searchedFaculty.length
                            ) {
                              setSelectedFaculty([]);
                            } else {
                              setSelectedFaculty(
                                searchedFaculty.map((f) => f._id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Academic Year</TableCell>
                      <TableCell>Class Teacher</TableCell>
                      <TableCell>Action</TableCell>
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
                          <TableCell>{fac.class}</TableCell>
                          <TableCell>{fac.academicYear}</TableCell>
                          <TableCell>{fac.classTeacher}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                  navigate(`/admin/viewsectiondetail`)
                                }
                              >
                                <VisibilityIcon fontSize={isSmallScreen ? "small" : "medium"} />
                              </IconButton>

                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                  navigate('/admin/editsection', {
                                    state: {
                                      section: fac,
                                    },
                                  })
                                }
                              >
                                <EditIcon fontSize={isSmallScreen ? "small" : "medium"} />
                              </IconButton>

                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDeleteSingle(fac._id)}
                              >
                                <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                          No faculty found matching your criteria
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
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    backgroundColor: "action.selected",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    {selectedFaculty.length} faculty member(s) selected
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={loading}
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    Delete Selected
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;