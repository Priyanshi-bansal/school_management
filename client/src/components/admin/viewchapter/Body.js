import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MenuBook as MenuBookIcon,
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
  Grid,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState([
    {
      _id: "1",
      subject: "Mathematics",
      chapter: "1",
      title: "Algebra Basics",
      description: "Introduction to algebraic expressions",
      academicYear: "2024-2025",
      createdBy: "Admin",
    },
    {
      _id: "2",
      subject: "Science",
      chapter: "2",
      title: "Photosynthesis",
      description: "Process of photosynthesis in plants",
      academicYear: "2024-2025",
      createdBy: "Admin",
    },
  ]);

  const [subjectOptions, setSubjectOptions] = useState(["Mathematics", "Science", "History"]);
  const [yearOptions, setYearOptions] = useState(["2023-2024", "2024-2025", "2025-2026"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchedFaculty, setSearchedFaculty] = useState(faculty);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchedFaculty(faculty);
  }, [faculty]);

  const handleSearch = () => {
    let filtered = [...faculty];
    if (selectedSubject !== "all") {
      filtered = filtered.filter((f) => f.subject === selectedSubject);
    }
    if (selectedYear !== "all") {
      filtered = filtered.filter((f) => f.academicYear === selectedYear);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase())
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
    setSelectedSubject("all");
    setSelectedYear("all");
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
    <Box sx={{ mt: 3, p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <MenuBookIcon color="primary" />
          <Typography variant="h5" color="textPrimary">
     Chapter Detail
          </Typography>
          <Chip label={`Total Sections: ${faculty.length}`} color="primary" variant="outlined" />
          <Box sx={{ flexGrow: 1 }} />
       
        </Box>

       <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
  <Grid container spacing={2}>
    <Grid item xs={12} md={3}>
      <FormControl fullWidth size="small">
        <InputLabel>Subject</InputLabel>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          label="Subject"
        >
          <MenuItem value="all">All</MenuItem>
          {subjectOptions.map((sub, idx) => (
            <MenuItem key={idx} value={sub}>
              {sub}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} md={3}>
      <FormControl fullWidth size="small">
        <InputLabel>Academic Year</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          label="Academic Year"
        >
          <MenuItem value="all">All</MenuItem>
          {yearOptions.map((year, idx) => (
            <MenuItem key={idx} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} md={3}>
      <TextField
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
    </Grid>

    <Grid item xs={12} md={3}>
      <Button
        variant="outlined"
        startIcon={<ClearAll />}
        onClick={clearFilters}
        fullWidth
        sx={{ height: "100%" }}
      >
        Clear Filters
      </Button>
    </Grid>
  </Grid>


       

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                    <TableCell>Subject</TableCell>
                    <TableCell>Chapter</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
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
                        <TableCell>{fac.subject}</TableCell>
                        <TableCell>{fac.chapter}</TableCell>
                        <TableCell>{fac.title}</TableCell>
                        <TableCell>{fac.description}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/admin/viewChapter`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate("/admin/editchapter", { state: { section: fac } })
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteSingle(fac._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                        No data found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {selectedFaculty.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                mt: 2,
                backgroundColor: "action.selected",
                borderRadius: 1,
              }}
            >
              <Typography>{selectedFaculty.length} section(s) selected</Typography>
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
