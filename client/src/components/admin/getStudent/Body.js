import React, { useEffect, useState } from "react";
import {
  Groups as StudentIcon,
  School as DepartmentIcon,
  CalendarToday as YearIcon,
  Person as NameIcon,
  Badge as UsernameIcon,
  Email as EmailIcon,
  Class as SectionIcon,
  Event as BatchIcon,
  Search,
  ClearAll,
  Add,
  Edit
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
  Alert,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getStudent, getAllStudent } from "../../../redux/actions/adminActions";
import { SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filter, setFilter] = useState({
    department: "all",
    year: "all",
    searchQuery: ""
  });

  useEffect(() => {
    dispatch(getAllStudent());
  }, []);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    } else {
      setError({});
    }
  }, [store.errors]);

  useEffect(() => {
    if (students !== undefined) {
      setLoading(false);
    }
  }, [store.admin]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (name === "department" || name === "year") {
      setLoading(true);
      if (value === "all") {
        if (
          (name === "department" && filter.year === "all") ||
          (name === "year" && filter.department === "all")
        ) {
          dispatch(getAllStudent());
        } else {
          const params = {};
          if (name === "department" && filter.year !== "all")
            params.year = filter.year;
          if (name === "year" && filter.department !== "all")
            params.department = filter.department;
          dispatch(getStudent(params));
        }
      } else {
        const params = { [name]: value };
        if (name === "department" && filter.year !== "all")
          params.year = filter.year;
        if (name === "year" && filter.department !== "all")
          params.department = filter.department;
        dispatch(getStudent(params));
      }
    }
  };

  const handleSearch = () => {
    setLoading(true);
    if (filter.department === "all" && filter.year === "all") {
      dispatch(getAllStudent());
    } else {
      const params = {};
      if (filter.department !== "all") params.department = filter.department;
      if (filter.year !== "all") params.year = filter.year;
      dispatch(getStudent(params));
    }
  };

  const handleClearFilters = () => {
    setFilter({
      department: "all",
      year: "all",
      searchQuery: ""
    });
    setError({});
    dispatch(getAllStudent());
  };

  const allStudents = useSelector((state) => state.admin.allStudent);
  const filteredStudents = useSelector((state) => state.admin.students.result);

  const students =
    filter.department === "all" && filter.year === "all"
      ? allStudents
      : filteredStudents;

  const searchedStudents = students?.filter((student) =>
    [student.name, student.email, student.username, student.section, student.batch]
      .join(" ")
      .toLowerCase()
      .includes(filter.searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StudentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant={isMobile ? "h6" : "h5"}>
              Student Management
            </Typography>
          </Box>

          <Chip
            label={`Total Students: ${students?.length || 0}`}
            color="primary"
            variant="outlined"
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addstudent")}
            fullWidth={isMobile}
            sx={{
              ml: { sm: "auto" },
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none"
            }}
          >
            Add Student
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          {/* Filters */}
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, display: "flex", alignItems: "center" }}
          >
            <Search sx={{ mr: 1 }} /> Search Filters
          </Typography>
          <Divider sx={{ mb: 2 }} />

        <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    flexWrap: "wrap",
    gap: 2,
  }}
>
  <FormControl sx={{ width: 250 }} size="small">
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

  <FormControl sx={{ width: 250 }} size="small">
    <InputLabel>Year</InputLabel>
    <Select
      name="year"
      value={filter.year}
      onChange={handleFilterChange}
      label="Year"
    >
      <MenuItem value="all">All Years</MenuItem>
      <MenuItem value="1">1st Year</MenuItem>
      <MenuItem value="2">2nd Year</MenuItem>
      <MenuItem value="3">3rd Year</MenuItem>
      <MenuItem value="4">4th Year</MenuItem>
    </Select>
  </FormControl>

  <TextField
    sx={{ width: 230}}
    name="searchQuery"
    value={filter.searchQuery}
    onChange={handleFilterChange}
    label="Search Students"
    variant="outlined"
    size="small"
  />

  <Button
    sx={{ width: 250}}
    variant="outlined"
    startIcon={<ClearAll />}
    onClick={handleClearFilters}
    size="small"
  >
    Clear
  </Button>
</Box>


          {/* Loading */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error */}
          {(error.noStudentError || error.backendError) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.noStudentError || error.backendError}
            </Alert>
          )}

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ mt: 3, overflowX: "auto", border: "1px solid #e0e0e0" }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <NameIcon sx={{ mr: 1, fontSize: 20 }} /> Name
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <UsernameIcon sx={{ mr: 1, fontSize: 20 }} /> Username
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EmailIcon sx={{ mr: 1, fontSize: 20 }} /> Email
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SectionIcon sx={{ mr: 1, fontSize: 20 }} /> Section
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BatchIcon sx={{ mr: 1, fontSize: 20 }} /> Batch
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Edit sx={{ mr: 1, fontSize: 20 }} /> Action
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedStudents?.length > 0 ? (
                  searchedStudents.map((student, idx) => (
                    <TableRow key={student._id} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {student.email}
                      </TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>{student.batch}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/UpdateStudent/${student._id}`)
                          }
                          size="small"
                          aria-label="edit student"
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "No students found matching your criteria."
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;
