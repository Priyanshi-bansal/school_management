import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Box, Grid, MenuItem, Select, InputLabel, FormControl, Typography, Button ,TextField } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';





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
    "id": 1,
    "name": "Rahul Sharma",
    "year": "2nd",
    "section": "A",
    "TotalLecture": 40,
    "TotalAttended": 35
  },
  {
    "id": 2,
    "name": "Anjali Patel",
    "year": "3rd",
    "section": "B",
    "TotalLecture": 38,
    "TotalAttended": 36
  },
  {
    "id": 3,
    "name": "Vikram Singh",
    "year": "1st",
    "section": "C",
    "TotalLecture": 42,
    "TotalAttended": 40
  }
]
function Body() {
  return (
    <div>
 
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
  <GroupsIcon sx={{ color: 'text.primary', fontSize: 28 }} />
  <Typography variant="h5" component="h1" color="text.primary" fontWeight={600}>
    Student Attendance
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
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small" sx={{ minHeight: 40 }}>
          <InputLabel id="department-label">StudentName</InputLabel>
          <Select labelId="department-label" label="Department">
            <MenuItem value="">Select Name</MenuItem>
            <MenuItem value="Computer Science">varsha</MenuItem>
            <MenuItem value="Electronics">Nikita</MenuItem>
            <MenuItem value="Mechanical">Priyanshi</MenuItem>
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