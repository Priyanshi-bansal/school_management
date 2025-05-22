import React, { useEffect, useState } from "react";
import { 
  MenuBook as MenuBookIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ClearAll as ClearAllIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import { 
  Button, 
  Box, 
  Typography,
  Checkbox,
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
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const attendance = useSelector((state) => state.student.attendance.result);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const handleCheckboxChange = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId) 
        : [...prev, subjectId]
    );
  };

  const filteredAttendance = attendance?.filter(item => 
    item.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setError({});
    setSelectedSubjects([]);
  };

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Attendance
          </Typography>
          <Chip 
            label={`Total Subjects: ${filteredAttendance?.length || 0}`} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 3,
              alignItems: 'center'
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search Subjects"
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

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {(error.noSubjectError || error.backendError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.noSubjectError || error.backendError}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedSubjects.length > 0 && 
                        selectedSubjects.length < (filteredAttendance?.length || 0)
                      }
                      checked={
                        (filteredAttendance?.length || 0) > 0 && 
                        selectedSubjects.length === (filteredAttendance?.length || 0)
                      }
                      onChange={() => {
                        if (selectedSubjects.length === (filteredAttendance?.length || 0)) {
                          setSelectedSubjects([]);
                        } else {
                          setSelectedSubjects(filteredAttendance?.map(item => item._id) || []);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Attended</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendance?.length > 0 ? (
                  filteredAttendance.map((item, idx) => (
                    <TableRow key={item._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSubjects.includes(item._id)}
                          onChange={() => handleCheckboxChange(item._id)}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{item.subjectCode}</TableCell>
                      <TableCell>{item.subjectName}</TableCell>
                      <TableCell>{item.attended}</TableCell>
                      <TableCell>{item.total}</TableCell>
                      <TableCell>{item.percentage}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      {loading ? '' : 'No attendance records found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedSubjects.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              backgroundColor: 'action.selected',
              borderRadius: 1
            }}>
              <Typography>
                {selectedSubjects.length} subject(s) selected
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  // Add delete functionality here
                  console.log("Delete selected records:", selectedSubjects);
                }}
                disabled={loading}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;