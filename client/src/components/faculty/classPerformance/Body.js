import React, { useState, useEffect } from "react";
import {
  Assessment as PerformanceIcon,
  Search,
  FilterAlt,
  School,
  People,
  TrendingUp,
  ArrowUpward,
  ArrowDownward
} from "@mui/icons-material";
import {
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  CircularProgress,
  Chip,
  Divider,
  TableContainer
} from "@mui/material";

const Body = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    department: "Computer Science",
    year: "3",
    section: "A",
    subject: "Algorithms"
  });
  const [performanceData, setPerformanceData] = useState(null);

  // Sample data
  const sampleData = {
    averageScore: 72.5,
    passPercentage: 86.4,
    topPerformer: { name: "Emily Davis", marks: 92 },
    needsImprovement: { name: "Michael Brown", marks: 58 },
    students: [
      { id: 1, name: "John Doe", marks: 85, grade: "A", improvement: "+8%" },
      { id: 2, name: "Jane Smith", marks: 78, grade: "B+", improvement: "+5%" },
      { id: 3, name: "Robert Johnson", marks: 65, grade: "C", improvement: "-2%" },
      { id: 4, name: "Emily Davis", marks: 92, grade: "A+", improvement: "+12%" },
      { id: 5, name: "Michael Brown", marks: 58, grade: "D", improvement: "-5%" }
    ]
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setPerformanceData(sampleData);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setFilters({
      department: "Computer Science",
      year: "",
      section: "",
      subject: ""
    });
    setPerformanceData(null);
  };

  useEffect(() => {
    handleSearch(); // Load initial data
  }, []);

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return 'success';
      case 'A': return 'success';
      case 'B+': return 'primary';
      case 'B': return 'primary';
      case 'C': return 'warning';
      case 'D': return 'error';
      case 'F': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Class Performance
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Search />}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Refresh"}
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              label="Department"
            >
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="Electrical">Electrical</MenuItem>
              <MenuItem value="Mechanical">Mechanical</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              label="Year"
            >
              <MenuItem value="1">First Year</MenuItem>
              <MenuItem value="2">Second Year</MenuItem>
              <MenuItem value="3">Third Year</MenuItem>
              <MenuItem value="4">Fourth Year</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Section</InputLabel>
            <Select
              value={filters.section}
              onChange={(e) => setFilters({...filters, section: e.target.value})}
              label="Section"
            >
              <MenuItem value="A">Section A</MenuItem>
              <MenuItem value="B">Section B</MenuItem>
              <MenuItem value="C">Section C</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Subject</InputLabel>
            <Select
              value={filters.subject}
              onChange={(e) => setFilters({...filters, subject: e.target.value})}
              label="Subject"
            >
              <MenuItem value="Algorithms">Algorithms</MenuItem>
              <MenuItem value="Databases">Databases</MenuItem>
              <MenuItem value="Networks">Networks</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : performanceData ? (
        <>
          {/* Key Metrics */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School color="primary" sx={{ mr: 1 }} />
                  <Typography>Class Average</Typography>
                </Box>
                <Typography variant="h4">{performanceData.averageScore}%</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={performanceData.averageScore} 
                  sx={{ mt: 1, height: 6 }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography>Pass Percentage</Typography>
                </Box>
                <Typography variant="h4">{performanceData.passPercentage}%</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={performanceData.passPercentage} 
                  sx={{ mt: 1, height: 6 }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People color="primary" sx={{ mr: 1 }} />
                  <Typography>Top Performer</Typography>
                </Box>
                <Typography variant="h5">{performanceData.topPerformer.name}</Typography>
                <Typography variant="body1">{performanceData.topPerformer.marks}%</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Student Performance Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Student Performance</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell align="right">Marks</TableCell>
                      <TableCell align="center">Grade</TableCell>
                      <TableCell align="center">Improvement</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performanceData.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {student.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {student.marks}%
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={student.grade} 
                            color={getGradeColor(student.grade)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: student.improvement.startsWith('+') ? 'success.main' : 'error.main'
                          }}>
                            {student.improvement.startsWith('+') ? 
                              <ArrowUpward fontSize="small" /> : 
                              <ArrowDownward fontSize="small" />}
                            {student.improvement}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No data available
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleSearch}
          >
            Load Data
          </Button>
        </Card>
      )}
    </Box>
  );
};

export default Body;