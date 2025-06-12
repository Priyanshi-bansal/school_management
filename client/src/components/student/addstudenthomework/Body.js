import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Grid,
  Chip,
  IconButton,
  Avatar,
 
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  CircularProgress,
  Badge,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  ArrowBack,
  Search,
  FilterList,
  Visibility,
  Upload,
  Schedule,
  DoneAll,
  HourglassEmpty,
  Warning,
  Edit,
  Download,
  Grade as GradeIcon,
  AttachFile,
} from "@mui/icons-material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filteredHomeworks, setFilteredHomeworks] = useState([]);

  const getMockData = (status) => {
    const mockHomeworks = [
      {
        _id: "1",
        title: "Math Homework",
        subject: { subjectName: "Mathematics", subjectCode: "MATH101" },
        description: "Complete exercises 1-10",
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        assignedBy: { name: "Prof. Smith", avatar: "PS" },
        attachments: ["worksheet.pdf"],
      },
      {
        _id: "2",
        title: "History Essay",
        subject: { subjectName: "History", subjectCode: "HIST201" },
        description: "Write about the Industrial Revolution",
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        assignedBy: { name: "Dr. Johnson", avatar: "DJ" },
        submittedAt: new Date().toISOString(),
        submission: {
          text: "Submitted essay on Industrial Revolution",
          attachments: ["essay.docx"]
        }
      },
      {
        _id: "3",
        title: "Science Project",
        subject: { subjectName: "Biology", subjectCode: "BIO301" },
        description: "Cell structure presentation",
        dueDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        assignedBy: { name: "Prof. Lee", avatar: "PL" },
        submittedAt: new Date().toISOString(),
        grade: {
          score: 9,
          maxScore: 10,
          feedback: "Excellent work!",
          gradedAt: new Date().toISOString()
        }
      }
    ];

    return mockHomeworks.filter(hw => {
      const now = new Date();
      const due = new Date(hw.dueDate);
      
      switch (status) {
        case "upcoming":
          return (!hw.submittedAt && due > now);
        case "pending":
          return (!hw.submittedAt && due > now);
        case "submitted":
          return (hw.submittedAt && !hw.grade);
        case "graded":
          return hw.grade;
        default:
          return false;
      }
    }) || [];
  };

  useEffect(() => {
    const fetchHomeworks = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = getMockData(activeTab);
        setHomeworks(mockData);
        setFilteredHomeworks(mockData);
      } catch (error) {
        console.error("Error fetching homeworks:", error);
        setHomeworks([]);
        setFilteredHomeworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHomeworks(homeworks);
    } else {
      const filtered = (homeworks || []).filter(hw =>
        (hw.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hw.subject?.subjectName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hw.assignedBy?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHomeworks(filtered);
    }
  }, [searchQuery, homeworks]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusChip = (homework) => {
    if (!homework) return null;
    
    const now = new Date();
    const due = new Date(homework.dueDate || now);
    
    if (homework.grade) {
      return (
        <Chip
          label={`Graded (${homework.grade?.score || 0}/${homework.grade?.maxScore || 10})`}
          color="success"
          size="small"
          icon={<DoneAll fontSize="small" />}
        />
      );
    } else if (homework.submittedAt) {
      if (new Date(homework.submittedAt) > due) {
        return <Chip label="Submitted Late" color="warning" size="small" icon={<Warning fontSize="small" />} />;
      }
      return <Chip label="Submitted" color="info" size="small" />;
    } else if (now > due) {
      return <Chip label="Overdue" color="error" size="small" />;
    } else {
      return (
        <Chip
          label="Pending"
          color="warning"
          size="small"
          icon={<HourglassEmpty fontSize="small" />}
        />
      );
    }
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return "No due date";
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    
    if (diff <= 0) return "Overdue";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return "Due soon";
  };

  const renderHomeworkCard = (hw) => {
    if (!hw) return null;
    
    const now = new Date();
    const due = new Date(hw.dueDate || now);
    const isOverdue = now > due && !hw.submittedAt;
    const timeRemaining = getTimeRemaining(hw.dueDate);

    return (
      
      <Card key={hw._id || Math.random()} sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" component="div">
                {hw.title || "Untitled Homework"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {hw.subject?.subjectName || "No Subject"} ({hw.subject?.subjectCode || "N/A"})
              </Typography>
            </Box>
            {getStatusChip(hw)}
          </Stack>

          <Typography variant="body1" paragraph sx={{ mt: 1 }}>
            {hw.description || "No description provided"}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {hw.assignedBy?.avatar || "?"}
                </Avatar>
                <Typography variant="body2">
                  Assigned by: {hw.assignedBy?.name || "Unknown"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Schedule color={isOverdue ? "error" : "action"} />
                <Typography variant="body2" color={isOverdue ? "error" : "text.secondary"}>
                  Due: {formatDate(hw.dueDate)}
                  {!hw.submittedAt && !hw.grade && (
                    <Typography variant="caption" display="block" color={isOverdue ? "error" : "text.secondary"}>
                      {timeRemaining}
                    </Typography>
                  )}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {hw.attachments?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Attachments:</Typography>
              <List dense>
                {hw.attachments.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AttachFile fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={file} />
                    <IconButton size="small">
                      <Download fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {hw.submission && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Your Submission:</Typography>
              <Typography variant="body2" paragraph>
                {hw.submission.text || "No submission text"}
              </Typography>
              {hw.submission.attachments?.length > 0 && (
                <>
                  <Typography variant="subtitle2">Submitted Files:</Typography>
                  <List dense>
                    {hw.submission.attachments.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AttachFile fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={file} />
                        <IconButton size="small">
                          <Download fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              <Typography variant="caption" color="text.secondary">
                Submitted on: {formatDate(hw.submittedAt)}
              </Typography>
            </Box>
          )}

          {hw.grade && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <GradeIcon color="success" />
                <Typography variant="subtitle1">
                  Grade: {hw.grade.score || 0}/{hw.grade.maxScore || 10}
                </Typography>
                <Rating 
                  value={((hw.grade.score || 0) / (hw.grade.maxScore || 10)) * 5} 
                  precision={0.5} 
                  readOnly 
                  size="small"
                />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Feedback:</strong> {hw.grade.feedback || "No feedback provided"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Graded on: {formatDate(hw.grade.gradedAt)}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', borderTop: `1px solid ${theme.palette.divider}` }}>
          {(!hw.submittedAt && !hw.grade) && (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<Upload />}
              onClick={() => navigate(`/student/homework/${hw._id}/submit`)}
            >
              Submit
            </Button>
          )}
          {(hw.submittedAt && !hw.grade) && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<Edit />}
              onClick={() => navigate(`/student/homework/${hw._id}/edit`)}
            >
              Edit Submission
            </Button>
          )}
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<Visibility />}
            onClick={() => navigate(`/student/homework/${hw._id}`)}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!filteredHomeworks || filteredHomeworks.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No {activeTab} homeworks found
          </Typography>
          {activeTab === "pending" && (
            <Typography variant="body2" mt={1}>
              You're all caught up! No pending assignments.
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {filteredHomeworks.map(hw => renderHomeworkCard(hw))}
      </Stack>
    );
  };

  return (
    <Box sx={{ flex: 1, p: isSmallScreen ? 1 : 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: theme.palette.primary.main }}
        >
          <ArrowBack />
        </IconButton>
        <AssignmentIcon color="primary" />
        <Typography variant="h5" color="textPrimary" fontWeight="medium">
          My Homework
        </Typography>
      </Stack>

      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 3, backgroundColor: 'transparent' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab
            label={
              <Badge badgeContent={(getMockData("upcoming") || []).length} color="primary">
                Upcoming
              </Badge>
            }
            value="upcoming"
          />
          <Tab
            label={
              <Badge badgeContent={(getMockData("pending") || []).length} color="error">
                Pending
              </Badge>
            }
            value="pending"
          />
          <Tab
            label={
              <Badge badgeContent={(getMockData("submitted") || []).length} color="warning">
                Submitted
              </Badge>
            }
            value="submitted"
          />
          <Tab
            label={
              <Badge badgeContent={(getMockData("graded") || []).length} color="success">
                Graded
              </Badge>
            }
            value="graded"
          />
        </Tabs>
      </Paper>

      {/* Filters and Search */}
     
     
     

      {/* Homework List */}
      {renderContent()}
    </Box>
  );
};

export default Body;