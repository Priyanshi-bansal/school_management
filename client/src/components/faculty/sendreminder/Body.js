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
  Avatar,
  Tooltip,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  Send as SendIcon,
  Mail,
  Close,
  Person,
  Group,
  CheckCircle,
} from "@mui/icons-material";
// import { DatePicker, TimePicker } from "@mui/x-date-pickers";


const Body = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Mock data
  const [homeworks, setHomeworks] = useState([
    {
      _id: "hw1",
      title: "Math Assignment",
      class: { _id: "class1", name: "Class 10A" },
    },
    {
      _id: "hw2",
      title: "Science Project",
      class: { _id: "class2", name: "Class 10B" },
    },
  ]);

  const [students, setStudents] = useState([
    { _id: "stu1", name: "John Doe", rollNumber: "S001", class: "class1" },
    { _id: "stu2", name: "Jane Smith", rollNumber: "S002", class: "class1" },
    { _id: "stu3", name: "Alex Johnson", rollNumber: "S003", class: "class2" },
    { _id: "stu4", name: "Sarah Williams", rollNumber: "S004", class: "class2" },
  ]);

  const currentUser = {
    _id: "fac1",
    name: "Dr. Smith",
    email: "smith@school.edu"
  };

  const [formData, setFormData] = useState({
    homework: "",
    message: "",
    recipients: [],
    sentBy: currentUser._id,
  });

  const [errors, setErrors] = useState({
    homework: false,
    message: false,
    recipients: false,
  });

  const [selectedClass, setSelectedClass] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    if (selectedClass) {
      setFilteredStudents(students.filter(s => s.class === selectedClass));
    } else {
      setFilteredStudents(students);
    }
  }, [selectedClass, students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleHomeworkChange = (e) => {
    const homeworkId = e.target.value;
    setFormData(prev => ({
      ...prev,
      homework: homeworkId
    }));

    const selectedHomework = homeworks.find(hw => hw._id === homeworkId);
    if (selectedHomework) {
      setSelectedClass(selectedHomework.class._id);
    }

    if (errors.homework) {
      setErrors(prev => ({
        ...prev,
        homework: false
      }));
    }
  };

  const toggleStudentSelection = (studentId) => {
    setFormData(prev => {
      const newRecipients = [...prev.recipients];
      const index = newRecipients.indexOf(studentId);
      
      if (index === -1) {
        newRecipients.push(studentId);
      } else {
        newRecipients.splice(index, 1);
      }
      
      return {
        ...prev,
        recipients: newRecipients
      };
    });
  };

  const selectAllStudents = () => {
    setFormData(prev => ({
      ...prev,
      recipients: filteredStudents.map(s => s._id)
    }));
  };

  const clearAllStudents = () => {
    setFormData(prev => ({
      ...prev,
      recipients: []
    }));
  };

  const validateForm = () => {
    const newErrors = {
      homework: !formData.homework,
      message: !formData.message.trim(),
      recipients: formData.recipients.length === 0,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setOpenConfirmDialog(true);
    }
  };

  const confirmSendReminder = () => {
    console.log("Reminder data:", {
      ...formData,
      recipientsDetails: students.filter(s => formData.recipients.includes(s._id))
    });
    
    setOpenConfirmDialog(false);
    navigate("/faculty/reminders");
  };

  const getSelectedHomework = () => {
    return homeworks.find(hw => hw._id === formData.homework);
  };

  return (
    <Box sx={{ flex: 1, p: isSmallScreen ? 1 : 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: theme.palette.primary.main }}>
          <ArrowBack />
        </IconButton>
        <Mail color="primary" />
        <Typography variant="h5" color="textPrimary" fontWeight="medium">
          New Homework Reminder
        </Typography>
      </Stack>

      <Paper elevation={3} sx={{ 
        p: isSmallScreen ? 2 : 3, 
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper
      }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Homework Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth error={errors.homework}>
                <InputLabel>Homework</InputLabel>
                <Select
                  value={formData.homework}
                  onChange={handleHomeworkChange}
                  label="Homework"
                >
                  <MenuItem value="">
                    <em>Select a homework</em>
                  </MenuItem>
                  {homeworks.map((hw) => (
                    <MenuItem key={hw._id} value={hw._id}>
                      {hw.title} - {hw.class.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.homework && (
                  <Typography variant="caption" color="error">
                    Please select a homework
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Message */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reminder Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                error={errors.message}
                helperText={errors.message ? "Please enter a reminder message" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                  },
                }}
              />
            </Grid>

            {/* Recipients Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                p: 2
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    <Group sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Select Recipients
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={selectAllStudents}
                      sx={{ textTransform: 'none' }}
                    >
                      Select All
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={clearAllStudents}
                      sx={{ textTransform: 'none' }}
                    >
                      Clear All
                    </Button>
                  </Stack>
                </Stack>

                {formData.homework ? (
                  <List dense sx={{ 
                    maxHeight: 200, 
                    overflow: 'auto',
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1
                  }}>
                    {filteredStudents.map((student) => (
                      <ListItem 
                        key={student._id} 
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: theme.palette.primary.main 
                          }}>
                            {student.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={student.name}
                          secondary={`Roll No: ${student.rollNumber}`}
                        />
                        <ListItemSecondaryAction>
                          <Checkbox
                            edge="end"
                            checked={formData.recipients.includes(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                            color="primary"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                    Please select a homework first to see available students
                  </Typography>
                )}


              {/* {!formData.sendNow && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Scheduled Date"
                      value={formData.scheduledDate}
                      onChange={(newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          scheduledDate: newValue
                        }));
                        if (errors.scheduledDate) {
                          setErrors(prev => ({
                            ...prev,
                            scheduledDate: false
                          }));
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          error={errors.scheduledDate}
                          helperText={errors.scheduledDate ? "Please select a date" : ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Scheduled Time"
                      value={formData.scheduledTime}
                      onChange={(newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          scheduledTime: newValue
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                </Grid>
              )} */}
              </Box>
            </Grid>

            {/* Summary */}
            <Grid item xs={12}>
              <Box sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                p: 2,
                bgcolor: theme.palette.background.default
              }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Reminder Summary
                </Typography>
                
                {formData.homework ? (
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Homework:</Typography>
                      <Typography>{getSelectedHomework()?.title}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Class:</Typography>
                      <Typography>{getSelectedHomework()?.class.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Recipients:</Typography>
                      <Typography>
                        {formData.recipients.length} student{formData.recipients.length !== 1 ? 's' : ''} selected
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Complete the form to see summary
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  startIcon={<Close />}
                  sx={{ textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Send Reminder
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircle color="primary" />
            <Typography variant="h6">Confirm Reminder</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography>
              Are you sure you want to send this reminder to {formData.recipients.length} student{formData.recipients.length !== 1 ? 's' : ''}?
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: theme.palette.background.default
            }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                MESSAGE PREVIEW
              </Typography>
              <Typography whiteSpace="pre-wrap">{formData.message}</Typography>
            </Box>
            
            <Typography variant="body2" color="textSecondary">
              This action cannot be undone.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenConfirmDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmSendReminder}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ textTransform: 'none' }}
          >
            Confirm Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Body;