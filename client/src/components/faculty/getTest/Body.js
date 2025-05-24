import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';



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

  useEffect(() => {
    if (authData) {
      dispatch(getAllTest());
    } else {
      navigate('/faculty/login');
    }
  }, [authData, dispatch, navigate]);

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

    dispatch( uploadMark
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
        <Typography variant="h4" gutterBottom>
          Test Management
        </Typography>
        
        {/* Filters */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={filter.department}
                onChange={(e) => setFilter({...filter, department: e.target.value})}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
                <MenuItem value="Civil">Civil</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={filter.year}
                onChange={(e) => setFilter({...filter, year: e.target.value})}
                label="Year"
              >
                <MenuItem value="">All Years</MenuItem>
                <MenuItem value="1">First Year</MenuItem>
                <MenuItem value="2">Second Year</MenuItem>
                <MenuItem value="3">Third Year</MenuItem>
                <MenuItem value="4">Fourth Year</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Section</InputLabel>
              <Select
                value={filter.section}
                onChange={(e) => setFilter({...filter, section: e.target.value})}
                label="Section"
              >
                <MenuItem value="">All Sections</MenuItem>
                <MenuItem value="A">Section A</MenuItem>
                <MenuItem value="B">Section B</MenuItem>
                <MenuItem value="C">Section C</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel>Subject</InputLabel>
              <Select
                value={filter.subject}
                onChange={(e) => setFilter({...filter, subject: e.target.value})}
                label="Subject"
              >
                <MenuItem value="">All Subjects</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Tests Table */}
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Year/Section</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTests.length > 0 ? (
                  filteredTests.map((test) => (
                    <TableRow key={test._id} hover>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.subject}</TableCell>
                      <TableCell>{new Date(test.testDate).toLocaleDateString()}</TableCell>
                      <TableCell>{test.department}</TableCell>
                      <TableCell>{test.year}/{test.section}</TableCell>
                      <TableCell>{test.totalMarks}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleTestClick(test._id)}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenMarksDialog(test)}
                          sx={{ mr: 1 }}
                        >
                          Marks
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="secondary"
                          onClick={() => handleOpenAttendanceDialog(test)}
                        >
                          Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No tests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

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