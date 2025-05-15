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
  ClearAll
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getStudent, getAllStudent } from "../../../redux/actions/adminActions";
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
  Divider
} from "@mui/material";
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [filter, setFilter] = useState({
    department: "all",
    year: "all",
    searchQuery: ""
  });

  // Get all students by default on component mount
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    
    if (name === "department" || name === "year") {
      setLoading(true);
      if (value === "all") {
        if ((name === "department" && filter.year === "all") || 
            (name === "year" && filter.department === "all")) {
          dispatch(getAllStudent());
        } else {
          const params = {};
          if (name === "department" && filter.year !== "all") params.year = filter.year;
          if (name === "year" && filter.department !== "all") params.department = filter.department;
          dispatch(getStudent(params));
        }
      } else {
        const params = { [name]: value };
        if (name === "department" && filter.year !== "all") params.year = filter.year;
        if (name === "year" && filter.department !== "all") params.department = filter.department;
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
  
  const students = (filter.department === "all" && filter.year === "all") 
    ? allStudents 
    : filteredStudents;

  const searchedStudents = students?.filter(student => 
    student.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    student.username.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    student.section?.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    student.batch?.toLowerCase().includes(filter.searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (students !== undefined) {
      setLoading(false);
    }
  }, [students]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StudentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Student Management
          </Typography>
          <Chip 
            label={`Total Students: ${students?.length || 0}`} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          {/* Filter Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Search sx={{ mr: 1 }} /> Search Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              alignItems: 'center'
            }}>
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DepartmentIcon sx={{ mr: 1, fontSize: 20 }} /> Department
                  </Box>
                </InputLabel>
                <Select
                  name="department"
                  value={filter.department}
                  onChange={handleFilterChange}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DepartmentIcon sx={{ mr: 1, fontSize: 20 }} /> Department
                    </Box>
                  }
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments?.map((dp, idx) => (
                    <MenuItem key={idx} value={dp.department}>
                      {dp.department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <YearIcon sx={{ mr: 1, fontSize: 20 }} /> Year
                  </Box>
                </InputLabel>
                <Select
                  name="year"
                  value={filter.year}
                  onChange={handleFilterChange}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <YearIcon sx={{ mr: 1, fontSize: 20 }} /> Year
                    </Box>
                  }
                >
                  <MenuItem value="all">All Years</MenuItem>
                  <MenuItem value="1">1st Year</MenuItem>
                  <MenuItem value="2">2nd Year</MenuItem>
                  <MenuItem value="3">3rd Year</MenuItem>
                  <MenuItem value="4">4th Year</MenuItem>
                </Select>
              </FormControl>

              <TextField
                name="searchQuery"
                value={filter.searchQuery}
                onChange={handleFilterChange}
                label="Search Students"
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: 'action.active', mr: 1 }} />
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

              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleSearch}
                size="small"
                sx={{ ml: 'auto' }}
              >
                Search
              </Button>
            </Box>
          </Box>

          {/* Status Section */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {(error.noStudentError || error.backendError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.noStudentError || error.backendError}
            </Alert>
          )}

          {/* Student Table */}
          <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: 60 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <NameIcon sx={{ mr: 1, fontSize: 20 }} /> Name
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UsernameIcon sx={{ mr: 1, fontSize: 20 }} /> Username
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1, fontSize: 20 }} /> Email
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SectionIcon sx={{ mr: 1, fontSize: 20 }} /> Section
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BatchIcon sx={{ mr: 1, fontSize: 20 }} /> Batch
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedStudents?.length > 0 ? (
                  searchedStudents.map((student, idx) => (
                    <TableRow 
                      key={student._id} 
                      hover
                      sx={{ '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell sx={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {student.email}
                      </TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>{student.batch}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={6} 
                      sx={{ 
                        textAlign: 'center', 
                        py: 4,
                        color: 'text.secondary'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        'No students found matching your criteria'
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