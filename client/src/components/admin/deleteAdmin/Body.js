import React, { useEffect, useState } from "react";
import { 
  Delete as DeleteIcon,
  Search,
  Person,
  Email,
  Badge,
  FilterList,
  ClearAll,
  Add,
  Edit,
  MoreVert
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
  IconButton,
  useMediaQuery,
  useTheme,
  TablePagination,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    setPage(0);
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
    setDeleteDialogOpen(false);
  };

  const handleDeleteSingle = (adminId) => {
    setLoading(true);
    setError({});
    dispatch(deleteAdmin([adminId]));
    setDeleteDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, admin) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(admin);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdmin(null);
  };

  const handleEdit = (adminId) => {
    navigate(`/admin/editadmin/${adminId}`);
    handleMenuClose();
  };

  useEffect(() => {
    if (store.admin.adminDeleted) {
      setSelectedAdmins([]);
      setLoading(false);
      dispatch({ type: DELETE_ADMIN, payload: false });
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
    <Box sx={{ flex: 1, mt: { xs: 2, md: 3 }, p: { xs: 1, md: 3 }, overflow: 'hidden' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 2,
          gap: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" color="textPrimary">
              Admin Management
            </Typography>
          </Box>
          <Chip 
            label={`Total Admins: ${admins?.length || 0}`} 
            color="primary" 
            variant="outlined"
            sx={{ ml: { sm: 2 } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addadmin")}
            sx={{
              ml: { sm: 'auto' },
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 1, sm: 0 }
            }}
          >
            Add Admin
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: { xs: 1, md: 3 }, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2, 
            mb: 3,
            alignItems: { xs: 'stretch', md: 'center' }
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
              sx={{ width: { xs: '100%', md: 'auto' } }}
            >
              Clear Filters
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <TableContainer component={Paper} sx={{ mb: 3, minWidth: 650 }}>
              <Table size={isSmallScreen ? "small" : "medium"} stickyHeader>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow >
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdmins?.length > 0 ? (
                    filteredAdmins
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((admin, idx) => (
                      <TableRow key={admin._id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedAdmins.includes(admin._id)}
                            onChange={() => handleCheckboxChange(admin._id)}
                          />
                        </TableCell>
                        <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.username}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.department}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEdit(admin._id)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleMenuOpen(e, admin)}
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        {loading ? '' : 'No admins found matching your criteria'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {filteredAdmins?.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredAdmins.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </TableContainer>
          </Box>

          {selectedAdmins.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              backgroundColor: 'action.selected',
              borderRadius: 1,
              gap: 1
            }}>
              <Typography>
                {selectedAdmins.length} admin(s) selected
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={loading}
                size={isSmallScreen ? "small" : "medium"}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(selectedAdmin?._id)}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteDialogOpen(true);
          handleMenuClose();
        }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedAdmin 
              ? `Are you sure you want to delete admin ${selectedAdmin.name}?`
              : `Are you sure you want to delete ${selectedAdmins.length} selected admins?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedAdmin 
              ? handleDeleteSingle(selectedAdmin._id) 
              : handleDelete()}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Body;