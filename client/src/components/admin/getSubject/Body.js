import React, { useEffect, useState } from "react";
import { Tooltip } from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  LibraryBooks,
  PersonAdd,
} from '@mui/icons-material';

import { 
  MenuBook as MenuBookIcon,
  Delete as DeleteIcon,
  Search,
  ClearAll,
  Add
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { 
  deleteSubject, 
  getSubject, 
  getAllSubject 
} from "../../../redux/actions/adminActions";
import { 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  Typography,
  FormControl,
  InputLabel,
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
import { DELETE_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [filter, setFilter] = useState({
    department: "all",
    year: "",
    searchQuery: ""
  });

  // Get all subjects by default on component mount
  useEffect(() => {
    dispatch(getAllSubject());
  }, []);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    } else {
      setError({});
    }
  }, [store.errors]);

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

  const handleSearch = () => {
    setLoading(true);
    if (filter.department === "all" && filter.year === "") {
      dispatch(getAllSubject());
    } else {
      dispatch(getSubject({ 
        department: filter.department === "all" ? "" : filter.department,
        year: filter.year 
      }));
    }
  };

  const handleClearFilters = () => {
    setFilter({
      department: "all",
      year: "",
      searchQuery: ""
    });
    setError({});
    dispatch(getAllSubject());
  };

  const allSubjects = useSelector((state) => state.admin.allSubject);
  const filteredSubjects = useSelector((state) => state.admin.subjects.result);
  
  const subjects = filter.department === "all" && filter.year === "" 
    ? allSubjects 
    : filteredSubjects;

  const searchedSubjects = subjects?.filter(sub => 
    sub.subjectCode.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    sub.subjectName.toLowerCase().includes(filter.searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (selectedSubjects.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedSubjects.length} subject(s)?`)) {
      setLoading(true);
      setError({});
      dispatch(deleteSubject(selectedSubjects));
    }
  };

  useEffect(() => {
    if (store.admin.subjectDeleted) {
      setSelectedSubjects([]);
      setLoading(false);
      dispatch({ type: DELETE_SUBJECT, payload: false });
      // Refresh the list after deletion
      if (filter.department === "all" && filter.year === "") {
        dispatch(getAllSubject());
      } else {
        dispatch(getSubject({ 
          department: filter.department === "all" ? "" : filter.department,
          year: filter.year 
        }));
      }
    }
  }, [store.admin.subjectDeleted]);

  useEffect(() => {
    if (subjects !== undefined) {
      setLoading(false);
    }
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Subject Management
          </Typography>
          <Chip 
            label={`Total Subjects: ${subjects?.length || 0}`} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 2 }}
          />
          <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      onClick={() => navigate("/admin/addsubject")}
                      sx={{
                        ml: "auto",
                        px: 3,
                        py: 1.5,
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderRadius: "8px",
                        boxShadow: 2,
                        textTransform: "none",
                      }}
                    >
                      Add Subject
                    </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 3,
            alignItems: 'center'
          }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={filter.department}
                onChange={handleFilterChange}
                label="Department"
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments?.map((dp, idx) => (
                  <MenuItem key={idx} value={dp.department}>
                    {dp.department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={filter.year}
                onChange={handleFilterChange}
                label="Year"
              >
                <MenuItem value="">All Years</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
              </Select>
            </FormControl>

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
                  <IconButton onClick={handleSearch}>
                    <Search />
                  </IconButton>
                )
              }}
            />

            <Button
              variant="outlined"
              startIcon={<ClearAll />}
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
        <TableCell align="center">Actions</TableCell>
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
          <TableCell align="center">
  <Tooltip title="View Subject">
        <IconButton
          color="primary"
          onClick={() => navigate(`/admin/viewsubject/`)}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Subject">
        <IconButton
          color="primary"
          onClick={() => navigate(`/admin/editsubject/`)}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Subject">
        <IconButton
          color="error"
          onClick={() => navigate(``)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Assign Subject to Class">
        <IconButton
          color="primary"
          onClick={() => navigate(`/admin/subjecttoclass/`)}
        >
          <LibraryBooks fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Assign Teacher to Subject">
        <IconButton
          color="primary"
          onClick={() => navigate(`/admin/teachertosubject/`)}
        >
          <PersonAdd fontSize="small" />
        </IconButton>
      </Tooltip>
    </TableCell>

          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
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
                onClick={handleDelete}
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