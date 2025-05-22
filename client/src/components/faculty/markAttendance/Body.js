import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle as CheckCircleIcon,
  Clear,
  CalendarToday,
  Class,
  Person,
  Group,
  School,
  ListAlt
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox
} from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef();

  // Sample students data - in real app, this would come from API
  const [students, setStudents] = useState([
    { id: 1, rollNo: '001', name: 'John Doe', present: false },
    { id: 2, rollNo: '002', name: 'Jane Smith', present: true },
    { id: 3, rollNo: '003', name: 'Robert Johnson', present: false },
    { id: 4, rollNo: '004', name: 'Emily Davis', present: true },
    { id: 5, rollNo: '005', name: 'Michael Brown', present: false },
  ]);

  const [attendanceData, setAttendanceData] = useState({
    subjectName: "",
    section: "",
    year: "",
    date: new Date().toISOString().split('T')[0],
    department: user.result.department,
  });

  const handleStudentToggle = (studentId) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present } 
        : student
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Here you would dispatch an action to save attendance
    console.log({
      ...attendanceData,
      attendance: students.map(s => ({
        studentId: s.id,
        present: s.present
      }))
    });
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message or handle errors
    }, 1500);
  };

  const resetForm = () => {
    setAttendanceData({
      subjectName: "",
      section: "",
      year: "",
      date: new Date().toISOString().split('T')[0],
      department: user.result.department,
    });
    setStudents(students.map(s => ({ ...s, present: false })));
    setError({});
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <CheckCircleIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Class Information */}
              <div className="space-y-5">
                <Typography variant="h6" className="text-gray-700 mb-4 flex items-center">
                  <Class className="text-indigo-600 mr-2" />
                  Class Details
                </Typography>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <School className="text-gray-500 mr-2" fontSize="small" />
                    Department
                  </label>
                  <input
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    type="text"
                    value={user.result.department}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <ListAlt className="text-gray-500 mr-2" fontSize="small" />
                    Subject Name
                  </label>
                  <input
                    placeholder="Enter subject name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={attendanceData.subjectName}
                    onChange={(e) => setAttendanceData({ ...attendanceData, subjectName: e.target.value })}
                  />
                </div>
              </div>

              {/* Right Column - Session Information */}
              <div className="space-y-5">
                <Typography variant="h6" className="text-gray-700 mb-4 flex items-center">
                  <Group className="text-indigo-600 mr-2" />
                  Session Information
                </Typography>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <FormControl fullWidth>
                      <Select
                        required
                        value={attendanceData.year}
                        onChange={(e) => setAttendanceData({ ...attendanceData, year: e.target.value })}
                        sx={{
                          borderRadius: '8px',
                          height: '42px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                          },
                        }}
                      >
                        <MenuItem value="">Select year</MenuItem>
                        <MenuItem value="1">1st Year</MenuItem>
                        <MenuItem value="2">2nd Year</MenuItem>
                        <MenuItem value="3">3rd Year</MenuItem>
                        <MenuItem value="4">4th Year</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section
                    </label>
                    <FormControl fullWidth>
                      <Select
                        required
                        value={attendanceData.section}
                        onChange={(e) => setAttendanceData({ ...attendanceData, section: e.target.value })}
                        sx={{
                          borderRadius: '8px',
                          height: '42px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                          },
                        }}
                      >
                        <MenuItem value="">Select section</MenuItem>
                        <MenuItem value="1">Section 1</MenuItem>
                        <MenuItem value="2">Section 2</MenuItem>
                        <MenuItem value="3">Section 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <CalendarToday className="text-gray-500 mr-2" fontSize="small" />
                    Date
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="date"
                    value={attendanceData.date}
                    onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Students List */}
            <Divider className="my-6" />
            
            <Typography variant="h6" className="text-gray-700 mb-4 flex items-center">
              <Person className="text-indigo-600 mr-2" />
              Students List
            </Typography>

            <TableContainer component={Paper} className="shadow-sm rounded-lg border border-gray-200">
              <Table>
                <TableHead className="bg-gray-50">
                  <TableRow>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell align="center">Present</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={student.present}
                          onChange={() => handleStudentToggle(student.id)}
                          color="primary"
                          icon={<CheckCircleIcon />}
                          checkedIcon={<CheckCircleIcon className="text-green-500" />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={resetForm}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<CheckCircleIcon />}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    message="Saving Attendance..."
                    height={24}
                    width={150}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Save Attendance"
                )}
              </Button>
            </div>

            {/* Error Display */}
            <div ref={errorRef}>
              {error.backendError && (
                <Box className="mt-4 p-3 bg-red-50 rounded-lg">
                  <Typography className="text-red-600 text-sm">
                    {error.backendError}
                  </Typography>
                </Box>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;