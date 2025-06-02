import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  Engineering as EngineeringIcon,
  Delete as DeleteIcon,
  Search,
  ClearAll,
  Add,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFaculty,
  getFaculty,
  getAllFaculty,
} from "../../../redux/actions/adminActions";
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
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
import { DELETE_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [filter, setFilter] = useState({
    department: "all",
    searchQuery: "",
  });

  // Get all faculty by default on component mount
  useEffect(() => {
    dispatch(getAllFaculty());
  }, []);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    } else {
      setError({});
    }
  }, [store.errors]);

  const handleCheckboxChange = (facultyId) => {
    setSelectedFaculty((prev) =>
      prev.includes(facultyId)
        ? prev.filter((id) => id !== facultyId)
        : [...prev, facultyId]
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (name === "department") {
      setLoading(true);
      if (value === "all") {
        dispatch(getAllFaculty());
      } else {
        dispatch(getFaculty({ department: value }));
      }
    }
  };

  const handleSearch = () => {
    setLoading(true);
    if (filter.department === "all") {
      dispatch(getAllFaculty());
    } else {
      dispatch(getFaculty({ department: filter.department }));
    }
  };

  const handleClearFilters = () => {
    setFilter({
      department: "all",
      searchQuery: "",
    });
    setError({});
    dispatch(getAllFaculty());
  };

  const allFaculty = useSelector((state) => state.admin.allFaculty);
  const filteredFaculty = useSelector((state) => state.admin.faculties.result);

  const faculty = filter.department === "all" ? allFaculty : filteredFaculty;

  const searchedFaculty = faculty?.filter(
    (fac) =>
      fac.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      fac.email.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      fac.username.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      fac.designation?.toLowerCase().includes(filter.searchQuery.toLowerCase())
  );

  const handleEdit = (faculty) => {
    console.log("Editing faculty:", faculty);
    // Implement edit logic (e.g., open a modal)
  };

  const handleDelete = () => {
    if (selectedFaculty.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedFaculty.length} faculty member(s)?`
      )
    ) {
      setLoading(true);
      setError({});
      dispatch(deleteFaculty(selectedFaculty));
    }
  };

  useEffect(() => {
    if (store.admin.facultyDeleted) {
      setSelectedFaculty([]);
      setLoading(false);
      dispatch({ type: DELETE_FACULTY, payload: false });
      // Refresh the list after deletion
      if (filter.department === "all") {
        dispatch(getAllFaculty());
      } else {
        dispatch(getFaculty({ department: filter.department }));
      }
    }
  }, [store.admin.facultyDeleted]);

  useEffect(() => {
    if (faculty !== undefined) {
      setLoading(false);
    }
  }, [faculty]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);



  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <EngineeringIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Faculty Management
          </Typography>
          <Chip
            label={`Total Faculty: ${faculty?.length || 0}`}
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addfaculty")}
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
              alignItems: "center",
            }}
          >
                <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={filter.department}
                onChange={handleFilterChange}
                label="Department"
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments?.map((dp, idx) => (
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
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {(error.noFacultyError || error.backendError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.noFacultyError || error.backendError}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedFaculty.length > 0 &&
                        selectedFaculty.length < (searchedFaculty?.length || 0)
                      }
                      checked={
                        (searchedFaculty?.length || 0) > 0 &&
                        selectedFaculty.length ===
                        (searchedFaculty?.length || 0)
                      }
                      onChange={() => {
                        if (
                          selectedFaculty.length ===
                          (searchedFaculty?.length || 0)
                        ) {
                          setSelectedFaculty([]);
                        } else {
                          setSelectedFaculty(
                            searchedFaculty?.map((fac) => fac._id) || []
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedFaculty?.length > 0 ? (
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
                      <TableCell>{fac.username}</TableCell>
                      <TableCell>{fac.email}</TableCell>
                      <TableCell>{fac.department}</TableCell>
                      <TableCell>{fac.designation}</TableCell>
                      <TableCell> <Tooltip title="Edit Faculty">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate('/admin/updateFaculty', {
                              state: { section: fac },
                            })
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
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
