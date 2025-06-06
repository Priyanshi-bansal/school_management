import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import {
  Assignment as AssignmentIcon,
  ArrowBack,
  Save,
  CloudUpload,
  School as SchoolIcon,
  Class as ClassIcon,
  FormatListBulleted as FormatListBulletedIcon,
  DateRange as DateRangeIcon,
  Star as StarIcon,
  Description as DescriptionIcon,
  Notes as NotesIcon,
  Publish as PublishIcon,
  Event as EventIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const Body = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
    dueDate: new Date().toISOString().split("T")[0],
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

  const [classes] = useState([{ name: "9" }, { name: "10" }, { name: "11" }, { name: "12" }]);
  const [sections] = useState([{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }]);
  const [fileUpload, setFileUpload] = useState(null);

  useEffect(() => {
    const fetchHomework = async () => {
      const data = {
        title: "Sample Homework",
        subject: "Science",
        class: "10",
        section: "B",
        academicYear: "2024-2025",
        description: "Describe the process of photosynthesis.",
        submissionType: "file",
        points: 50,
        dueDate: "2025-06-15",
        attachments: [],
        allowLateSubmission: true,
        lateSubmissionPenalty: 2,
        instructions: "Submit the file in PDF format only.",
      };
      setFormData(data);
    };
    fetchHomework();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFileUpload(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Edited Form:", formData);
    navigate("/faculty/homework");
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate("/faculty/homework")}>
          <ArrowBack />
        </IconButton>
        <AssignmentIcon color="primary" />
        <Typography variant="h5">Edit Homework</Typography>
      </Stack>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
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
                      startAdornment={
                        <InputAdornment position="start">
                          <SchoolIcon />
                        </InputAdornment>
                      }
                    >
                      {subjects.map((s, i) => (
                        <MenuItem key={i} value={s.name}>
                          {s.name}
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
                    >
                      {classes.map((cls, i) => (
                        <MenuItem key={i} value={cls.name}>
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
                    >
                      {sections.map((sec, i) => (
                        <MenuItem key={i} value={sec.name}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StarIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
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
                rows={3}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" margin="normal">
                    <InputLabel>Submission Type</InputLabel>
                    <Select
                      name="submissionType"
                      value={formData.submissionType}
                      onChange={handleChange}
                      label="Submission Type"
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
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon />
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
                      setFormData({ ...formData, allowLateSubmission: e.target.checked })
                    }
                  />
                }
                label="Allow late submission"
              />

              {formData.allowLateSubmission && (
                <TextField
                  fullWidth
                  label="Late Submission Penalty"
                  name="lateSubmissionPenalty"
                  type="number"
                  value={formData.lateSubmissionPenalty}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WarningIcon />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">points/day</InputAdornment>,
                  }}
                  sx={{ maxWidth: 300 }}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                <CloudUpload fontSize="small" sx={{ mr: 1 }} />
                Attachments
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  bgcolor: theme.palette.action.hover,
                  "&:hover": {
                    bgcolor: theme.palette.action.selected,
                  },
                }}
              >
                <input
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  id="upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload">
                  <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                    Upload Files
                  </Button>
                </label>
              </Box>

              {fileUpload && (
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  {fileUpload.map((file, i) => (
                    <Chip
                      key={i}
                      label={file.name}
                      onDelete={() => {
                        const updated = [...fileUpload];
                        updated.splice(i, 1);
                        setFileUpload(updated);
                      }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/faculty/homework")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<Save />}>
              Update Homework
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Body;
