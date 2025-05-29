import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography, Button, TextField } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';





import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
const students = [
  {
    id: 1,
    name: "Alice Johnson",
    date: "2025-05-28",
    department: "Computer Science",
    attendance: "Present"
  },
  {
    id: 2,
    name: "Bob Smith",
    date: "2025-05-28",
    department: "Electrical Engineering",
    attendance: "Absent"
  },
  {
    id: 3,
    name: "Cathy Brown",
    date: "2025-05-28",
    department: "Mechanical Engineering",
    attendance: "Present"
  }
];

function Body() {
  return (
    <div>

     <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
  <HowToRegIcon sx={{ color: 'text.primary', fontSize: 28 }} />
  <Typography variant="h5" component="h1" color="text.primary" fontWeight={600}>
    Faculty Attendance
  </Typography>
</Box>
      {/* Section 2: Search Criteria */}
      <Box
        sx={{
          boxShadow: 3,
          backgroundColor: 'background.paper',
          p: 3,
          mb: 4,
        }}
      >
        <Box sx={{ alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6" color="black" fontWeight={1000}>
            Attendance
          </Typography>
        </Box>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
              <InputLabel id="department-label">Faculty</InputLabel>
              <Select labelId="department-label" label="Department">
                <MenuItem value="">Select Faculty</MenuItem>
                <MenuItem value="Computer Science">varsha</MenuItem>
                <MenuItem value="Electronics">Nikita</MenuItem>
                <MenuItem value="Mechanical">Priyanshi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select labelId="department-label" label="Department">
                <MenuItem value="">Select Department</MenuItem>
                <MenuItem value="Computer Science">computer science </MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
              <InputLabel id="department-label">Attendance</InputLabel>
              <Select labelId="department-label" label="Department">

                <MenuItem value="Computer Science">absent </MenuItem>
                <MenuItem value="Electronics">present</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Select Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" color="primary">
            ReSet
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<SearchIcon />}>
            Search Students
          </Button>
        </Box>
      </Box>

      {/* Section 3: Students Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          p: 3,
          mb: 4,
        }}
      >
        <Table
          aria-label="students table"
          size="small"
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            p: 3,
          }}
        >
          <TableHead sx={{ backgroundColor: 'grey.200' }}>
            <TableRow sx={{ height: 30 }}>
              {['ID', 'Name', 'Date', 'Department', 'Attendance'].map((header, index) => (
                <TableCell key={index} sx={{ fontWeight: 800 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} hover sx={{ height: 50 }}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.date}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.attendance}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>



    </div>
  )
}

export default Body