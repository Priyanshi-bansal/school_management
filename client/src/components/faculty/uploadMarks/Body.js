import React, { useEffect, useState } from "react";
import {
  Assignment as TestIcon,
  Search,
  Upload,
  Clear,
  Person,
  CheckCircle,
  Error as ErrorIcon
} from "@mui/icons-material";
import {
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getStudent, uploadMark, getTest } from "../../../redux/actions/facultyActions";
import { MARKS_UPLOADED, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const store = useSelector((state) => state);

  const [loading, setLoading] = useState(false);
  const [testsLoading, setTestsLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const [marks, setMarks] = useState([]);

  const [filters, setFilters] = useState({
    department: user.result.department,
    year: "",
    section: "",
    test: ""
  });

  const students = useSelector((state) => state.admin.students.result);
  const tests = useSelector((state) => state.faculty.tests.result);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
      setTestsLoading(false);
      setSuccess(false);
    }
  }, [store.errors]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  useEffect(() => {
    if (store.faculty.marksUploaded) {
      setLoading(false);
      setSuccess(true);
      setFilters(prev => ({ ...prev, test: "" }));
      setMarks([]);
      setTimeout(() => setSuccess(false), 3000);
      dispatch({ type: MARKS_UPLOADED, payload: false });
    }
  }, [store.faculty.marksUploaded]);

  useEffect(() => {
    if (filters.year && filters.section) {
      setTestsLoading(true);
      dispatch(getTest({
        department: filters.department,
        year: filters.year,
        section: filters.section
      }))
      .finally(() => setTestsLoading(false));
    } else {
      setFilters(prev => ({ ...prev, test: "" }));
    }
  }, [filters.year, filters.section, dispatch]);

  const handleMarkChange = (value, studentId) => {
    setMarks(prev => {
      const existingIndex = prev.findIndex(m => m._id === studentId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { _id: studentId, value };
        return updated;
      }
      return [...prev, { _id: studentId, value }];
    });
  };

 const handleSearch = (e) => {
  e.preventDefault();
  if (!filters.test) return;

  setLoading(true);
  setError({});
  setMarks([]);

  dispatch(getStudent({
    department: filters.department,
    year: filters.year,
    section: filters.section
  }))
    .then(() => {
      setLoading(false);
    })
    .catch((err) => {
      setError(err.response?.data || {});
      setLoading(false);
    });
};

const handleUpload = () => {
  if (marks.length === 0) return;

  setLoading(true);

  dispatch(uploadMark(
    marks,
    filters.department,
    filters.section,
    filters.year,
    filters.test
  ))
    .then(() => {
      setLoading(false);
    })
    .catch((err) => {
      setError(err.response?.data || {});
      setLoading(false);
    });
};

  const handleReset = () => {
    setFilters({ ...filters, year: "", section: "", test: "" });
    setError({});
    setMarks([]);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <TestIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">Upload Test Marks</Typography>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
            Marks uploaded successfully!
          </Alert>
        )}
        {(error.noStudentError || error.backendError) && (
          <Alert severity="error" sx={{ mb: 3 }} icon={<ErrorIcon />}>
            {error.noStudentError || error.backendError}
          </Alert>
        )}

        {/* Filter Form */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Search color="primary" sx={{ mr: 1 }} />
              Search Criteria
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
              gap: 2
            }}>
              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Department</InputLabel>
                <Select value={filters.department} disabled>
                  <MenuItem value={filters.department}>{filters.department}</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Year</InputLabel>
                <Select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value, test: "" })}
                >
                  <MenuItem value="">Select Year</MenuItem>
                  {[1, 2, 3, 4].map(year => (
                    <MenuItem key={year} value={year.toString()}>Year {year}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Section</InputLabel>
                <Select
                  value={filters.section}
                  onChange={(e) => setFilters({ ...filters, section: e.target.value, test: "" })}
                >
                  <MenuItem value="">Select Section</MenuItem>
                  {['A', 'B', 'C'].map(section => (
                    <MenuItem key={section} value={section}>Section {section}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Test</InputLabel>
                <Select
                  value={filters.test}
                  onChange={(e) => setFilters({ ...filters, test: e.target.value })}
                  disabled={!filters.year || !filters.section || testsLoading}
                  endAdornment={testsLoading && <CircularProgress size={20} sx={{ mr: 2 }} />}
                >
                  <MenuItem value="">Select Test</MenuItem>
                  {tests?.map((test, idx) => (
                    <MenuItem key={idx} value={test.test}>
                      {test.test} ({test.subjectCode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 3,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider'
            }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleReset}
                sx={{ mr: 2 }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleSearch}
                disabled={!filters.year || !filters.section || !filters.test || loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Search Students"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Students List */}
        {loading && !students?.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : students?.length > 0 ? (
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Students List - {filters.test}</Typography>
                <Chip
                  label={`${marks.length} marks entered`}
                  color={marks.length === students.length ? "success" : "warning"}
                />
              </Box>

              <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>PRN</TableCell>
                      <TableCell>Section</TableCell>
                      <TableCell align="right">Marks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student, idx) => (
                      <TableRow key={student._id} hover>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 1.5 }}>
                              {student.name.charAt(0)}
                            </Avatar>
                            {student.name}
                          </Box>
                        </TableCell>
                        <TableCell>{student.username}</TableCell>
                        <TableCell>Sec {student.section}</TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            sx={{ width: 100 }}
                            inputProps={{ min: 0, max: 100, step: "0.01" }}
                            onChange={(e) => handleMarkChange(e.target.value, student._id)}
                            defaultValue={student.marks?.[filters.test] || ""}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={handleUpload}
                  disabled={marks.length === 0 || loading}
                  size="large"
                  sx={{ px: 4 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Marks"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ textAlign: 'center', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Person sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No students to display
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please select search criteria and click "Search Students"
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Body;