import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as FeesIcon,
  Search,
  ClearAll,
  Add,
} from "@mui/icons-material";

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
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Updated Mock Data for Fees Management
const mockData = [
  {
    _id: "1",
    class: "10th Grade",
    academicYear: "2023-2024",
    feeType: "Tuition",
    amount: 5000,
    dueDate: "2023-09-30",
    status: "Active"
  },
  {
    _id: "2",
    class: "12th Grade",
    academicYear: "2023-2024",
    feeType: "Examination",
    amount: 2000,
    dueDate: "2023-10-15",
    status: "Active"
  },
];

const feeTypes = ["Tuition", "Examination", "Transportation", "Library", "Sports"];

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
  const [allFees, setAllFees] = useState(mockData);
  const [selectedFees, setSelectedFees] = useState([]);
  const [filter, setFilter] = useState({ feeType: "all", searchQuery: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const filteredFees =
    filter.feeType === "all"
      ? allFees
      : allFees.filter((f) => f.feeType === filter.feeType);

  const searchedFees = useMemo(() => {
    return filteredFees.filter(
      (fee) =>
        fee.class.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        fee.academicYear.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        fee.feeType.toLowerCase().includes(filter.searchQuery.toLowerCase())
    );
  }, [filteredFees, filter.searchQuery]);

  const handleCheckboxChange = (id) => {
    setSelectedFees((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilter({ feeType: "all", searchQuery: "" });
    setError({});
  };

  const handleDelete = () => {
    if (
      selectedFees.length > 0 &&
      window.confirm(`Delete ${selectedFees.length} selected fee(s)?`)
    ) {
      setLoading(true);
      setTimeout(() => {
        setAllFees((prev) =>
          prev.filter((fee) => !selectedFees.includes(fee._id))
        );
        setSelectedFees([]);
        setLoading(false);
      }, 1000);
    }
  };

  const handleDeleteSingle = (id) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      setLoading(true);
      setTimeout(() => {
        setAllFees((prev) => prev.filter((fee) => fee._id !== id));
        setSelectedFees((prev) => prev.filter((fid) => fid !== id));
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      mt: { xs: 2, sm: 3 }, 
      p: { xs: 1, sm: 3 },
      maxWidth: '100%',
      overflowX: 'auto'
    }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" }, 
          mb: 2,
          gap: { xs: 1, sm: 2 }
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FeesIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">Fees Management</Typography>
          </Box>
          
          <Chip
            label={`Total: ${filteredFees.length}`}
            color="primary"
            variant="outlined"
            sx={{ ml: { sm: 2 } }}
          />
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/admin/addfees")}
            sx={{
              ml: { sm: "auto" },
              mt: { xs: 1, sm: 0 },
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Add Fee
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: { xs: 1, sm: 3 }, borderRadius: 2 }}>
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            mb: 3, 
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" }
          }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel>Fee Type</InputLabel>
              <Select
                name="feeType"
                value={filter.feeType}
                onChange={handleFilterChange}
                label="Fee Type"
                size="small"
                sx={{ height: "40px" }}
              >
                <MenuItem value="all">All Fee Types</MenuItem>
                {feeTypes.map((type, idx) => (
                  <MenuItem key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="searchQuery"
              value={filter.searchQuery}
              onChange={handleFilterChange}
              label="Search"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, height: "40px", minWidth: { xs: '100%', sm: 200 } }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <Search />
                  </IconButton>
                ),
              }}
            />

            <Button
              variant="outlined"
              startIcon={<ClearAll />}
              onClick={handleClearFilters}
              size="small"
              sx={{ 
                height: "40px", 
                whiteSpace: "nowrap",
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Clear Filters
            </Button>
          </Box>

          {loading && (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {(error.noFeesError || error.backendError) && (
            <Alert severity="error">
              {error.noFeesError || error.backendError}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mb: 3, maxWidth: '100%', overflowX: 'auto' }}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedFees.length > 0 &&
                        selectedFees.length < searchedFees.length
                      }
                      checked={
                        searchedFees.length > 0 &&
                        selectedFees.length === searchedFees.length
                      }
                      onChange={() =>
                        setSelectedFees(
                          selectedFees.length === searchedFees.length
                            ? []
                            : searchedFees.map((f) => f._id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>Class</TableCell>
                  {!isMobile && <TableCell>Academic Year</TableCell>}
                  
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedFees.length > 0 ? (
                  searchedFees.map((fee) => (
                    <TableRow key={fee._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedFees.includes(fee._id)}
                          onChange={() => handleCheckboxChange(fee._id)}
                        />
                      </TableCell>
                      <TableCell>{fee.class}</TableCell>
                      {!isMobile && <TableCell>{fee.academicYear}</TableCell>}
                     
                      <TableCell>
                        <IconButton
                          color="primary"
                          size={isMobile ? "small" : "medium"}
                          onClick={() =>
                            navigate("/admin/editfees", {
                              state: { fee },
                            })
                          }
                        >
                          <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                        <IconButton
                          color="error"
                          size={isMobile ? "small" : "medium"}
                          onClick={() => handleDeleteSingle(fee._id)}
                        >
                          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 7} sx={{ textAlign: "center", py: 4 }}>
                      {loading ? "" : "No fees found matching your criteria"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedFees.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                backgroundColor: "action.selected",
                borderRadius: 1,
                gap: 1
              }}
            >
              <Typography>{selectedFees.length} selected</Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
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