import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

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
  { id: 1, name: 'John Doe', department: 'Computer Science', year: 2, section: 'A', test: 'Test 1', marks: 85 },
  { id: 2, name: 'Jane Smith', department: 'Electronics', year: 3, section: 'B', test: 'Test 2', marks: 90 },
   { id: 2, name: 'Jane Smith', department: 'Electronics', year: 3, section: 'B', test: 'Test 2', marks: 90 },
    { id: 2, name: 'Jane Smith', department: 'Electronics', year: 3, section: 'B', test: 'Test 2', marks: 90 },
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
        <AssignmentIcon sx={{ color: 'text.primary', fontSize: 28 }} />
        <Typography variant="h5" component="h1" color="text.primary" fontWeight={600}>
          Marks
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
          Marks
        </Typography>
      </Box>
<Grid container spacing={2} mb={3}>
  <Grid item xs={12} md={3}>
    <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
      <InputLabel id="department-label">Department</InputLabel>
      <Select labelId="department-label" label="Department">
        <MenuItem value="">Select Department</MenuItem>
        <MenuItem value="Computer Science">Computer Science</MenuItem>
        <MenuItem value="Electronics">Electronics</MenuItem>
        <MenuItem value="Mechanical">Mechanical</MenuItem>
      </Select>
    </FormControl>
  </Grid>

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

  <Grid item xs={12} md={3}>
    <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
      <InputLabel id="section-label">Section</InputLabel>
      <Select labelId="section-label" label="Section">
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
    <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
      <InputLabel id="test-label">Test</InputLabel>
      <Select labelId="test-label" label="Test">
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
              {['ID', 'Name', 'Department', 'Year', 'Section', 'Test', 'Marks'].map((header) => (
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
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.test}</TableCell>
                  <TableCell>{student.marks}</TableCell>
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