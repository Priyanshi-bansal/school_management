import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  CircularProgress,
  Badge,
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
} from "@mui/icons-material";

// Mock data generator moved outside the component
const getMockData = (status) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const baseData = [
    {
      _id: "hw1",
      title: "Math Chapter 5 Exercises",
      description: "Complete all exercises from chapter 5",
      subject: {
        _id: "sub1",
        subjectName: "Mathematics",
        subjectCode: "MATH101"
      },
      assignedBy: {
        _id: "fac1",
        name: "Dr. Smith",
        avatar: "DS"
      },
      dueDate: tomorrow.toISOString(),
      attachments: ["worksheet.pdf"],
      status: "published"
    },
    {
      _id: "hw2",
      title: "Science Project Proposal",
      description: "Submit your project proposal with detailed plan",
      subject: {
        _id: "sub2",
        subjectName: "Science",
        subjectCode: "SCI201"
      },
      assignedBy: {
        _id: "fac2",
        name: "Prof. Johnson",
        avatar: "PJ"
      },
      dueDate: nextWeek.toISOString(),
      attachments: ["guidelines.pdf"],
      status: "published"
    },
    {
      _id: "hw3",
      title: "History Essay",
      description: "Write a 1000-word essay on World War II",
      subject: {
        _id: "sub3",
        subjectName: "History",
        subjectCode: "HIST301"
      },
      assignedBy: {
        _id: "fac3",
        name: "Dr. Brown",
        avatar: "DB"
      },
      dueDate: yesterday.toISOString(),
      submittedAt: yesterday.toISOString(),
      attachments: ["rubric.pdf"],
      status: "published",
      submission: {
        text: "Here is my essay...",
        attachments: ["essay.docx"]
      }
    },
    {
      _id: "hw4",
      title: "Chemistry Lab Report",
      description: "Complete lab report for experiment #5",
      subject: {
        _id: "sub4",
        subjectName: "Chemistry",
        subjectCode: "CHEM202"
      },
      assignedBy: {
        _id: "fac4",
        name: "Dr. Wilson",
        avatar: "DW"
      },
      dueDate: lastWeek.toISOString(),
      submittedAt: yesterday.toISOString(),
      attachments: ["lab_instructions.pdf"],
      status: "published",
      submission: {
        text: "Here is my lab report...",
        attachments: ["lab_report.pdf"]
      },
      isLate: true
    },
    {
      _id: "hw5",
      title: "Literature Analysis",
      description: "Analyze the symbolism in 'To Kill a Mockingbird'",
      subject: {
        _id: "sub5",
        subjectName: "Literature",
        subjectCode: "LIT401"
      },
      assignedBy: {
        _id: "fac5",
        name: "Prof. Davis",
        avatar: "PD"
      },
      dueDate: lastWeek.toISOString(),
      submittedAt: lastWeek.toISOString(),
      attachments: ["rubric.pdf"],
      status: "published",
      submission: {
        text: "My analysis of the novel...",
        attachments: ["analysis.docx"]
      },
      grade: {
        score: 18,
        maxScore: 20,
        feedback: "Excellent analysis of the symbolism!",
        gradedAt: yesterday.toISOString()
      }
    },
    {
      _id: "hw6",
      title: "Physics Problems",
      description: "Solve problems from chapter 7",
      subject: {
        _id: "sub6",
        subjectName: "Physics",
        subjectCode: "PHYS301"
      },
      assignedBy: {
        _id: "fac1",
        name: "Dr. Smith",
        avatar: "DS"
      },
      dueDate: lastWeek.toISOString(),
      submittedAt: yesterday.toISOString(),
      attachments: ["problem_set.pdf"],
      status: "published",
      submission: {
        text: "My solutions to the problems...",
        attachments: ["solutions.pdf"]
      },
      grade: {
        score: 15,
        maxScore: 20,
        feedback: "Good work but missed some key concepts",
        gradedAt: now.toISOString()
      },
      isLate: true
    }
  ];

  switch (status) {
    case "upcoming":
      return baseData.filter(hw =>
        new Date(hw.dueDate) > now &&
        !hw.submittedAt &&
        !hw.grade
      );
    case "pending":
      return baseData.filter(hw =>
        new Date(hw.dueDate) > now &&
        !hw.submittedAt &&
        !hw.grade
      );
    case "submitted":
      return baseData.filter(hw =>
        hw.submittedAt &&
        !hw.grade
      );
    case "graded":
      return baseData.filter(hw => hw.grade);
    default:
      return baseData;
  }
};

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filteredHomeworks, setFilteredHomeworks] = useState([]);

  // Calculate counts for badges
  const upcomingCount = homeworks.filter(hw => 
    new Date(hw.dueDate) > new Date() && !hw.submittedAt && !hw.grade
  ).length;
  
  const pendingCount = homeworks.filter(hw => 
    new Date(hw.dueDate) > new Date() && !hw.submittedAt && !hw.grade
  ).length;
  
  const submittedCount = homeworks.filter(hw => 
    hw.submittedAt && !hw.grade
  ).length;
  
  const gradedCount = homeworks.filter(hw => 
    hw.grade
  ).length;

  // Fetch homeworks based on tab
  useEffect(() => {
    const fetchHomeworks = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = getMockData(activeTab);
        setHomeworks(mockData);
        setFilteredHomeworks(mockData);
      } catch (error) {
        console.error("Error fetching homeworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [activeTab]);

  // Filter homeworks based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHomeworks(homeworks);
    } else {
      const filtered = homeworks.filter(hw =>
        hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hw.subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hw.assignedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHomeworks(filtered);
    }
  }, [searchQuery, homeworks]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
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
    const now = new Date();
    const due = new Date(homework.dueDate);

    if (homework.grade) {
      return (
        <Chip
          label={`Graded (${homework.grade.score}/${homework.grade.maxScore})`}
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

  const navigateToViewPage = (homeworkId, tabType) => {
    switch(tabType) {
      case 'upcoming':
        navigate(`/student/upcomingview`);
        break;
      case 'pending':
        navigate(`/student/upcomingview`);
        break;
      case 'submitted':
        navigate(`/student/submitview`);
        break;
      case 'graded':
        navigate(`/student/gradeview`);
        break;
      default:
        navigate(`/student/homework/${homeworkId}`);
    }
  };

  const navigateToActionPage = (homeworkId, tabType) => {
    switch(tabType) {
      
      case 'upcoming':
      case 'pending':
        navigate(`/student/submithomework`);
        break;
      case 'submitted':
        navigate(`/student/editstudenthomework`);
        break;
      
      default:
        navigate(`/student/homework/${homeworkId}`);
    }
  };

  const getActionIcon = (tabType) => {
    switch(tabType) {
      case 'upcoming':
      case 'pending':
        return <Upload />;
      case 'submitted':
        return <Edit />;
      case 'graded':
        return <Visibility />;
      default:
        return <Visibility />;
    }
  };

  const getActionTooltip = (tabType) => {
    switch(tabType) {
      case 'upcoming':
      case 'pending':
        return "Submit Homework";
      case 'submitted':
        return "Edit Submission";
      case 'graded':
        return "View Grade Details";
      default:
        return "View Details";
    }
  };

  const renderHomeworkTable = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredHomeworks.length === 0) {
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
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
            <TableRow>
              <TableCell>Homework</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Assigned By</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHomeworks.map((hw) => (
              <TableRow key={hw._id} hover>
                <TableCell>
                  <Typography fontWeight="medium">{hw.title}</Typography>
                  <Typography variant="body2" color="primary" noWrap>
                    {hw.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{hw.subject.subjectName}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {hw.subject.subjectCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {hw.assignedBy.avatar}
                    </Avatar>
                    <Typography>{hw.assignedBy.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Schedule fontSize="small" color="action" />
                    <Typography>
                      {formatDate(hw.dueDate)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {getStatusChip(hw)}
                </TableCell>
                <TableCell>
               <Stack direction="row" spacing={1}>
  <Tooltip title="View Details">
    <IconButton 
      onClick={() => navigateToViewPage(hw._id, activeTab)}
      color="primary"  
    >
      <Visibility color="primary" />  
    </IconButton>
  </Tooltip>

  <Tooltip title={getActionTooltip(activeTab)}>
    <IconButton 
      onClick={() => navigateToActionPage(hw._id, activeTab)}
      color="primary"  // Added primary color
    >
      {React.cloneElement(getActionIcon(activeTab), { color: "primary" })}
    </IconButton>
  </Tooltip>
</Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ flex: 1, p: isSmallScreen ? 1 : 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        
        <AssignmentIcon color="primary" />
        <Typography variant="h5" color="textPrimary" fontWeight="medium">
          My Homework
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ mb: 3, backgroundColor: 'transparent' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons="auto"
          aria-label="homework status tabs"
        >
          <Tab
            label={
              <Badge badgeContent={upcomingCount} color="primary">
                Upcoming
              </Badge>
            }
            value="upcoming"
            aria-label="upcoming homeworks"
          />
          <Tab
            label={
              <Badge badgeContent={pendingCount} color="error">
                Pending
              </Badge>
            }
            value="pending"
            aria-label="pending homeworks"
          />
          <Tab
            label={
              <Badge badgeContent={submittedCount} color="warning">
                Submitted
              </Badge>
            }
            value="submitted"
            aria-label="submitted homeworks"
          />
          <Tab
            label={
              <Badge badgeContent={gradedCount} color="success">
                Graded
              </Badge>
            }
            value="graded"
            aria-label="graded homeworks"
          />
        </Tabs>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={isSmallScreen ? "column" : "row"} spacing={2} alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by title, subject or teacher"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
            aria-label="Search homeworks"
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ whiteSpace: 'nowrap', minWidth: '120px' }}
            aria-label="Filter homeworks"
          >
            Filters
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {renderHomeworkTable()}
      </Paper>
    </Box>
  );
};

export default Body;