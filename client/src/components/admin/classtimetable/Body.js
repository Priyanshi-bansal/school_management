import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
  Engineering as EngineeringIcon,
  Delete as DeleteIcon,
  Add,
  Search,
  ClearAll,
} from "@mui/icons-material";

import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  const [timeTables, setTimeTables] = useState([
    {
      _id: "1",
      class: "10",
      section: "A",
      academicYear: "2024-2025",
      effectiveFrom: "2024-06-01",
      effectiveTill: "2025-03-31",
      isActive: true,
      department: "Science",
    },
    {
      _id: "2",
      class: "9",
      section: "B",
      academicYear: "2024-2025",
      effectiveFrom: "2024-06-01",
      effectiveTill: "2025-03-31",
      isActive: false,
      department: "Commerce",
    },
  ]);

  const [departments, setDepartments] = useState([
    { department: "Science" },
    { department: "Commerce" },
    { department: "Arts" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [filteredTimeTables, setFilteredTimeTables] = useState(timeTables);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredTimeTables(timeTables);
  }, [timeTables]);

  const handleSearch = () => {
    let filtered = [...timeTables];

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((tt) => tt.department === selectedDepartment);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tt) =>
          tt.class.toLowerCase().includes(query) ||
          tt.section.toLowerCase().includes(query) ||
          tt.academicYear.toLowerCase().includes(query)
      );
    }

    setFilteredTimeTables(filtered);
  };

  const clearFilters = () => {
    setSelectedDepartment("all");
    setSearchQuery("");
    setFilteredTimeTables(timeTables);
  };

  const handleDeleteSingle = (id) => {
    const updated = timeTables.filter((tt) => tt._id !== id);
    setTimeTables(updated);
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
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <EngineeringIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" color="textPrimary" sx={{ mr: 2 }}>
              Class Time Table Management
            </Typography>
            <Chip
              label={`Total Records: ${timeTables.length}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addclasstable")}
            sx={{
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            Add Class Time Table
          </Button>
        </Stack>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            justifyContent="space-between"
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

            <Button
              variant="outlined"
              startIcon={<ClearAll />}
              onClick={clearFilters}
              fullWidth
              sx={{ minWidth: "150px", whiteSpace: "nowrap" }}
            >
              Clear Filters
            </Button>
          </Stack>

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
                    <TableCell>Class</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Effective From</TableCell>
                    <TableCell>Effective Till</TableCell>
                    <TableCell>Is Active</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTimeTables.length > 0 ? (
                    filteredTimeTables.map((tt, idx) => (
                      <TableRow key={tt._id} hover>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{tt.class}</TableCell>
                        <TableCell>{tt.section}</TableCell>
                        <TableCell>{tt.academicYear}</TableCell>
                        <TableCell>{tt.effectiveFrom}</TableCell>
                        <TableCell>{tt.effectiveTill}</TableCell>
                        <TableCell>
                          <Chip
                            label={tt.isActive ? "Yes" : "No"}
                            color={tt.isActive ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{tt.department}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/admin/viewclasstime`)}
                            sx={{ mr: 1 }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate("/admin/editclasstime", {
                                state: { section: tt },
                              })
                            }
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSingle(tt._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                        No timetable data available
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
