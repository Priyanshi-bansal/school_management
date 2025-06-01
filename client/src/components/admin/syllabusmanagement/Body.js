import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState([
    {
      _id: "1",
      class: "10",
      subject: "Mathematics",
      academicYear: "2024-2025",
      createdBy: "Admin",
      updatedBy: "John",
      lastUpdated: "2024-05-30 14:23",
    },
    {
      _id: "2",
      class: "9",
      subject: "Science",
      academicYear: "2024-2025",
      createdBy: "Admin",
      updatedBy: "Smith",
      lastUpdated: "2024-05-29 11:05",
    },
  ]);

  const [classOptions, setClassOptions] = useState(["10A", "9B", "8C"]);
  const [subjectOptions, setSubjectOptions] = useState(["Mathematics", "Science", "History"]);
  const [yearOptions, setYearOptions] = useState(["2023-2024", "2024-2025", "2025-2026"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
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
    if (selectedClass !== "all") {
      filtered = filtered.filter((f) => f.class === selectedClass);
    }
    if (selectedSubject !== "all") {
      filtered = filtered.filter((f) => f.subject === selectedSubject);
    }
    if (selectedYear !== "all") {
      filtered = filtered.filter((f) => f.academicYear === selectedYear);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (f) =>
          f.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.subject.toLowerCase().includes(searchQuery.toLowerCase())
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
    setSelectedClass("all");
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
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
         <MenuBookIcon color="primary" sx={{ mr: 1 }} />
<Typography variant="h5" color="textPrimary">
  Syllabus Management
</Typography>
          <Chip
            label={`Total Sections: ${faculty.length}`}
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/getsyllabus")}
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
            Get Syllabus
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, alignItems: "center" }}>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Class</InputLabel>
              <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} label="Class">
                <MenuItem value="all">All</MenuItem>
                {classOptions.map((cls, idx) => <MenuItem key={idx} value={cls}>{cls}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Subject</InputLabel>
              <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} label="Subject">
                <MenuItem value="all">All</MenuItem>
                {subjectOptions.map((sub, idx) => <MenuItem key={idx} value={sub}>{sub}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Academic Year</InputLabel>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Academic Year">
                <MenuItem value="all">All</MenuItem>
                {yearOptions.map((year, idx) => <MenuItem key={idx} value={year}>{year}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <Search />
                  </IconButton>
                ),
              }}
            />

            <Button variant="outlined" startIcon={<ClearAll />} onClick={clearFilters}>
              Clear Filters
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedFaculty.length > 0 && selectedFaculty.length < searchedFaculty.length}
                      checked={searchedFaculty.length > 0 && selectedFaculty.length === searchedFaculty.length}
                      onChange={() => {
                        if (selectedFaculty.length === searchedFaculty.length) {
                          setSelectedFaculty([]);
                        } else {
                          setSelectedFaculty(searchedFaculty.map((f) => f._id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Academic Year</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedFaculty.length > 0 ? (
                  searchedFaculty.map((fac, idx) => (
                    <TableRow key={fac._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedFaculty.includes(fac._id)} onChange={() => handleCheckboxChange(fac._id)} />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{fac.class}</TableCell>
                      <TableCell>{fac.subject}</TableCell>
                      <TableCell>{fac.academicYear}</TableCell>
                      <TableCell>{fac.createdBy}</TableCell>
                      <TableCell>{fac.updatedBy}</TableCell>
                      <TableCell>{fac.lastUpdated}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => navigate(`/admin/viewChapter`)} sx={{ mr: 1 }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate('/admin/editsyllabus', {
                              state: { section: fac },
                            })
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
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                      No data found matching your criteria
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
