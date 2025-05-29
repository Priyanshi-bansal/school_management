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
const students =[
  {
    "id": 1,
    "name": "Varsha",
    "year": 3,
    "section": "A",
    "TotalLecture": 60,
    "TotalAttended": 55
  },
  {
    "id": 2,
    "name": "Nikita",
    "year": 2,
    "section": "B",
    "TotalLecture": 60,
    "TotalAttended": 48
  },
  {
    "id": 3,
    "name": "Priyanshi",
    "year": 4,
    "section": "C",
    "TotalLecture": 60,
    "TotalAttended": 58
  }
]


function Body() {
  return (
    <div>


           <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HowToRegIcon sx={{ color: 'text.primary', fontSize: 28 }} />
        <Typography variant="h5" component="h1" color="text.primary" fontWeight={600}>
          Student Attendance
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
              
             <Grid container spacing={2}>
        {/* Student Name Dropdown */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="student-name-label">Student Name</InputLabel>
            <Select labelId="student-name-label" label="Student Name" defaultValue="">
              <MenuItem value="">Select Name</MenuItem>
              <MenuItem value="Varsha">Varsha</MenuItem>
              <MenuItem value="Nikita">Nikita</MenuItem>
              <MenuItem value="Priyanshi">Priyanshi</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Year Dropdown */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
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

        {/* Section Dropdown */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
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

        {/* Attendance Dropdown */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="attendance-label">Attendance</InputLabel>
            <Select labelId="attendance-label" label="Attendance" defaultValue="">
              <MenuItem value="absent">Absent</MenuItem>
              <MenuItem value="present">Present</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date Picker */}
        <Grid item xs={12} md={2}>
          <TextField
            label="Select Date"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 , m: 2 }}>
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
                    {['ID', 'Name', 'Year', 'Section', 'Total Lecture', 'Total Attended', 'Action'].map((header, index) => (
                      <TableCell key={index} sx={{ fontWeight: 800 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={7}>
                        No students found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id} hover sx={{ height: 50 }}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.TotalLecture}</TableCell>
                        <TableCell>{student.TotalAttended}</TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                            View
                          </Button>
                        </TableCell>
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