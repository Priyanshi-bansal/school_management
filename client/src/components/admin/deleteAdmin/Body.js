import React, { useEffect, useState } from "react";
import { 
  Delete as DeleteIcon,
  Search,
  Person,
  Email,
  Badge,
  FilterList,
  ClearAll,
  Add
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getAdmin, deleteAdmin, getAllAdmin } from "../../../redux/actions/adminActions";
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
  IconButton
} from "@mui/material";
import { DELETE_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [filter, setFilter] = useState({
    department: "all",
    searchQuery: ""
  });

  // Get all admins by default on component mount
  useEffect(() => {
    dispatch(getAllAdmin());
  }, []);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleCheckboxChange = (adminId) => {
    setSelectedAdmins(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId) 
        : [...prev, adminId]
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    
    if (name === "department") {
      setLoading(true);
      if (value === "all") {
        dispatch(getAllAdmin());
      } else {
        dispatch(getAdmin({ department: value }));
      }
    }
  };

  const handleSearch = () => {
    setLoading(true);
    if (filter.department === "all") {
      dispatch(getAllAdmin());
    } else {
      dispatch(getAdmin({ department: filter.department }));
    }
  };

  const handleClearFilters = () => {
    setFilter({
      department: "all",
      searchQuery: ""
    });
    dispatch(getAllAdmin());
  };

  const admins = useSelector((state) => 
    filter.department === "all" 
      ? state.admin.allAdmin 
      : state.admin.students.result
  );

  const filteredAdmins = admins?.filter(admin => 
    admin.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    admin.username.toLowerCase().includes(filter.searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (selectedAdmins.length === 0) return;
    
    setLoading(true);
    setError({});
    dispatch(deleteAdmin(selectedAdmins));
  };

  useEffect(() => {
    if (store.admin.adminDeleted) {
      setSelectedAdmins([]);
      setLoading(false);
      dispatch({ type: DELETE_ADMIN, payload: false });
      // Refresh the list after deletion
      if (filter.department === "all") {
        dispatch(getAllAdmin());
      } else {
        dispatch(getAdmin({ department: filter.department }));
      }
    }
  }, [store.admin.adminDeleted]);

  useEffect(() => {
    if (admins !== undefined) {
      setLoading(false);
    }
  }, [admins]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Person color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Admin Management
          </Typography>
          <Chip 
            label={`Total Admins: ${admins?.length || 0}`} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 2 }}
          />
          <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      onClick={() => navigate("/admin/addadmin")}
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
                      Add Admin
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
       <FormControl sx={{ minWidth: 200 }} size="small">
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

            <TextField
              name="searchQuery"
              value={filter.searchQuery}
              onChange={handleFilterChange}
              label="Search Admins"
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

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedAdmins.length > 0 && 
                        selectedAdmins.length < (filteredAdmins?.length || 0)
                      }
                      checked={
                        (filteredAdmins?.length || 0) > 0 && 
                        selectedAdmins.length === (filteredAdmins?.length || 0)
                      }
                      onChange={() => {
                        if (selectedAdmins.length === (filteredAdmins?.length || 0)) {
                          setSelectedAdmins([]);
                        } else {
                          setSelectedAdmins(filteredAdmins?.map(admin => admin._id) || []);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1 }} /> Name
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge sx={{ mr: 1 }} /> Username
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ mr: 1 }} /> Email
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FilterList sx={{ mr: 1 }} /> Department
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAdmins?.length > 0 ? (
                  filteredAdmins.map((admin, idx) => (
                    <TableRow key={admin._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAdmins.includes(admin._id)}
                          onChange={() => handleCheckboxChange(admin._id)}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.department}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      {loading ? '' : 'No admins found matching your criteria'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedAdmins.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              backgroundColor: 'action.selected',
              borderRadius: 1
            }}>
              <Typography>
                {selectedAdmins.length} admin(s) selected
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