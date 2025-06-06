import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  ArrowBack,
  Search,
  ClearAll,
  Grade as GradeIcon,
  Send as SendIcon,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Mock data - replace with actual data from your API
  const [submissions, setSubmissions] = useState([
    {
      _id: "1",
      homework: {
        _id: "hw1",
        title: "Math Assignment",
        dueDate: "2024-05-15",
        points: 100,
      },
      student: {
        _id: "stu1",
        name: "John Doe",
        rollNumber: "S001",
        avatar: "JD",
      },
      submittedAt: "2024-05-14T10:30:00Z",
      status: "submitted",
      grade: {
        score: 85,
        maxScore: 100,
        feedback: "Good work but needs more detail in section 3",
        gradedBy: "Prof. Smith",
        gradedAt: "2024-05-16T14:20:00Z",
      },
      isGraded: true,
    },
    {
      _id: "2",
      homework: {
        _id: "hw1",
        title: "Math Assignment",
        dueDate: "2024-05-15",
        points: 100,
      },
      student: {
        _id: "stu2",
        name: "Jane Smith",
        rollNumber: "S002",
        avatar: "JS",
      },
      submittedAt: "2024-05-16T09:15:00Z",
      status: "late",
      isGraded: false,
    },
    {
      _id: "3",
      homework: {
        _id: "hw1",
        title: "Math Assignment",
        dueDate: "2024-05-15",
        points: 100,
      },
      student: {
        _id: "stu3",
        name: "Alex Johnson",
        rollNumber: "S003",
        avatar: "AJ",
      },
      submittedAt: null,
      status: "pending",
      isGraded: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredSubmissions, setFilteredSubmissions] = useState(submissions);

  useEffect(() => {
    setFilteredSubmissions(submissions);
  }, [submissions]);

  const handleSearch = () => {
    let filtered = [...submissions];
    if (selectedStatus !== "all") {
      filtered = filtered.filter((s) => s.status === selectedStatus);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.homework.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredSubmissions(filtered);
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchQuery("");
    setFilteredSubmissions(submissions);
  };

  const handleGradeSubmission = (submissionId) => {
    navigate(`/faculty/grade-submission/${submissionId}`);
  };

  const handleSendReminder = (studentId) => {
    console.log("Sending reminder to student:", studentId);
    // Implement your reminder logic here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "success";
      case "late":
        return "warning";
      case "pending":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not submitted";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <AssignmentIcon color="primary" />
        <Typography variant="h5" color="textPrimary">
          Homework Submissions
        </Typography>
        <Chip
          label={`Total: ${submissions.length}`}
          color="primary"
          variant="outlined"
          size={isSmallScreen ? "small" : "medium"}
        />
      </Stack>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        {/* Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ mb: 3 }}
        >
          <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }} size="small">
            <InputLabel>Submission Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Submission Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="late">Late</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search Students"
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
          
            onClick={clearFilters}
            sx={{ whiteSpace: "nowrap" }}
          >
            Clear Filters
          </Button>
        </Stack>

        {/* Submissions Table */}
        <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
          <Table size={isSmallScreen ? "small" : "medium"}>
            <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Homework</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, idx) => (
                  <TableRow key={sub._id} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {sub.student.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {sub.student.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {sub.student.rollNumber}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {sub.homework.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Due: {formatDate(sub.homework.dueDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(sub.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sub.status}
                        color={getStatusColor(sub.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {sub.isGraded ? (
                        <Box>
                          <Typography variant="body2">
                            {sub.grade.score}/{sub.homework.points}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {sub.grade.feedback.substring(0, 20)}...
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Not graded
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Submission">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/faculty/view-submission/${sub._id}`)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Grade Submission">
                          <IconButton
                            color="primary"
                            size="small"
                           onClick={() => navigate(`/faculty/gradesubmission`)}
                          >
                            <GradeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {sub.status === "pending" && (
                          <Tooltip title="Send Reminder">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => navigate(`/faculty/sendreminder`)}
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    No submissions found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Stats */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            p: 2,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        >
          <Chip
            label={`Submitted: ${
              submissions.filter((s) => s.status === "submitted").length
            }`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`Late: ${
              submissions.filter((s) => s.status === "late").length
            }`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`Pending: ${
              submissions.filter((s) => s.status === "pending").length
            }`}
            color="error"
            variant="outlined"
          />
          <Chip
            label={`Graded: ${
              submissions.filter((s) => s.isGraded).length
            }/${submissions.length}`}
            color="info"
            variant="outlined"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Body;