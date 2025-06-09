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
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  ArrowBack,
  Search,
  FilterList,
  Upload,
  Schedule,
  HourglassEmpty,
 
  Download,
  AttachFile,
} from "@mui/icons-material";

const Body= () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch upcoming homeworks
  useEffect(() => {
    const fetchUpcomingHomeworks = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = [
          {
            _id: "hw1",
            title: "Algebra Problem Set",
            description: "Complete problems 1-20 from Chapter 3",
            subject: {
              subjectName: "Mathematics",
              subjectCode: "MATH101"
            },
            assignedBy: {
              name: "Dr. Smith",
              avatar: "DS"
            },
            dueDate: "2024-06-25T23:59:00Z",
            attachments: ["problem_set.pdf"],
            daysRemaining: 5
          },
     
        ];
        
        setHomeworks(mockData);
      } catch (err) {
        setError("Failed to load upcoming assignments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingHomeworks();
  }, []);

  const filteredHomeworks = homeworks.filter(hw =>
    hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.assignedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (daysRemaining) => {
    if (daysRemaining <= 2) return "error.main";
    if (daysRemaining <= 5) return "warning.main";
    return "success.main";
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = (homeworkId) => {
    navigate(`/homework/${homeworkId}/submit`);
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
      
        <AssignmentIcon color="primary" fontSize="large" />
        <Typography variant="h5" >
          Upcoming Homework
        </Typography>
      </Stack>

      {/* Search and Filter */}
  

      {/* Stats Bar */}
    

      {/* Assignments List */}
      {filteredHomeworks.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No upcoming assignments found
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {searchQuery ? "Try a different search term" : "You're all caught up!"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredHomeworks.map((hw) => (
            <Grid item xs={12} key={hw._id}>
              <Card elevation={3}>
                <CardContent>
                  <Stack 
                    direction={isSmallScreen ? "column" : "row"} 
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {hw.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {hw.subject.subjectName} ({hw.subject.subjectCode})
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={`${hw.daysRemaining} day${hw.daysRemaining !== 1 ? 's' : ''} left`}
                        sx={{ 
                          backgroundColor: getPriorityColor(hw.daysRemaining),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {hw.assignedBy.avatar}
                      </Avatar>
                    </Stack>
                  </Stack>

                  <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                    {hw.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Schedule color="primary" />
                        <Typography>
                          <strong>Due:</strong> {formatDate(hw.dueDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <HourglassEmpty color="primary" />
                        <Typography color={getPriorityColor(hw.daysRemaining)}>
                          <strong>Priority:</strong> 
                          {hw.daysRemaining <= 2 ? ' High' : 
                           hw.daysRemaining <= 5 ? ' Medium' : ' Low'}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  {hw.attachments && hw.attachments.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Attachments:
                      </Typography>
                      <List dense>
                        {hw.attachments.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AttachFile fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={file} />
                           
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Upload />}
                    onClick={() => handleSubmit(hw._id)}
                  >
                    Submit
                  </Button>
                  <Button 
                    variant="outlined"
                    onClick={() => navigate(`/homework/${hw._id}`)}
                  >
                    View Details
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