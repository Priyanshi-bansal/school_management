import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    <div>


  {/* Section 1: Marks Header */}
      <Box
        sx={{
          p:2,
          display: 'flex',
          gap: 1,

        }}
      >
        
<CheckCircleIcon
  sx={{
    fontSize: 28,
    color: 'white',
    backgroundColor: 'blue',
    borderRadius: '50%',
    padding: '4px',
  }}
/>
        <Typography variant="h5" component="h1" color="text.primary" fontWeight={600} gap={2}>
          Student Test
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
          Test
        </Typography>
      </Box>

      <Grid container spacing={2} mb={3} alignItems="stretch">
      
      <Grid item xs={12} md={3} sx={{ display: 'flex' }}>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel id="department-label">Subject</InputLabel>
          <Select labelId="department-label" label="Subject" defaultValue="">
            <MenuItem value="">Select subject</MenuItem>
            <MenuItem value="Computer Science">Computer Science</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Mechanical">Mechanical</MenuItem>
          </Select>
        </FormControl>
      </Grid>

  
      <Grid item xs={12} md={3} sx={{ display: 'flex' }}>
        <FormControl fullWidth sx={{ flex: 1 }}>
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

 
      <Grid item xs={12} md={3} sx={{ display: 'flex' }}>
        <Button variant="contained" color="primary" fullWidth sx={{ flex: 1 }}>
          ReTest
        </Button>
      </Grid>

      
      <Grid item xs={12} md={3} sx={{ display: 'flex' }}>
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          sx={{ flex: 1 }}
          startIcon={<SearchIcon />}
        >
          Search Students
        </Button>
      </Grid>
    </Grid>

      
    </Box>

      {/* Section 3: Students Table */}

      <TableContainer component={Paper}    sx={{
        boxShadow: 3,        
        borderRadius: 2,     
        backgroundColor: 'background.paper',
        p: 3,
        mb: 4,              
      }}>
         <Button variant="outlined" color="primary" startIcon={<SearchIcon />} sx={{ width: '70%', mb:2 }}>
          Search Students
        </Button>
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


    </div>
  )
}

export default Body