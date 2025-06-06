import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Divider,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  ArrowBack,
  Grade as GradeIcon,
  CheckCircle,
  Close
} from "@mui/icons-material";

const Body = () => {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  const [submission, setSubmission] = useState({
    _id: submissionId,
    homework: {
      _id: "hw1",
      title: "Math Assignment",
      maxScore: 100,
      dueDate: "2024-05-15"
    },
    student: {
      _id: "stu1",
      name: "John Doe",
      rollNumber: "S001",
      avatar: "JD"
    },
    submittedAt: "2024-05-14T10:30:00Z",
    submissionFiles: ["document.pdf", "calculations.xlsx"],
    grade: null
  });

  const [formData, setFormData] = useState({
    score: "",
    feedback: "",
    gradedAt: new Date().toISOString().split("T")[0] // format: yyyy-mm-dd
  });

  const [errors, setErrors] = useState({ score: false });
  const [loading, setLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = {
    _id: "fac1",
    name: "Dr. Smith",
    email: "smith@school.edu"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "score") {
      const scoreNum = Number(value);
      const isValid = !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= submission.homework.maxScore;
      setErrors((prev) => ({ ...prev, score: !isValid }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const scoreNum = Number(formData.score);
    const isValidScore = !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= submission.homework.maxScore;

    if (!isValidScore) {
      setErrors({ score: true });
      setError(`Please enter a valid score between 0 and ${submission.homework.maxScore}`);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const gradeData = {
        score: scoreNum,
        maxScore: submission.homework.maxScore,
        feedback: formData.feedback,
        gradedBy: currentUser._id,
        gradedAt: formData.gradedAt
      };

      setSubmission((prev) => ({
        ...prev,
        grade: gradeData
      }));

      setSuccessDialog(true);
    } catch (err) {
      setError("Failed to submit grade. Please try again.");
      console.error("Grade submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not graded yet";
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <GradeIcon color="primary" />
        <Typography variant="h5">Grade Submission</Typography>
        <Chip
          label={submission.grade ? "Graded" : "Ungraded"}
          color={submission.grade ? "success" : "warning"}
          variant="outlined"
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6">Submission Details</Typography>
            <Stack spacing={2} mt={2}>
              <Box>
                <Typography variant="subtitle2">Homework</Typography>
                <Typography>{submission.homework.title}</Typography>
                <Typography variant="caption">
                  Max Score: {submission.homework.maxScore} • Due: {formatDate(submission.homework.dueDate)}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2">Student</Typography>
                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                  <Avatar>{submission.student.avatar}</Avatar>
                  <Box>
                    <Typography>{submission.student.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Roll No: {submission.student.rollNumber}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2">Submission</Typography>
                <Typography variant="body2" mt={1}>
                  Submitted on: {formatDate(submission.submittedAt)}
                </Typography>
                <Typography variant="subtitle2" mt={1}>Files:</Typography>
                <Stack spacing={1} mt={1}>
                  {submission.submissionFiles.map((file, i) => (
                    <Chip
                      key={i}
                      label={file}
                      variant="outlined"
                      size="small"
                      onClick={() => console.log("Download", file)}
                    />
                  ))}
                </Stack>
              </Box>

              {submission.grade && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2">Current Grade</Typography>
                    <Typography variant="h4" mt={1}>
                      {submission.grade.score} / {submission.grade.maxScore}
                    </Typography>
                    <Typography variant="subtitle2" mt={1}>Feedback:</Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mt: 1 }}>
                      <Typography>{submission.grade.feedback || "No feedback provided"}</Typography>
                    </Paper>
                    <Typography variant="caption" color="textSecondary">
                      Graded by {currentUser.name} on {formatDate(submission.grade.gradedAt)}
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {submission.grade ? "Update Grade" : "Assign Grade"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Score"
                    name="score"
                    type="number"
                    value={formData.score}
                    onChange={handleChange}
                    error={errors.score}
                    helperText={errors.score ? `Must be between 0 and ${submission.homework.maxScore}` : ""}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">/ {submission.homework.maxScore}</InputAdornment>
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Graded Date"
                    name="gradedAt"
                    type="date"
                    value={formData.gradedAt}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      startIcon={<Close />}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                      disabled={loading}
                    >
                      {submission.grade ? "Update Grade" : "Submit Grade"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={successDialog}
        onClose={() => {
          setSuccessDialog(false);
          navigate(-1);
        }}
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircle color="success" />
            <Typography>Grade Submitted Successfully</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>
                You've successfully graded {submission.student.name}'s submission for {submission.homework.title}.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Score:</Typography>
              <Typography variant="h6">{formData.score} / {submission.homework.maxScore}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Graded On:</Typography>
              <Typography>{formatDate(formData.gradedAt)}</Typography>
            </Grid>
            {formData.feedback && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Feedback:</Typography>
                <Paper elevation={0} sx={{ p: 1, bgcolor: 'background.default' }}>
                  <Typography>{formData.feedback}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccessDialog(false);
              navigate(-1);
            }}
            variant="contained"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Body;
