import React, { useState } from "react";
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
  useTheme,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { EventNote } from '@mui/icons-material';

import {
  Assignment as AssignmentIcon,
  ArrowBack,
  Save,
  CloudUpload,

  Class as ClassIcon,
  Group,
  Event,
  Star,
  Notes,
  School,
  RemoveCircleOutline,
} from "@mui/icons-material";

const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    class: "",
    section: "",
    academicYear: "2024-2025",
    description: "",
    submissionType: "file",
    points: 100,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    attachments: [],
    allowLateSubmission: false,
    lateSubmissionPenalty: 0,
    instructions: "",
  });

  const [subjects] = useState([
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
  ]);

  const [classes] = useState([
    { name: "9" },
    { name: "10" },
    { name: "11" },
    { name: "12" },
  ]);

  const [sections] = useState([
    { name: "A" },
    { name: "B" },
    { name: "C" },
    { name: "D" },
  ]);

  const [fileUpload, setFileUpload] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileUpload(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate("/faculty/homework");
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...formData.attachments];
    updatedAttachments.splice(index, 1);
    setFormData({
      ...formData,
      attachments: updatedAttachments,
    });
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate("/faculty/homework")}>
          <ArrowBack />
        </IconButton>
        <AssignmentIcon color="primary" />
        <Typography variant="h5" color="textPrimary">
          Add New Homework
        </Typography>
      </Stack>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label="Homework Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                size="small"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel>Subject</InputLabel>
                    <Select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      label="Subject"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <School />
                        </InputAdornment>
                      }
                    >
                      {subjects.map((sub, idx) => (
                        <MenuItem key={idx} value={sub.name}>
                          {sub.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel>Class</InputLabel>
                    <Select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      label="Class"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <ClassIcon />
                        </InputAdornment>
                      }
                    >
                      {classes.map((cls, idx) => (
                        <MenuItem key={idx} value={cls.name}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel>Section</InputLabel>
                    <Select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      label="Section"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <Group />
                        </InputAdornment>
                      }
                    >
                      {sections.map((sec, idx) => (
                        <MenuItem key={idx} value={sec.name}>
                          {sec.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel>Academic Year</InputLabel>
                    <Select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      label="Academic Year"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <Event />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="2023-2024">2023-2024</MenuItem>
                      <MenuItem value="2024-2025">2024-2025</MenuItem>
                      <MenuItem value="2025-2026">2025-2026</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Points"
                    name="points"
                    type="number"
                    value={formData.points}
                    onChange={handleChange}
                    margin="normal"
                    size="small"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Star />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Homework Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Homework Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Notes />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel>Submission Type</InputLabel>
                    <Select
                      name="submissionType"
                      value={formData.submissionType}
                      onChange={handleChange}
                      label="Submission Type"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <CloudUpload />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="file">File Upload</MenuItem>
                      <MenuItem value="text">Text Entry</MenuItem>
                      <MenuItem value="both">Both</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    margin="normal"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                     
                     <EventNote fontSize="small"  />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.allowLateSubmission}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allowLateSubmission: e.target.checked,
                      })
                    }
                  />
                }
                label="Allow late submission"
                sx={{ mt: 1 }}
              />

              {formData.allowLateSubmission && (
                <TextField
                  fullWidth
                  label="Late Submission Penalty (points per day)"
                  name="lateSubmissionPenalty"
                  type="number"
                  value={formData.lateSubmissionPenalty}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  sx={{ maxWidth: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RemoveCircleOutline />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">points/day</InputAdornment>
                    ),
                  }}
                />
              )}
            </Grid>

            {/* Attachments */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Attachments
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 2,
                  textAlign: "center",
                  mb: 2,
                }}
              >
                <input
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{ mb: 1 }}
                  >
                    Upload Files
                  </Button>
                </label>
                <Typography variant="body2" color="textSecondary">
                  PDF, DOC, PPT, XLS, JPG, PNG (Max 10MB each)
                </Typography>
              </Box>

              {fileUpload && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Files:
                  </Typography>
                  <Stack spacing={1}>
                    {fileUpload.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => {
                          const newFiles = [...fileUpload];
                          newFiles.splice(index, 1);
                          setFileUpload(newFiles);
                        }}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {formData.attachments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Attachments:
                  </Typography>
                  <Stack spacing={1}>
                    {formData.attachments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => handleRemoveAttachment(index)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>

            {/* Instructions */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Additional Instructions
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label="Instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                placeholder="Provide any extra guidelines or instructions for this homework..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Notes />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/faculty/homework")}
              sx={{ px: 3, textTransform: "none", fontWeight: "bold" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{ px: 3, textTransform: "none", fontWeight: "bold", boxShadow: "none" }}
            >
              Save Homework
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Body;
