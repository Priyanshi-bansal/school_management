import React, { useEffect, useState } from "react";
import { Tooltip, useMediaQuery, useTheme } from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  LibraryBooks,
  PersonAdd,
} from "@mui/icons-material";
import {
  MenuBook as MenuBookIcon,
  Delete as DeleteIcon,
  Search,
  ClearAll,
  Add,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSubject,
  getSubject,
  getAllSubject,
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
  IconButton,
  Alert,
} from "@mui/material";
import { DELETE_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const departments = useSelector((state) => state.admin?.allDepartment || []);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [filter, setFilter] = useState({
    department: "all",
    year: "",
    searchQuery: "",
  });

  useEffect(() => {
    dispatch(getAllSubject());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(store.errors || {}).length !== 0) {
      setError(store.errors);
      setLoading(false);
    } else {
      setError({});
    }
  }, [store.errors]);

  const handleCheckboxChange = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setLoading(true);
    if (filter.department === "all" && filter.year === "") {
      dispatch(getAllSubject());
    } else {
      dispatch(
        getSubject({
          department: filter.department === "all" ? "" : filter.department,
          year: filter.year,
        })
      );
    }
  };

  const handleClearFilters = () => {
    setFilter({
      department: "all",
      year: "",
      searchQuery: "",
    });
    setError({});
    dispatch(getAllSubject());
  };

  const allSubjects = useSelector((state) => state.admin?.allSubject || []);
  const filteredSubjects = useSelector((state) => state.admin?.subjects?.result || []);

  const subjects =
    filter.department === "all" && filter.year === ""
      ? allSubjects
      : filteredSubjects;

  const searchedSubjects = subjects?.filter(
    (sub) =>
      sub?.subjectCode?.toLowerCase()?.includes(filter.searchQuery.toLowerCase()) ||
      sub?.subjectName?.toLowerCase()?.includes(filter.searchQuery.toLowerCase())
  ) || [];

  const handleDelete = () => {
    if (selectedSubjects.length === 0) return;

    if (
      window.confirm(`Are you sure you want to delete ${selectedSubjects.length} subject(s)?`)
    ) {
      setLoading(true);
      setError({});
      dispatch(deleteSubject(selectedSubjects));
    }
  };

  useEffect(() => {
    if (store.admin?.subjectDeleted) {
      setSelectedSubjects([]);
      setLoading(false);
      dispatch({ type: DELETE_SUBJECT, payload: false });
      if (filter.department === "all" && filter.year === "") {
        dispatch(getAllSubject());
      } else {
        dispatch(
          getSubject({
            department: filter.department === "all" ? "" : filter.department,
            year: filter.year,
          })
        );
      }
    }
  }, [store.admin?.subjectDeleted, dispatch, filter]);

  useEffect(() => {
    if (subjects !== undefined) {
      setLoading(false);
    }
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <Box sx={{ flex: 0.8, mt: { xs: 2, md: 3 }, p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 1, sm: 0 } }}>
            <MenuBookIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="textPrimary"
              textAlign={{ xs: "center", sm: "left" }}
            >
              Subject Management
            </Typography>
          </Box>
          <Chip
            label={`Total Subjects: ${subjects?.length || 0}`}
            color="primary"
            variant="outlined"
            sx={{ ml: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addsubject")}
            sx={{
              ml: { xs: 0, sm: "auto" },
              px: { xs: 2, md: 3 },
              py: 1,
              fontWeight: "bold",
              fontSize: { xs: "14px", md: "16px" },
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Add Subject
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: { xs: 1, sm: 2 },
              mb: 3,
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }} size="small">
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
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

            <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }} size="small">
              <InputLabel id="year-label">Year</InputLabel>
              <Select
                labelId="year-label"
                name="year"
                value={filter.year}
                onChange={handleFilterChange}
                label="Year"
              >
                <MenuItem value="">All Years</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="searchQuery"
              value={filter.searchQuery}
              onChange={handleFilterChange}
              label="Search Subjects"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "auto" } }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} aria-label="Search subjects">
                    <Search />
                  </IconButton>
                ),
              }}
            />

            <Button
              variant="outlined"
              startIcon={<ClearAll />}
              onClick={handleClearFilters}
              sx={{ width: { xs: "100%", sm: "auto" } }}
              aria-label="Clear all filters"
            >
              Clear Filters
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {(error.noSubjectError || error.backendError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.noSubjectError || error.backendError}
            </Alert>
          )}

          <TableContainer
            component={Paper}
            sx={{ mb: 3, overflowX: "auto" }}
          >
            <Table sx={{ minWidth: { xs: 600, md: 650 } }}>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedSubjects.length > 0 &&
                        selectedSubjects.length < (searchedSubjects?.length || 0)
                      }
                      checked={
                        (searchedSubjects?.length || 0) > 0 &&
                        selectedSubjects.length === (searchedSubjects?.length || 0)
                      }
                      onChange={() => {
                        if (
                          selectedSubjects.length === (searchedSubjects?.length || 0)
                        ) {
                          setSelectedSubjects([]);
                        } else {
                          setSelectedSubjects(
                            searchedSubjects?.map((sub) => sub._id) || []
                          );
                        }
                      }}
                      aria-label="Select all subjects"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>#</TableCell>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    Total Lectures
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedSubjects.length > 0 ? (
                  searchedSubjects.map((sub, idx) => (
                    <TableRow key={sub._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSubjects.includes(sub._id)}
                          onChange={() => handleCheckboxChange(sub._id)}
                          aria-label={`Select ${sub.subjectName}`}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell>{sub.subjectCode}</TableCell>
                      <TableCell>{sub.subjectName}</TableCell>
                      <TableCell>{sub.department}</TableCell>
                      <TableCell>{sub.year}</TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        {sub.totalLectures}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 0.5,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="View Subject">
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/admin/viewsubject`)}
                              size={isMobile ? "small" : "medium"}
                              aria-label={`View ${sub.subjectName}`}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Subject">
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/admin/editsubject`)}
                              size={isMobile ? "small" : "medium"}
                              aria-label={`Edit ${sub.subjectName}`}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Subject">
                            <IconButton
                              color="error"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete ${sub.subjectName}?`
                                  )
                                ) {
                                  setLoading(true);
                                  dispatch(deleteSubject([sub._id]));
                                }
                              }}
                              size={isMobile ? "small" : "medium"}
                              aria-label={`Delete ${sub.subjectName}`}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Assign Subject to Class">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(`/admin/subjecttoclass`)
                              }
                              size={isMobile ? "small" : "medium"}
                              aria-label={`Assign ${sub.subjectName} to class`}
                            >
                              <LibraryBooks fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Assign Teacher to Subject">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(`/admin/teachertosubject`)
                              }
                              size={isMobile ? "small" : "medium"}
                              aria-label={`Assign teacher to ${sub.subjectName}`}
                            >
                              <PersonAdd fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      {loading ? "" : "No subjects found matching your criteria"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedSubjects.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                backgroundColor: "action.selected",
                borderRadius: 1,
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Typography variant={isMobile ? "body2" : "body1"}>
                {selectedSubjects.length} subject(s) selected
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
                sx={{ width: { xs: "100%", sm: "auto" } }}
                aria-label="Delete selected subjects"
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