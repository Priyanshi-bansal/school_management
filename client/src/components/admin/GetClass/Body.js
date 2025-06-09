import React, { useEffect, useState, useMemo } from "react";
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
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

// Mock Data
const mockData = [
  {
    _id: "1",
    name: "Class A",
    teacher: "John Doe",
    capacity: "30",
    academic: "2023-2024",
  },
  {
    _id: "2",
    name: "Class B",
    teacher: "Jane Smith",
    capacity: "25",
    academic: "2023-2024",
  },
];

const departments = ["Engineering", "Science", "Arts"];

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [allFaculty, setAllFaculty] = useState(mockData);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [filter, setFilter] = useState({ department: "all", searchQuery: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

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
    if (selectedFaculty.length > 0) {
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
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setAllFaculty((prev) => prev.filter((fac) => fac._id !== deleteItemId));
      setSelectedFaculty((prev) => prev.filter((fid) => fid !== deleteItemId));
      setLoading(false);
      setDeleteDialogOpen(false);
    }, 1000);
  };

  return (
    <Box sx={{ 
      flex: 1, 
      mt: { xs: 2, sm: 3 }, 
      p: { xs: 1, sm: 3 },
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      <Box sx={{ mb: 4 }}>
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
            <EngineeringIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">Class Management</Typography>
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
            onClick={() => navigate("/admin/addclass")}
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
            Add Class
          </Button>
        </Box>

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
            <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
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
              sx={{ 
                flexGrow: 1, 
                height: '40px',
                minWidth: { xs: '100%', sm: 200 }
              }}
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
              sx={{ 
                height: '40px', 
                whiteSpace: 'nowrap',
                width: { xs: '100%', sm: 'auto' }
              }}
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
                  {!isSmallScreen && (
                    <>
                      <TableCell>Name</TableCell>
                      <TableCell>Teacher</TableCell>
                      <TableCell>Capacity</TableCell>
                      <TableCell>Academic Year</TableCell>
                    </>
                  )}
                  {isSmallScreen && (
                    <TableCell>Details</TableCell>
                  )}
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
                      
                      {!isSmallScreen ? (
                        <>
                          <TableCell>{fac.name}</TableCell>
                          <TableCell>{fac.teacher}</TableCell>
                          <TableCell>{fac.capacity}</TableCell>
                          <TableCell>{fac.academic}</TableCell>
                        </>
                      ) : (
                        <TableCell>
                          <Box>
                            <Typography variant="body2"><strong>Name:</strong> {fac.name}</Typography>
                            <Typography variant="body2"><strong>Teacher:</strong> {fac.teacher}</Typography>
                            <Typography variant="body2"><strong>Capacity:</strong> {fac.capacity}</Typography>
                            <Typography variant="body2"><strong>Academic:</strong> {fac.academic}</Typography>
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
                              onClick={() => navigate(`/admin/viewClass`)}
                              size={isSmallScreen ? "small" : "medium"}
                            >
                              <VisibilityIcon fontSize={isSmallScreen ? "small" : "medium"} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate('/admin/EditClass', {
                                  state: {
                                    section: fac,
                                  },
                                })
                              }
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
                    <TableCell colSpan={isSmallScreen ? 4 : 7} sx={{ textAlign: "center", py: 4 }}>
                      {loading ? "" : "No classes found matching your criteria"}
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
                onClick={() => {
                  if (window.confirm(`Delete ${selectedFaculty.length} selected item(s)?`)) {
                    handleDelete();
                  }
                }}
                disabled={loading}
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
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this class?</Typography>
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
    </Box>
  );
};

export default Body;