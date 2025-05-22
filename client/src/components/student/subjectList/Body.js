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
  const [filter, setFilter] = useState({
    searchQuery: ""
  });

  const allSubjects = useSelector((state) => state.admin.subjects.result);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    if (allSubjects?.length !== 0) setLoading(false);
  }, [allSubjects]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    dispatch(getSubject({}));
  };

  const handleClearFilters = () => {
    setFilter({
      searchQuery: ""
    });
    setError({});
    setSelectedSubjects([]);
    dispatch(getSubject({}));
  };

  const searchedSubjects = allSubjects?.filter(sub => 
    sub.subjectName.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    sub.subjectCode.toLowerCase().includes(filter.searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Subject Management
          </Typography>
          <Chip 
            label={`Total Subjects: ${searchedSubjects?.length || 0}`} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box 
            component="form"
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 3,
              alignItems: 'center'
            }}
          >
            <TextField
              name="searchQuery"
              value={filter.searchQuery}
              onChange={handleFilterChange}
              label="Search Subjects"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSubmit}>
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

            <Button
              variant="contained"
              type="submit"
              sx={{ ml: 'auto' }}
              disabled={loading}
            >
              Apply Filters
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
                        selectedSubjects.length < (searchedSubjects?.length || 0)
                      }
                      checked={
                        (searchedSubjects?.length || 0) > 0 && 
                        selectedSubjects.length === (searchedSubjects?.length || 0)
                      }
                      onChange={() => {
                        if (selectedSubjects.length === (searchedSubjects?.length || 0)) {
                          setSelectedSubjects([]);
                        } else {
                          setSelectedSubjects(searchedSubjects?.map(sub => sub._id) || []);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Total Lectures</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedSubjects?.length > 0 ? (
                  searchedSubjects.map((sub, idx) => (
                    <TableRow key={sub._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSubjects.includes(sub._id)}
                          onChange={() => handleCheckboxChange(sub._id)}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{sub.subjectCode}</TableCell>
                      <TableCell>{sub.subjectName}</TableCell>
                      <TableCell>{sub.department}</TableCell>
                      <TableCell>{sub.year}</TableCell>
                      <TableCell>{sub.totalLectures}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      {loading ? '' : 'No subjects found matching your criteria'}
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
                  console.log("Delete selected subjects:", selectedSubjects);
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