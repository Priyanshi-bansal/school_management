import React, { useEffect, useState } from "react";
import { 
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  ClearAll as ClearAllIcon
} from "@mui/icons-material";
import { 
  Button, 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  TextField,
  IconButton,
  Alert
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getTestResult } from "../../../redux/actions/studentActions";
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { authData, testResult } = useSelector((state) => state.student);
  const error = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    
    if (authData?.result) {
      dispatch(getTestResult(
        authData.result.department,
        authData.result.year,
        authData.result.section
      )).finally(() => setLoading(false));
    }
  }, [dispatch, authData]);

  const filteredTests = testResult?.result?.filter(item => 
    item?.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.test?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleClearFilters = () => {
    setSearchQuery("");
  };

  // Calculate percentage safely
  const calculatePercentage = (marks, totalMarks) => {
    if (!marks || !totalMarks || totalMarks === 0) return 'N/A';
    return `${Math.round((marks / totalMarks) * 100)}%`;
  };

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Test Results
          </Typography>
          <Chip 
            label={`Total Tests: ${filteredTests.length}`} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search tests by subject or test name"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />

            <Button
              variant="outlined"
              startIcon={<ClearAllIcon />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading test results...</Typography>
            </Box>
          ) : error.notestError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.notestError}
            </Alert>
          ) : filteredTests.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No test results found for your criteria.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Subject Code</TableCell>
                    <TableCell>Subject Name</TableCell>
                    <TableCell>Test Name</TableCell>
                    <TableCell align="right">Marks Obtained</TableCell>
                    <TableCell align="right">Total Marks</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTests.map((test, index) => (
                    <TableRow key={`${test.subjectCode}-${test.test}-${index}`} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{test.subjectCode || 'N/A'}</TableCell>
                      <TableCell>{test.subjectName || 'N/A'}</TableCell>
                      <TableCell>{test.test || 'N/A'}</TableCell>
                      <TableCell align="right">{test.marks || 'N/A'}</TableCell>
                      <TableCell align="right">{test.totalMarks || 'N/A'}</TableCell>
                      <TableCell align="right">
                        {calculatePercentage(test.marks, test.totalMarks)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;