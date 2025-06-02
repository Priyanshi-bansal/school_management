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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFaculty,
  getFaculty,
  getAllFaculty,
} from "../../../redux/actions/adminActions";
import { DELETE_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const departments = useSelector((state) => state.admin.allDepartment);
  const allFaculty = useSelector((state) => state.admin.allFaculty);
  const filteredFaculty = useSelector((state) => state.admin.faculties.result);
  const store = useSelector((state) => state);

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [filter, setFilter] = useState({ department: "all", searchQuery: "" });

  const faculty = filter.department === "all" ? allFaculty : filteredFaculty;

  const searchedFaculty = faculty?.filter(
    (fac) =>
      fac.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      fac.email.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      fac.username.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      fac.designation?.toLowerCase().includes(filter.searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(getAllFaculty());
  }, []);

  useEffect(() => {
    setError(store.errors || {});
    setLoading(false);
  }, [store.errors]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

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
      value === "all"
        ? dispatch(getAllFaculty())
        : dispatch(getFaculty({ department: value }));
    }
  };

  const handleSearch = () => {
    setLoading(true);
    filter.department === "all"
      ? dispatch(getAllFaculty())
      : dispatch(getFaculty({ department: filter.department }));
  };

  const handleClearFilters = () => {
    setFilter({ department: "all", searchQuery: "" });
    dispatch(getAllFaculty());
  };

  const handleDelete = () => {
    if (
      selectedFaculty.length &&
      window.confirm(
        `Are you sure you want to delete ${selectedFaculty.length} faculty member(s)?`
      )
    ) {
      setLoading(true);
      dispatch(deleteFaculty(selectedFaculty));
    }
  };

  useEffect(() => {
    if (store.admin.facultyDeleted) {
      setSelectedFaculty([]);
      setLoading(false);
      dispatch({ type: DELETE_FACULTY, payload: false });
      filter.department === "all"
        ? dispatch(getAllFaculty())
        : dispatch(getFaculty({ department: filter.department }));
    }
  }, [store.admin.facultyDeleted]);

  useEffect(() => {
    if (faculty) setLoading(false);
  }, [faculty]);

  return (
    <Box sx={{ mt: 3, p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 2,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EngineeringIcon color="primary" />
          <Typography variant="h5">Faculty Management</Typography>
        </Box>
        <Chip
          label={`Total Faculty: ${faculty?.length || 0}`}
          color="primary"
          variant="outlined"
        />
        <Box sx={{ ml: "auto", width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="contained"
            fullWidth={isMobile}
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addfaculty")}
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
            Add Faculty
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
            onClick={handleClearFilters}
            size="small"
          >
            Clear Filters
          </Button>
        </Box>

        {/* Table or Loader */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table size="small">
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
                        setSelectedFaculty(
                          selectedFaculty.length ===
                          (searchedFaculty?.length || 0)
                            ? []
                            : searchedFaculty?.map((fac) => fac._id) || []
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Action</TableCell>
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
                      <TableCell>
                        <Tooltip title="Edit Faculty">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate("/admin/updateFaculty", {
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
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      No faculty found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Bulk Delete */}
        {selectedFaculty.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
              backgroundColor: "action.selected",
              borderRadius: 1,
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
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
              fullWidth={isMobile}
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
