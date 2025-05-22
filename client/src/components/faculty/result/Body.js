import React, { useState } from "react";
import {
  Description as ResultIcon,
  Search,
  FilterAlt,
  Download,
  Clear,
  Description
} from "@mui/icons-material";
import {
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress,
  Skeleton
} from "@mui/material";

const Body = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    department: "Computer",
    year: "3",
    section: "A",
    subject: "CS301",
    testType: "Midterm",
    examMonth: "2023-05"
  });
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setResults([
        {
          id: 1,
          prn: "2020112345",
          name: "John Doe",
          seatNo: "12345",
          marks: 85,
          grade: "A",
          examMonth: "May 2023",
          subject: "Computer Science"
        },
        {
          id: 2,
          prn: "2020112346",
          name: "Jane Smith",
          seatNo: "12346",
          marks: 78,
          grade: "B+",
          examMonth: "May 2023",
          subject: "Computer Science"
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFilters({
      department: "",
      year: "",
      section: "",
      subject: "",
      testType: "",
      examMonth: ""
    });
    setResults([]);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ResultIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }} />
            <Typography variant="h5" fontWeight="bold">Student Results</Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ mr: 1 }}
              disabled={results.length === 0}
            >
              PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              disabled={results.length === 0}
            >
              Excel
            </Button>
          </Box>
        </Box>

        {/* Filter Card */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterAlt color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Filter Results</Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Department</InputLabel>
                <Select
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                >
                  <MenuItem value="Computer">Computer Science</MenuItem>
                  <MenuItem value="Mechanical">Mechanical</MenuItem>
                  <MenuItem value="Electrical">Electrical</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Year</InputLabel>
                <Select
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                >
                  <MenuItem value="1">First Year</MenuItem>
                  <MenuItem value="2">Second Year</MenuItem>
                  <MenuItem value="3">Third Year</MenuItem>
                  <MenuItem value="4">Fourth Year</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Section</InputLabel>
                <Select
                  value={filters.section}
                  onChange={(e) => setFilters({...filters, section: e.target.value})}
                >
                  <MenuItem value="A">Section A</MenuItem>
                  <MenuItem value="B">Section B</MenuItem>
                  <MenuItem value="C">Section C</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Subject</InputLabel>
                <Select
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                >
                  <MenuItem value="CS101">CS101 - Programming</MenuItem>
                  <MenuItem value="CS102">CS102 - Databases</MenuItem>
                  <MenuItem value="CS103">CS103 - Algorithms</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel className="bg-white">Test Type</InputLabel>
                <Select
                  value={filters.testType}
                  onChange={(e) => setFilters({...filters, testType: e.target.value})}
                >
                  <MenuItem value="Midterm">Midterm</MenuItem>
                  <MenuItem value="Final">Final</MenuItem>
                  <MenuItem value="Quiz">Quiz</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Exam Month/Year"
                type="month"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filters.examMonth}
                onChange={(e) => setFilters({...filters, examMonth: e.target.value})}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleReset}
                sx={{ mr: 2 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Search"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results Section */}
        {loading ? (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" height={40} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <Card sx={{ borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>PRN</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Seat No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Marks</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Grade</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id} hover>
                      <TableCell>{result.prn}</TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>{result.seatNo}</TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell align="right">{result.marks}</TableCell>
                      <TableCell align="center">
                        <Box 
                          sx={{ 
                            display: 'inline-block', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            backgroundColor: 
                              result.grade === 'A' ? '#e8f5e9' : 
                              result.grade === 'B+' ? '#e3f2fd' : '#fff8e1',
                            color: 
                              result.grade === 'A' ? '#2e7d32' : 
                              result.grade === 'B+' ? '#1565c0' : '#ff8f00'
                          }}
                        >
                          {result.grade}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Button 
                          size="small" 
                          startIcon={<Download />}
                          onClick={() => console.log('Download', result.id)}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ) : (
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <Description sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Apply filters and search to view student results
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Body;