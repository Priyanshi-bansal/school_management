import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
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
  Stack,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [homeworks, setHomeworks] = useState([
    {
      _id: "1",
      title: "Math Homework",
      subject: { name: "Mathematics" },
      class: { name: "10" },
      section: { name: "A" },
      academicYear: "2024-2025",
      assignedBy: { name: "Dr. John Doe" },
      assignedDate: "2024-05-01",
      dueDate: "2024-05-10",
      submissionType: "file",
      points: 100,
      status: "published",
    },
    {
      _id: "2",
      title: "Science Project",
      subject: { name: "Science" },
      class: { name: "9" },
      section: { name: "B" },
      academicYear: "2024-2025",
      assignedBy: { name: "Ms. Jane Smith" },
      assignedDate: "2024-05-02",
      dueDate: "2024-05-15",
      submissionType: "both",
      points: 150,
      status: "published",
    },
  ]);

  const [subjects, setSubjects] = useState([
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchedHomeworks, setSearchedHomeworks] = useState(homeworks);
  const [selectedHomeworks, setSelectedHomeworks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchedHomeworks(homeworks);
  }, [homeworks]);

  const handleSearch = () => {
    let filtered = [...homeworks];
    if (selectedSubject !== "all") {
      filtered = filtered.filter((h) => h.subject.name === selectedSubject);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (h) =>
          h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.assignedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setSearchedHomeworks(filtered);
  };

  const handleCheckboxChange = (id) => {
    setSelectedHomeworks((prev) =>
      prev.includes(id) ? prev.filter((hid) => hid !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    const updated = homeworks.filter((h) => !selectedHomeworks.includes(h._id));
    setHomeworks(updated);
    setSelectedHomeworks([]);
    setSearchedHomeworks(updated);
  };

  const clearFilters = () => {
    setSelectedSubject("all");
    setSearchQuery("");
    setSearchedHomeworks(homeworks);
  };

  const handleDeleteSingle = (id) => {
    const updatedHomeworks = homeworks.filter((h) => h._id !== id);
    setHomeworks(updatedHomeworks);
    setSearchedHomeworks(updatedHomeworks);
    setSelectedHomeworks((prev) => prev.filter((hid) => hid !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" color="textPrimary">
              Homework Management
            </Typography>
            <Chip
              label={`Total Homeworks: ${homeworks.length}`}
              color="primary"
              variant="outlined"
              size={isSmallScreen ? "small" : "medium"}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/faculty/addhomework")}
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1,
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "16px" },
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 1, sm: 0 },
            }}
          >
            Add Homework
          </Button>
        </Stack>

        <Paper elevation={3} sx={{ p: { xs: 1, sm: 3 }, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 3 }}
          >
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 }, height: '40px' }} size="small">
              <InputLabel>Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                label="Subject"
              >
                <MenuItem value="all">All Subjects</MenuItem>
                {subjects.map((sub, idx) => (
                  <MenuItem key={idx} value={sub.name}>
                    {sub.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search Homeworks"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <Search />
                  </IconButton>
                ),
              }}
            />

            <Button
              variant="outlined"
              startIcon={<ClearAll />}
              onClick={clearFilters}
              sx={{ 
                minWidth: { xs: "100%", sm: "150px" }, 
                whiteSpace: "nowrap",
                height: '40px'
              }}
            >
              Clear Filters
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
                <Table size={isSmallScreen ? "small" : "medium"}>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedHomeworks.length > 0 &&
                            selectedHomeworks.length < searchedHomeworks.length
                          }
                          checked={
                            searchedHomeworks.length > 0 &&
                            selectedHomeworks.length === searchedHomeworks.length
                          }
                          onChange={() => {
                            if (
                              selectedHomeworks.length === searchedHomeworks.length
                            ) {
                              setSelectedHomeworks([]);
                            } else {
                              setSelectedHomeworks(
                                searchedHomeworks.map((h) => h._id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>#</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Class/Section</TableCell>
                      <TableCell>Assigned By</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchedHomeworks.length > 0 ? (
                      searchedHomeworks.map((hw, idx) => (
                        <TableRow key={hw._id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedHomeworks.includes(hw._id)}
                              onChange={() => handleCheckboxChange(hw._id)}
                            />
                          </TableCell>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {hw.title}
                            </Typography>
                          </TableCell>
                          <TableCell>{hw.subject?.name}</TableCell>
                          <TableCell>
                            {hw.class?.name} {hw.section?.name ? `/${hw.section.name}` : ''}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                {hw.assignedBy?.name?.charAt(0)}
                              </Avatar>
                              <Typography variant="body2">
                                {hw.assignedBy?.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {new Date(hw.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{hw.points}</TableCell>
                          <TableCell>
                            <Chip
                              label={hw.status}
                              color={getStatusColor(hw.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                  navigate(`/admin/viewhomework/${hw._id}`)
                                }
                              >
                                <VisibilityIcon fontSize={isSmallScreen ? "small" : "medium"} />
                              </IconButton>

                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                  navigate('/faculty/edithomework', {
                                    state: {
                                      homework: hw,
                                    },
                                  })
                                }
                              >
                                <EditIcon fontSize={isSmallScreen ? "small" : "medium"} />
                              </IconButton>

                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDeleteSingle(hw._id)}
                              >
                                <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                          No homeworks found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedHomeworks.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    backgroundColor: "action.selected",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    {selectedHomeworks.length} homework(s) selected
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={loading}
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    Delete Selected
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;