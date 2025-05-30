import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography, Button, TextField } from '@mui/material';
import HailIcon from '@mui/icons-material/Hail';

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
  { id: 1, name: 'John Doe', Subject: 'Computer Science', Attendance:'Present', Date: '2025-05-28' },
  { id: 2, name: 'Jane Smith', Subject: 'Electronics', Attendance: 'Absent', Date: '2025-05-28'},
   { id: 2, name: 'Jane Smith', Subject: 'Electronics', Attendance: 'Late', Date: '2025-05-28'},
    { id: 2, name: 'Jane Smith', Subject: 'Electronics', Attendance: 'Present', Date: '2025-05-28' },
];


function Body() {
  return (
    <>

      {/* Section 1: Marks Header */}
      <Box
        sx={{
          p:2,
          display: 'flex',

        }}
      >
        <HailIcon sx={{ color: 'text.primary', fontSize: 28 }} />
        <Typography variant="h5" component="h1" color="text.primary" fontWeight={600}>
        
         DailyAttendance
        </Typography>
      </Box>

      {/* Section 2: Search Criteria */}
    <Box
      sx={{
        boxShadow: 3,        // Add shadow
        borderRadius: 2,     // Rounded corners
        backgroundColor: 'background.paper',
        p: 3,
        mb: 4,               // margin bottom for spacing
      }}
    >
      <Box sx={{ alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h6" color="black" fontWeight={1000}>
        Attendance
        </Typography>
      </Box>
<Grid container spacing={2} mb={4}>
      {/* Subject Dropdown */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
          <InputLabel id="subject-label">Subject</InputLabel>
          <Select labelId="subject-label" label="Subject">
            <MenuItem value="">Select Subject</MenuItem>
            <MenuItem value="Computer Science">Computer Science</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Mechanical">Mechanical</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Date Picker */}
      <Grid item xs={12} md={4}>
        <TextField
          label="Date"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      {/* Attendance Dropdown */}
      <Grid item xs={12} md={4}>
        <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
          <InputLabel id="attendance-label">Attendance</InputLabel>
          <Select labelId="attendance-label" label="Attendance">
            <MenuItem value="">Select Attendance</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
            <MenuItem value="Present">Present</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Optional Year Dropdown (Uncomment if needed) */}
      {/* 
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
          <InputLabel id="year-label">Year</InputLabel>
          <Select labelId="year-label" label="Year">
            <MenuItem value="">Select Year</MenuItem>
            {[1, 2, 3, 4].map((yr) => (
              <MenuItem key={yr} value={yr}>
                {yr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      */}
    </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" color="primary">
          Re Start
        </Button>
        <Button variant="outlined" color="inherit" startIcon={<SearchIcon />}>
          Search Students
        </Button>
      </Box>
    </Box>

      {/* Section 3: Students Table */}

      <TableContainer component={Paper}    sx={{
        boxShadow: 3,        
        borderRadius: 2,     
        backgroundColor: 'background.paper',
        p: 3,
        mb: 4,              
      }}>
        <Table aria-label="students table" size="small" sx={{
        boxShadow: 3,        
        borderRadius: 2,     
        backgroundColor: 'background.paper',
        p: 3,
                 
      }}> 
          <TableHead sx={{ backgroundColor: 'grey.200',}}>
            <TableRow sx={{ height: 30 }}>
              {['ID', 'Name', 'Subject', 'Attendance', 'Date'].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 800,   }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell  align="center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} hover sx={{ height: 50}}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.Subject}</TableCell>
                  <TableCell>{student.Attendance}</TableCell>
                   <TableCell>{student.Date}</TableCell>
                
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </>
  )
}

export default Body