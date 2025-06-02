import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Tooltip } from '@mui/material';

import {
  Engineering as EngineeringIcon,
  Delete as DeleteIcon,
  Search,
  ClearAll,
  Add,
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
  CircularProgress,
  Chip,
  TextField,
  IconButton,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  // Sample Data (replace with actual data or API call)
  const [faculty, setFaculty] = useState([
    {
      _id: "1",
      name: "Dr. John Doe",
      startDate: "2023-06-01",
      endDate: "2024-05-30",
      isCurrent: true,
      createdBy: "admin",
    },
    {
      _id: "2",
      name: "Ms. Jane Smith",
      startDate: "2022-06-01",
      endDate: "2023-05-30",
      isCurrent: false,
      createdBy: "admin",
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFaculty, setSearchedFaculty] = useState(faculty);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchedFaculty(faculty);
  }, [faculty]);

  const handleSearch = () => {
    let filtered = [...faculty];
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
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
          <EngineeringIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Academic Management
          </Typography>
          <Chip
            label={`Total Faculty: ${faculty.length}`}
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addacedmicyear")}
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
            Add Academic Year
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
              alignItems: "center",
            }}
          >
            <TextField
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search Faculty"
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
            <Button
              variant="outlined"
              startIcon={<ClearAll />}
              onClick={clearFilters}
            >
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
                          setSelectedFaculty(searchedFaculty.map((f) => f._id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Is Current</TableCell>
                  <TableCell>Created By</TableCell>
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
                      <TableCell>{fac.startDate}</TableCell>
                      <TableCell>{fac.endDate}</TableCell>
                      <TableCell>{fac.isCurrent ? "Yes" : "No"}</TableCell>
                      <TableCell>{fac.createdBy}</TableCell>
                      <TableCell>
                      <Tooltip title="ViewAcedmicYear" arrow>
    <IconButton
      color="primary"
      onClick={() =>
        navigate(`/admin`, { state: { section: fac } })
      }
      sx={{ mr: 1 }}
    >
      <VisibilityIcon />
    </IconButton>
  </Tooltip>

  <Tooltip title="EditAcedmicYear" arrow>
    <IconButton
     color="primary"
      onClick={() =>
        navigate("/admin/editacadamic", { state: { section: fac } })
      }
      sx={{ mr: 1,  }}
    >
      <EditIcon />
    </IconButton>
  </Tooltip>

  <Tooltip title="DeleteAcedmicYear" arrow>
    <IconButton
      color="error"
      onClick={() => handleDeleteSingle(fac._id)}
      sx={{ mr: 1 }}
    >
      <DeleteIcon />
    </IconButton>
  </Tooltip>

  <Tooltip title="SetCurrentYear" arrow>
    <IconButton
      color="success"
      onClick={() => alert(`Set action triggered for ${fac.name}`)}
    >
      <CheckCircleIcon />
    </IconButton>
  </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
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
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
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
    </Box>
  );
};

export default Body;
