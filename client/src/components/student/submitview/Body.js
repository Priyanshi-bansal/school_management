import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Grid,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Badge,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  ArrowBack,
  Search,
  FilterList,
  Edit,
  Schedule,
  DoneAll,
  HourglassEmpty,
  Download,
  AttachFile,
  CheckCircle,
  Warning,
} from "@mui/icons-material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [submittedHomeworks, setSubmittedHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubmittedHomeworks = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = [
          {
            _id: "sub1",
            homework: {
              _id: "hw1",
              title: "Algebra Problem Set",
              subject: {
                subjectName: "Mathematics",
                subjectCode: "MATH101"
              },
              assignedBy: {
                name: "Dr. Smith",
                avatar: "DS"
              },
              dueDate: "2024-06-15T23:59:00Z"
            },
            submittedAt: "2024-06-14T14:30:00Z",
            attachments: ["algebra_solutions.pdf"],
            isLate: false,
            daysSinceSubmission: 2
          },
         
        
        ];
        
        setSubmittedHomeworks(mockData);
      } catch (err) {
        setError("Failed to load submitted assignments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmittedHomeworks();
  }, []);

  const filteredHomeworks = submittedHomeworks.filter(hw =>
    hw.homework.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.homework.subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.homework.assignedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusChip = (submission) => {
    if (submission.isLate) {
      return (
        <Chip
          icon={<Warning />}
          label={`Submitted Late (${submission.lateByDays} day${submission.lateByDays > 1 ? 's' : ''})`}
          color="warning"
          variant="outlined"
        />
      );
    }
    return (
      <Chip
        icon={<CheckCircle />}
        label="Submitted On Time"
        color="success"
        variant="outlined"
      />
    );
  };

  const handleEditSubmission = (submissionId) => {
    navigate(`/submissions/${submissionId}/edit`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isSmallScreen ? 1 : 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        {/* <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton> */}
        <AssignmentIcon color="primary" fontSize="small" />
        <Typography variant="h5" >
          Submitted Homework
        </Typography>
        <Badge 
          badgeContent={submittedHomeworks.length} 
          color="primary" 
          sx={{ ml: 2 }}
        />
      </Stack>

      {/* Search and Filter */}
    

      {/* Stats Bar */}
      

      {/* Submitted Work List */}
      {filteredHomeworks.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No submitted assignments found
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {searchQuery ? "Try a different search term" : "You haven't submitted any assignments yet"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredHomeworks.map((submission) => (
            <Grid item xs={12} key={submission._id}>
              <Card elevation={3}>
                <CardContent>
                  <Stack 
                    direction={isSmallScreen ? "column" : "row"} 
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {submission.homework.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {submission.homework.subject.subjectName} ({submission.homework.subject.subjectCode})
                      </Typography>
                    </Box>
                    
                    {getStatusChip(submission)}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {submission.homework.assignedBy.avatar}
                        </Avatar>
                        <Typography>
                          <strong>Teacher:</strong> {submission.homework.assignedBy.name}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Schedule color="primary" />
                        <Typography>
                          <strong>Due:</strong> {formatDate(submission.homework.dueDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DoneAll color="primary" />
                        <Typography>
                          <strong>Submitted:</strong> {formatDate(submission.submittedAt)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <HourglassEmpty color="primary" />
                        <Typography>
                          <strong>Waiting for:</strong> {submission.daysSinceSubmission} day{submission.daysSinceSubmission !== 1 ? 's' : ''}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  {submission.attachments && submission.attachments.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Submitted Files:
                      </Typography>
                      <List dense>
                        {submission.attachments.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AttachFile fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={file} />
                              {/* <IconButton size="small">
                                <Download fontSize="small" />
                              </IconButton> */}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Edit />}
                    onClick={() => handleEditSubmission(submission._id)}
                    sx={{ mr: 1 }}
                  >
                    Edit Submission
                  </Button>
                  <Button 
                    variant="contained"
                    onClick={() => navigate(`/homework/${submission.homework._id}`)}
                  >
                    View Assignment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Body;