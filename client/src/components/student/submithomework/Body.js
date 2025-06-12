import React, { useState, useEffect } from "react";
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
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  ArrowBack,
  AttachFile,
  Delete,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";

const Body = () => {
  const { homeworkId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [textSubmission, setTextSubmission] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("submitted");

  useEffect(() => {
    const fetchHomework = async () => {
      setLoading(true);
      try {
        const mockData = {
          _id: homeworkId,
          title: "Math Chapter 5 Exercises",
          description: "Complete all exercises from chapter 5",
          subject: {
            _id: "sub1",
            subjectName: "Mathematics",
            subjectCode: "MATH101",
          },
          assignedBy: {
            _id: "fac1",
            name: "Dr. Smith",
            avatar: "DS",
          },
          dueDate: "2024-06-15T23:59:00Z",
          attachments: ["worksheet.pdf"],
          status: "published",
        };
        setHomework(mockData);
      } catch (error) {
        console.error("Error fetching homework:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [homeworkId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.slice(0, 5 - files.length).map((file) => ({
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("textSubmission", textSubmission);
      formData.append("status", status);
      files.forEach((f) => formData.append("attachments", f.file));

      // Submit via API
      // await axios.post(`/api/student/homework/${homeworkId}/submit`, formData);

      console.log("Submitted", { textSubmission, files, status });
      navigate(`/student/homework/${homeworkId}/submission`, {
        state: { success: true },
      });
    } catch (error) {
      console.error("Error submitting homework:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!homework) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          Homework not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, p: isSmallScreen ? 1 : 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: theme.palette.primary.main }}>
          <ArrowBack />
        </IconButton>
        <AssignmentIcon color="primary" />
        <Typography variant="h5" fontWeight="medium">
          Submit Homework: {homework.title}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Homework Details */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Homework Details
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Subject
                </Typography>
                <Typography>
                  {homework.subject.subjectName} ({homework.subject.subjectCode})
                </Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Assigned By
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ width: 32, height: 32 }}>{homework.assignedBy.avatar}</Avatar>
                  <Typography>{homework.assignedBy.name}</Typography>
                </Stack>
              </div>

              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Due Date
                </Typography>
                <Typography>{new Date(homework.dueDate).toLocaleString()}</Typography>
              </div>

              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography>{homework.description}</Typography>
              </div>

              {homework.attachments?.length > 0 && (
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Attachments
                  </Typography>
                  <List dense>
                    {homework.attachments.map((file, i) => (
                      <ListItem key={i}>
                        <ListItemIcon>
                          <AttachFile fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={file} />
                      </ListItem>
                    ))}
                  </List>
                </div>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Submission Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Submission
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Submission Status</InputLabel>
                <Select
                  value={status}
                  label="Submission Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="draft">Save as Draft</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                label="Text Submission"
                placeholder="Type your answers here or paste your written work..."
                value={textSubmission}
                onChange={(e) => setTextSubmission(e.target.value)}
              />

              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Attachments (Optional)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Upload supporting files (Max 5 files, 10MB each).
                </Typography>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ mt: 1 }}
                >
                  Upload Files
                  <input
                    hidden
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </Button>

                {files.length > 0 && (
                  <List dense sx={{ mt: 2 }}>
                    {files.map((f, i) => (
                      <ListItem
                        key={i}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => removeFile(i)}>
                            <Delete color="error" />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <AttachFile fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={f.name}
                          secondary={`${(f.size / 1024).toFixed(2)} KB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
                  onClick={handleSubmit}
                  disabled={submitting || (textSubmission.trim() === "" && files.length === 0)}
                >
                  {status === "draft" ? "Save Draft" : "Submit Homework"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Body;
