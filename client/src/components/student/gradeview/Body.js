import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Avatar,
  Stack,
  Button,
  useTheme,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from "@mui/material";
import {
  ArrowBack,
  Assignment,
  CheckCircle,
  Close,
  Download,
  Grade,
  Person,
  Schedule,
  Subject
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { homeworkId } = useParams();

  // Mock data - replace with actual API call
  const homework = {
    _id: homeworkId || "hw5",
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
      avatar: "PD",
      email: "prof.davis@school.edu"
    },
    dueDate: "2023-05-15T23:59:00Z",
    submittedAt: "2023-05-14T18:30:00Z",
    grade: {
      score: 18,
      maxScore: 20,
      percentage: 90,
      feedback: "Excellent analysis of the symbolism! You demonstrated deep understanding of the novel's themes. Your comparison between the mockingbird and Tom Robinson was particularly insightful. For even higher marks, you could have explored the significance of the title more thoroughly.",
      gradedAt: "2023-05-18T14:20:00Z",
      rubric: [
        { criterion: "Thesis Statement", score: 5, maxScore: 5 },
    
      ]
    },
    submission: {
      text: "My analysis focuses on the symbolism of the mockingbird...",
      attachments: ["analysis.docx", "references.pdf"]
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'info';
    if (percentage >= 70) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Grade color="primary" fontSize="small" />
        <Typography variant="h5" component="h1">
          Grade Details
        </Typography>
        <Chip
          label={`${homework.grade.score}/${homework.grade.maxScore}`}
          color={getGradeColor(homework.grade.percentage)}
          sx={{ ml: 'auto', fontSize: '1rem', p: 1.5 }}
        />
      </Stack>

      {/* Main Content */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          {/* Assignment Info */}
          <Box>
            <Typography variant="h5" gutterBottom>
              {homework.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {homework.description}
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                icon={<Subject />}
                label={homework.subject.subjectName}
                variant="outlined"
              />
              <Chip
                icon={<Person />}
                label={`Assigned by: ${homework.assignedBy.name}`}
                variant="outlined"
              />
              <Chip
                icon={<Schedule />}
                label={`Submitted: ${formatDate(homework.submittedAt)}`}
                variant="outlined"
              />
            </Stack>
          </Box>

          <Divider />

          {/* Grade Summary */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Grade Summary
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  variant="determinate"
                  value={homework.grade.percentage}
                  color={getGradeColor(homework.grade.percentage)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h6" color="text.primary">
                {homework.grade.percentage}%
              </Typography>
            </Stack>

            <Typography variant="body1" paragraph>
              <strong>Graded on:</strong> {formatDate(homework.grade.gradedAt)}
            </Typography>
          </Box>

          <Divider />

          {/* Rubric Breakdown */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Rubric Assessment
            </Typography>
            <List>
              {homework.grade.rubric.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {item.score >= item.maxScore * 0.8 ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.criterion}
                    secondary={`${item.score}/${item.maxScore}`}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={(item.score / item.maxScore) * 100}
                    color={getGradeColor((item.score / item.maxScore) * 100)}
                    sx={{ width: 100, height: 8, borderRadius: 5 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />

          {/* Teacher Feedback */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Teacher Feedback
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: theme.palette.grey[100],
                borderRadius: 1
              }}
            >
              <Typography variant="body1" whiteSpace="pre-wrap">
                {homework.grade.feedback}
              </Typography>
            </Paper>
          </Box>

          <Divider />

          {/* Submission Details */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Submission
            </Typography>
            <Typography variant="body1" paragraph>
              {homework.submission.text}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Attachments:
            </Typography>
            <Stack direction="row" spacing={1}>
              {homework.submission.attachments.map((file, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => console.log(`Download ${file}`)}
                >
                  {file}
                </Button>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Actions */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Back to Grades
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/student/homework/${homework._id}`)}
        >
          View Assignment Details
        </Button>
      </Stack>
    </Box>
  );
};

export default Body ;