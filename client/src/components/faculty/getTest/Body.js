import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import {
  getAllTest,
  getTest,
  uploadMark,
  markAttendance
} from '../../../redux/actions/facultyActions';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Snackbar,
  Grid,
  Alert
} from '@mui/material';
const students = [
  { id: 1, name: 'John Doe', department: 'Computer Science', year: 2, section: 'A', test: 'Test 1', marks: 85 },
  { id: 2, name: 'Jane Smith', department: 'Electronics', year: 3, section: 'B', test: 'Test 2', marks: 90 },
  { id: 2, name: 'Jane Smith', department: 'Electronics', year: 3, section: 'B', test: 'Test 2', marks: 90 },
  { id: 2, name: 'Jane Smith', department: 'Electronics', year: 3, section: 'B', test: 'Test 2', marks: 90 },
];



const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authData, tests, loading, error } = useSelector((state) => state.faculty);
  const { allStudent } = useSelector((state) => state.admin);

  const [selectedTest, setSelectedTest] = useState(null);
  const [marksDialogOpen, setMarksDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [marksData, setMarksData] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filter, setFilter] = useState({
    department: '',
    year: '',
    section: '',
    subject: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // useEffect(() => {
  //   if (authData) {
  //     dispatch(getAllTest());
  //   } else {
  //     navigate('/faculty/login');
  //   }
  // }, [authData, dispatch, navigate]);

  const handleTestClick = (testId) => {
    dispatch(getTest(testId))
      .unwrap()
      .then((data) => {
        setSelectedTest(data);
      });
  };

  const handleOpenMarksDialog = (test) => {
    setSelectedTest(test);
    // Initialize marks data with existing marks if available
    const initialMarks = {};
    test.marks.forEach(mark => {
      initialMarks[mark.studentId] = mark.score;
    });
    setMarksData(initialMarks);
    setMarksDialogOpen(true);
  };

  const handleOpenAttendanceDialog = (test) => {
    setSelectedTest(test);
    // Initialize with students already marked present
    const presentStudents = test.attendance
      .filter(a => a.present)
      .map(a => a.studentId);
    setSelectedStudents(presentStudents);
    setAttendanceDialogOpen(true);
  };

  const handleMarksChange = (studentId, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmitMarks = () => {
    const marksArray = Object.entries(marksData).map(([studentId, score]) => ({
      studentId,
      score: Number(score)
    }));

    dispatch(uploadMark
      ({
        marks: marksArray,
        department: selectedTest.department,
        section: selectedTest.section,
        year: selectedTest.year,
        test: selectedTest._id
      }))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Marks uploaded successfully!',
          severity: 'success'
        });
        setMarksDialogOpen(false);
        dispatch(getAllTest());
      })
      .catch(error => {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to upload marks',
          severity: 'error'
        });
      });
  };

  const handleSubmitAttendance = () => {
    dispatch(markAttendance({
      selectedStudents,
      subjectName: selectedTest.subject,
      department: selectedTest.department,
      year: selectedTest.year,
      section: selectedTest.section
    }))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Attendance marked successfully!',
          severity: 'success'
        });
        setAttendanceDialogOpen(false);
        dispatch(getAllTest());
      })
      .catch(error => {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to mark attendance',
          severity: 'error'
        });
      });
  };

  const filteredTests = tests.filter(test => {
    return (
      (!filter.department || test.department === filter.department) &&
      (!filter.year || test.year === filter.year) &&
      (!filter.section || test.section === filter.section) &&
      (!filter.subject || test.subject === filter.subject)
    );
  });

  const getStudentName = (studentId) => {
    const student = allStudent.find(s => s._id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (

    <Box p={3}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AssignmentIcon color="primary" fontSize="large" />
        <Typography variant="h4">
          Get Test
        </Typography>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          p: 3,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 1000, color: 'text.primary' }}>
            Filters
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select labelId="department-label" label="Department" defaultValue="">
                <MenuItem value="">Select Department</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="year-label">Year</InputLabel>
              <Select labelId="year-label" label="Year" defaultValue="">
                <MenuItem value="">Select Year</MenuItem>
                {[1, 2, 3, 4].map((yr) => (
                  <MenuItem key={yr} value={yr}>
                    {yr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="section-label">Section</InputLabel>
              <Select labelId="section-label" label="Section" defaultValue="">
                <MenuItem value="">Select Section</MenuItem>
                {['A', 'B', 'C'].map((sec) => (
                  <MenuItem key={sec} value={sec}>
                    {sec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="test-label">Test</InputLabel>
              <Select labelId="test-label" label="Test" defaultValue="">
                <MenuItem value="">Select Test</MenuItem>
                {['Test 1', 'Test 2', 'Test 3'].map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" color="primary">
            Re Test
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<SearchIcon />}>
            Search Students
          </Button>
        </Box>
      </Box>



      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          p: 3,
          mb: 4,
        }}
      >
        <Table aria-label="students table" size="small" sx={{
        boxShadow: 3,        
        borderRadius: 2,     
        backgroundColor: 'background.paper',
        p: 3,}}
        
        >
          <TableHead sx={{ backgroundColor: 'grey.200' }}>
            <TableRow sx={{ height: 30 }}>
              {['ID', 'Name', 'Department', 'Year', 'Section', 'Test', 'Marks', 'Actions'].map(
                (header) => (
                  <TableCell key={header} sx={{ fontWeight: 800 }}>
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} hover sx={{ height: 50 }}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.test}</TableCell>
                  <TableCell>{student.marks}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                      View
                    </Button>
                    <Button variant="contained" size="small" color="primary">
                      Marks
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Test Details Section */}
      {selectedTest && (
        <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Test Details: {selectedTest.testName}
          </Typography>

          <Box display="flex" gap={3} mb={3}>
            <Box>
              <Typography variant="subtitle1">Subject: {selectedTest.subject}</Typography>
              <Typography variant="subtitle1">Date: {new Date(selectedTest.testDate).toLocaleDateString()}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Department: {selectedTest.department}</Typography>
              <Typography variant="subtitle1">Year/Section: {selectedTest.year}/{selectedTest.section}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Total Marks: {selectedTest.totalMarks}</Typography>
              <Typography variant="subtitle1">Duration: {selectedTest.duration} mins</Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Description:
          </Typography>
          <Typography paragraph>
            {selectedTest.description || 'No description provided.'}
          </Typography>

          {/* Marks Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Marks
          </Typography>
          {selectedTest.marks.length > 0 ? (
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Marks Obtained</TableCell>
                    <TableCell>Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedTest.marks.map((mark) => (
                    <TableRow key={mark.studentId}>
                      <TableCell>{getStudentName(mark.studentId)}</TableCell>
                      <TableCell>{mark.score}</TableCell>
                      <TableCell>
                        {((mark.score / selectedTest.totalMarks) * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No marks recorded yet.
            </Typography>
          )}

          {/* Attendance Section */}
          <Typography variant="h6" gutterBottom>
            Attendance
          </Typography>
          {selectedTest.attendance.length > 0 ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                Total Students: {selectedTest.attendance.length} |
                Present: {selectedTest.attendance.filter(a => a.present).length} |
                Absent: {selectedTest.attendance.filter(a => !a.present).length}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedTest.attendance.map((att) => (
                  <Chip
                    key={att.studentId}
                    label={getStudentName(att.studentId)}
                    color={att.present ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No attendance recorded yet.
            </Typography>
          )}
        </Paper>
      )}

      {/* Marks Dialog */}
      <Dialog
        open={marksDialogOpen}
        onClose={() => setMarksDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Upload Marks for {selectedTest?.testName}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Department: {selectedTest?.department} |
            Year/Section: {selectedTest?.year}/{selectedTest?.section} |
            Total Marks: {selectedTest?.totalMarks}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Marks Obtained</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allStudent
                  .filter(student =>
                    student.department === selectedTest?.department &&
                    student.year === selectedTest?.year &&
                    student.section === selectedTest?.section
                  )
                  .map(student => (
                    <TableRow key={student._id}>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={marksData[student._id] || ''}
                          onChange={(e) => handleMarksChange(student._id, e.target.value)}
                          inputProps={{
                            min: 0,
                            max: selectedTest?.totalMarks,
                            step: 0.01
                          }}
                          sx={{ width: 100 }}
                        />
                        /{selectedTest?.totalMarks}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMarksDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitMarks}
            variant="contained"
            color="primary"
          >
            Upload Marks
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Mark Attendance for {selectedTest?.testName}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Subject: {selectedTest?.subject} |
            Department: {selectedTest?.department} |
            Year/Section: {selectedTest?.year}/{selectedTest?.section}
          </Typography>

          <List>
            {allStudent
              .filter(student =>
                student.department === selectedTest?.department &&
                student.year === selectedTest?.year &&
                student.section === selectedTest?.section
              )
              .map(student => (
                <React.Fragment key={student._id}>
                  <ListItem>
                    <Checkbox
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleStudentSelect(student._id)}
                    />
                    <ListItemText
                      primary={`${student.firstName} ${student.lastName}`}
                      secondary={`Roll No: ${student.rollNumber}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitAttendance}
            variant="contained"
            color="secondary"
          >
            Mark Attendance
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Body;