import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Checkbox, Box, Typography, TextField
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const searchedFaculty = [
  {
    _id: "1",
    sectionName: "A",
    studentName: "Alice Johnson",
    studentEmail: "alice.johnson@example.com",
    class: "10A",
    academicYear: "2024-2025",
    classTeacher: "Hari"
  },
  {
    _id: "2",
    sectionName: "B",
    studentName: "Bob Smith",
    studentEmail: "bob.smith@example.com",
    class: "10B",
    academicYear: "2024-2025",
    classTeacher: "Ravi"
  },
  {
    _id: "3",
    sectionName: "C",
    studentName: "Clara Lee",
    studentEmail: "clara.lee@example.com",
    class: "10C",
    academicYear: "2024-2025",
    classTeacher: "Rahul"
  }
];

const Body = () => {
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckboxChange = (id) => {
    setSelectedFaculty((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <HowToRegIcon sx={{ color: 'text.primary', fontSize: 28 }} />
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Section Detail
        </Typography>
      </Box>

      {/* Search Box */}
      <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', mb: 2, width: '100%' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, class..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Box sx={{ ml: 2 }}>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                height: '40px',
              }}
              onClick={() => console.log("Search clicked:", searchTerm)}
            >
              Search
            </button>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table
            sx={{
              minWidth: 650,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedFaculty.length > 0 &&
                      selectedFaculty.length < searchedFaculty.length
                    }
                    checked={
                      searchedFaculty.length > 0 &&
                      selectedFaculty.length === searchedFaculty.length
                    }
                    onChange={() => {
                      if (selectedFaculty.length === searchedFaculty.length) {
                        setSelectedFaculty([]);
                      } else {
                        setSelectedFaculty(searchedFaculty.map((f) => f._id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>#</TableCell>
                <TableCell>Section Name</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Student Email</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Class Teacher</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedFaculty.length > 0 ? (
                searchedFaculty.map((fac, idx) => (
                  <TableRow key={fac._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFaculty.includes(fac._id)}
                        onChange={() => handleCheckboxChange(fac._id)}
                      />
                    </TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{fac.sectionName}</TableCell>
                    <TableCell>{fac.studentName}</TableCell>
                    <TableCell>{fac.studentEmail}</TableCell>
                    <TableCell>{fac.class}</TableCell>
                    <TableCell>{fac.academicYear}</TableCell>
                    <TableCell>{fac.classTeacher}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                    No faculty found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Body;
