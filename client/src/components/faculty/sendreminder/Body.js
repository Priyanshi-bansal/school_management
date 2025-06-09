// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   Stack,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Divider,
//   Grid,
//   Chip,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   useTheme,
//   useMediaQuery,
//   Avatar,
//   Tooltip,
//   Badge,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import {
//   Assignment as AssignmentIcon,
//   ArrowBack,
//   Search,
//   ClearAll,
//   Send as SendIcon,
//   Visibility,
//   Edit,
//   Delete,
//   Add,
//   Schedule,
//   Mail,
// } from "@mui/icons-material";

// const Body = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   // Mock data - replace with actual data from your API
//   const [reminders, setReminders] = useState([
//     {
//       _id: "1",
//       homework: {
//         _id: "hw1",
//         title: "Math Assignment",
//         dueDate: "2024-05-15",
//       },
//       sentTo: [
//         { _id: "stu1", name: "John Doe", rollNumber: "S001" },
//         { _id: "stu2", name: "Jane Smith", rollNumber: "S002" },
//       ],
//       sentBy: {
//         _id: "fac1",
//         name: "Dr. Smith",
//       },
//       message: "Reminder: Math Assignment due tomorrow",
//       sentAt: "2024-05-14T10:30:00Z",
//       scheduled: false,
//     },
//     {
//       _id: "2",
//       homework: {
//         _id: "hw2",
//         title: "Science Project",
//         dueDate: "2024-05-20",
//       },
//       sentTo: [
//         { _id: "stu3", name: "Alex Johnson", rollNumber: "S003" },
//       ],
//       sentBy: {
//         _id: "fac1",
//         name: "Dr. Smith",
//       },
//       message: "Science Project submission reminder",
//       sentAt: "2024-05-18T09:15:00Z",
//       scheduled: true,
//       scheduledDate: "2024-05-18T09:00:00Z",
//     },
//   ]);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedHomework, setSelectedHomework] = useState("all");
//   const [filteredReminders, setFilteredReminders] = useState(reminders);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedReminder, setSelectedReminder] = useState(null);

//   useEffect(() => {
//     setFilteredReminders(reminders);
//   }, [reminders]);

//   const handleSearch = () => {
//     let filtered = [...reminders];
//     if (selectedHomework !== "all") {
//       filtered = filtered.filter(r => r.homework._id === selectedHomework);
//     }
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(
//         r =>
//           r.homework.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           r.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           r.sentBy.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     setFilteredReminders(filtered);
//   };

//   const clearFilters = () => {
//     setSelectedHomework("all");
//     setSearchQuery("");
//     setFilteredReminders(reminders);
//   };

//   const handleViewDetails = (reminder) => {
//     setSelectedReminder(reminder);
//     setOpenDialog(true);
//   };

//   const handleSendNewReminder = () => {
//     navigate("/faculty/send-reminder");
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not scheduled";
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric', 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const getStatusColor = (scheduled) => {
//     return scheduled ? "warning" : "success";
//   };

//   return (
//     <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
//       {/* Header */}
//       <Stack direction="row" alignItems="center" spacing={2} mb={3}>
//         <IconButton onClick={() => navigate(-1)}>
//           <ArrowBack />
//         </IconButton>
//         <Mail color="primary" />
//         <Typography variant="h5" color="textPrimary">
//           Homework Reminders
//         </Typography>
//         <Chip
//           label={`Total: ${reminders.length}`}
//           color="primary"
//           variant="outlined"
//           size={isSmallScreen ? "small" : "medium"}
//         />
//       </Stack>

//       <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
//         {/* Filters and Actions */}
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           spacing={2}
//           alignItems={{ xs: "stretch", sm: "center" }}
//           justifyContent="space-between"
//           sx={{ mb: 3 }}
//         >
//           <Stack 
//             direction={{ xs: "column", sm: "row" }} 
//             spacing={2} 
//             sx={{ width: { xs: '100%', sm: 'auto' } }}
//           >
//             <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }} size="small">
//               <InputLabel>Homework</InputLabel>
//               <Select
//                 value={selectedHomework}
//                 onChange={(e) => setSelectedHomework(e.target.value)}
//                 label="Homework"
//               >
//                 <MenuItem value="all">All Homeworks</MenuItem>
//                 {[...new Set(reminders.map(r => r.homework._id))].map((hwId) => {
//                   const hw = reminders.find(r => r.homework._id === hwId).homework;
//                   return (
//                     <MenuItem key={hwId} value={hwId}>
//                       {hw.title} (Due: {new Date(hw.dueDate).toLocaleDateString()})
//                     </MenuItem>
//                   );
//                 })}
//               </Select>
//             </FormControl>

//             <TextField
//               name="searchQuery"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               label="Search Reminders"
//               variant="outlined"
//               size="small"
//               fullWidth
//               InputProps={{
//                 endAdornment: (
//                   <IconButton onClick={handleSearch}>
//                     <Search />
//                   </IconButton>
//                 ),
//               }}
//             />

//             <Button
//               variant="outlined"
//               startIcon={<ClearAll />}
//               onClick={clearFilters}
//               sx={{ whiteSpace: "nowrap" }}
//             >
//               Clear Filters
//             </Button>
//           </Stack>

//           <Button
//             variant="contained"
//             startIcon={<SendIcon />}
//             onClick={handleSendNewReminder}
//             sx={{ 
//               whiteSpace: "nowrap",
//               width: { xs: '100%', sm: 'auto' },
//               mt: { xs: 1, sm: 0 }
//             }}
//           >
//             New Reminder
//           </Button>
//         </Stack>

//         {/* Reminders Table */}
//         <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
//           <Table size={isSmallScreen ? "small" : "medium"}>
//             <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
//               <TableRow>
//                 <TableCell>#</TableCell>
//                 <TableCell>Homework</TableCell>
//                 <TableCell>Message</TableCell>
//                 <TableCell>Recipients</TableCell>
//                 <TableCell>Sent By</TableCell>
//                 <TableCell>Sent At</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredReminders.length > 0 ? (
//                 filteredReminders.map((reminder, idx) => (
//                   <TableRow key={reminder._id} hover>
//                     <TableCell>{idx + 1}</TableCell>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="medium">
//                         {reminder.homework.title}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         Due: {formatDate(reminder.homework.dueDate)}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography noWrap sx={{ maxWidth: 200 }}>
//                         {reminder.message}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Tooltip 
//                         title={reminder.sentTo.map(s => `${s.name} (${s.rollNumber})`).join(", ")}
//                       >
//                         <Chip
//                           label={`${reminder.sentTo.length} students`}
//                           size="small"
//                           variant="outlined"
//                         />
//                       </Tooltip>
//                     </TableCell>
//                     <TableCell>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <Avatar sx={{ width: 32, height: 32 }}>
//                           {reminder.sentBy.name.charAt(0)}
//                         </Avatar>
//                         <Typography variant="body2">
//                           {reminder.sentBy.name}
//                         </Typography>
//                       </Stack>
//                     </TableCell>
//                     <TableCell>
//                       {reminder.scheduled ? (
//                         <Stack direction="row" alignItems="center" spacing={0.5}>
//                           <Schedule fontSize="small" color="warning" />
//                           <Typography variant="body2">
//                             {formatDate(reminder.scheduledDate)}
//                           </Typography>
//                         </Stack>
//                       ) : (
//                         formatDate(reminder.sentAt)
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={reminder.scheduled ? "Scheduled" : "Sent"}
//                         color={getStatusColor(reminder.scheduled)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={1}>
//                         <Tooltip title="View Details">
//                           <IconButton
//                             color="primary"
//                             size="small"
//                             onClick={() => handleViewDetails(reminder)}
//                           >
//                             <Visibility fontSize="small" />
//                           </IconButton>
//                         </Tooltip>

//                         <Tooltip title="Resend">
//                           <IconButton
//                             color="secondary"
//                             size="small"
//                             onClick={() => console.log("Resend reminder", reminder._id)}
//                           >
//                             <SendIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
//                     No reminders found matching your criteria
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Summary Stats */}
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 2,
//             p: 2,
//             backgroundColor: theme.palette.background.paper,
//             borderRadius: 1,
//           }}
//         >
//           <Chip
//             label={`Sent: ${reminders.filter(r => !r.scheduled).length}`}
//             color="success"
//             variant="outlined"
//           />
//           <Chip
//             label={`Scheduled: ${reminders.filter(r => r.scheduled).length}`}
//             color="warning"
//             variant="outlined"
//           />
//           <Chip
//             label={`Total Students: ${
//               reminders.reduce((sum, r) => sum + r.sentTo.length, 0)
//             }`}
//             color="info"
//             variant="outlined"
//           />
//         </Box>
//       </Paper>

//       {/* Reminder Details Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Reminder Details</DialogTitle>
//         <DialogContent dividers>
//           {selectedReminder && (
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Homework: {selectedReminder.homework.title}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Due: {formatDate(selectedReminder.homework.dueDate)}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Message
//                 </Typography>
//                 <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
//                   <Typography>{selectedReminder.message}</Typography>
//                 </Paper>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Sent By
//                 </Typography>
//                 <Stack direction="row" alignItems="center" spacing={1}>
//                   <Avatar>{selectedReminder.sentBy.name.charAt(0)}</Avatar>
//                   <Typography>{selectedReminder.sentBy.name}</Typography>
//                 </Stack>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   {selectedReminder.scheduled ? "Scheduled For" : "Sent At"}
//                 </Typography>
//                 <Typography>
//                   {selectedReminder.scheduled
//                     ? formatDate(selectedReminder.scheduledDate)
//                     : formatDate(selectedReminder.sentAt)}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Recipients ({selectedReminder.sentTo.length})
//                 </Typography>
//                 <Box
//                   sx={{
//                     maxHeight: 200,
//                     overflow: 'auto',
//                     p: 1,
//                     border: `1px solid ${theme.palette.divider}`,
//                     borderRadius: 1,
//                   }}
//                 >
//                   {selectedReminder.sentTo.map((student) => (
//                     <Chip
//                       key={student._id}
//                       label={`${student.name} (${student.rollNumber})`}
//                       sx={{ m: 0.5 }}
//                     />
//                   ))}
//                 </Box>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Body;








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
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  ArrowBack,
  Send as SendIcon,
  Schedule,
  Mail,
  Close,
  Person,
  Group,
} from "@mui/icons-material";
// import { DatePicker, TimePicker } from "@mui/x-date-pickers";

const Body= () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Mock data - replace with actual data from your API
  const [homeworks, setHomeworks] = useState([
    {
      _id: "hw1",
      title: "Math Assignment",
      dueDate: "2024-05-15",
      class: { _id: "class1", name: "Class 10A" },
    },
    {
      _id: "hw2",
      title: "Science Project",
      dueDate: "2024-05-20",
      class: { _id: "class2", name: "Class 10B" },
    },
  ]);

  const [students, setStudents] = useState([
    { _id: "stu1", name: "John Doe", rollNumber: "S001", class: "class1" },
    { _id: "stu2", name: "Jane Smith", rollNumber: "S002", class: "class1" },
    { _id: "stu3", name: "Alex Johnson", rollNumber: "S003", class: "class2" },
    { _id: "stu4", name: "Sarah Williams", rollNumber: "S004", class: "class2" },
  ]);

  const [facultyMembers, setFacultyMembers] = useState([
    { _id: "fac1", name: "Dr. Smith", email: "smith@school.edu" },
    { _id: "fac2", name: "Prof. Johnson", email: "johnson@school.edu" },
  ]);

  const [formData, setFormData] = useState({
    homework: "",
    message: "",
    recipients: [],
    sentBy: "fac1", // Default to current user
    sendNow: true,
    scheduledDate: null,
    scheduledTime: null,
  });

  const [errors, setErrors] = useState({
    homework: false,
    message: false,
    recipients: false,
    sentBy: false,
    scheduledDate: false,
  });

  const [selectedClass, setSelectedClass] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Current user (would normally come from auth context)
  const currentUser = facultyMembers[0];

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
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleHomeworkChange = (e) => {
    const homeworkId = e.target.value;
    setFormData(prev => ({
      ...prev,
      homework: homeworkId
    }));

    // Auto-select class based on homework
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
      sentBy: !formData.sentBy,
      scheduledDate: !formData.sendNow && !formData.scheduledDate,
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
    // Here you would typically make an API call to send/schedule the reminder
    console.log("Reminder data:", {
      ...formData,
      sentByDetails: facultyMembers.find(f => f._id === formData.sentBy),
      recipientsDetails: students.filter(s => formData.recipients.includes(s._id))
    });
    
    // Mock success - navigate back to reminders list
    setOpenConfirmDialog(false);
    navigate("/faculty/reminders");
  };

  const getSelectedHomework = () => {
    return homeworks.find(hw => hw._id === formData.homework);
  };

  const getSelectedSentBy = () => {
    return facultyMembers.find(f => f._id === formData.sentBy);
  };

  return (
    <Box sx={{ flex: 1, mt: 3, p: { xs: 1, sm: 3 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Mail color="primary" />
        <Typography variant="h5" color="textPrimary">
          New Homework Reminder
        </Typography>
      </Stack>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Homework Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth error={errors.homework}>
                <InputLabel id="homework-select-label">Homework</InputLabel>
                <Select
                  labelId="homework-select-label"
                  id="homework"
                  name="homework"
                  value={formData.homework}
                  onChange={handleHomeworkChange}
                  label="Homework"
                >
                  <MenuItem value="">
                    <em>Select a homework</em>
                  </MenuItem>
                  {homeworks.map((hw) => (
                    <MenuItem key={hw._id} value={hw._id}>
                      {hw.title} - {hw.class.name} (Due: {new Date(hw.dueDate).toLocaleDateString()})
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

            {/* Sent By Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                Sent By
              </Typography>
              <FormControl fullWidth error={errors.sentBy}>
                <InputLabel id="sent-by-label">Sender</InputLabel>
                <Select
                  labelId="sent-by-label"
                  id="sentBy"
                  name="sentBy"
                  value={formData.sentBy}
                  onChange={handleChange}
                  label="Sender"
                >
                  {facultyMembers.map((faculty) => (
                    <MenuItem key={faculty._id} value={faculty._id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {faculty.name.charAt(0)}
                        </Avatar>
                        <Typography>
                          {faculty.name} ({faculty.email})
                        </Typography>
                        {faculty._id === currentUser._id && (
                          <Chip label="You" size="small" color="primary" />
                        )}
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
                {errors.sentBy && (
                  <Typography variant="caption" color="error">
                    Please select a sender
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Message */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="message"
                name="message"
                label="Reminder Message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                helperText={errors.message ? "Please enter a reminder message" : ""}
              />
            </Grid>

            {/* Sent To Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <Group sx={{ verticalAlign: 'middle', mr: 1 }} />
                Sent To
              </Typography>
              
              {formData.homework ? (
                <>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={selectAllStudents}
                    >
                      Select All
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={clearAllStudents}
                    >
                      Clear All
                    </Button>
                  </Stack>

                  <Paper elevation={0} sx={{ p: 1, bgcolor: 'background.default', maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {filteredStudents.map((student) => (
                        <ListItem key={student._id}>
                          <ListItemAvatar>
                            <Avatar>
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
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Please select a homework first to see available students
                </Typography>
              )}

              {errors.recipients && (
                <Typography variant="caption" color="error">
                  Please select at least one recipient
                </Typography>
              )}
            </Grid>

            {/* Scheduling Options */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Scheduling Options
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.sendNow}
                      onChange={handleCheckboxChange}
                      name="sendNow"
                    />
                  }
                  label="Send immediately"
                />
              </FormGroup>

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
            </Grid>

            {/* Summary */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Reminder Summary
                </Typography>
                
                {formData.homework ? (
                  <>
                    <Typography>
                      <strong>Homework:</strong> {getSelectedHomework()?.title}
                    </Typography>
                    <Typography>
                      <strong>Class:</strong> {getSelectedHomework()?.class.name}
                    </Typography>
                    <Typography>
                      <strong>Due Date:</strong> {new Date(getSelectedHomework()?.dueDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Sent By:</strong> {getSelectedSentBy()?.name}
                    </Typography>
                    <Typography>
                      <strong>Sent To:</strong> {formData.recipients.length} students
                    </Typography>
                    <Typography>
                      <strong>Send:</strong> {formData.sendNow ? "Immediately" : 
                        formData.scheduledDate ? `On ${formData.scheduledDate.toLocaleDateString()} at ${formData.scheduledTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 
                        "Not scheduled"}
                    </Typography>
                  </>
                ) : (
                  <Typography>Select a homework to see summary</Typography>
                )}
              </Paper>
            </Grid>

            {/* Form Actions */}
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
                  startIcon={<SendIcon />}
                >
                  {formData.sendNow ? "Send Now" : "Schedule Reminder"}
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
      >
        <DialogTitle>
          {formData.sendNow ? "Send Reminder Now?" : "Schedule Reminder?"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            You are about to {formData.sendNow ? "send" : "schedule"} a reminder with these details:
          </Typography>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {getSelectedHomework()?.title}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Sent By:</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {getSelectedSentBy()?.name.charAt(0)}
                  </Avatar>
                  <Typography>{getSelectedSentBy()?.name}</Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2">Sent To:</Typography>
                <Typography>
                  {formData.recipients.length} students in {getSelectedHomework()?.class.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Message:</Typography>
                <Paper elevation={0} sx={{ p: 1, bgcolor: 'background.paper' }}>
                  <Typography>{formData.message}</Typography>
                </Paper>
              </Grid>
              
              {!formData.sendNow && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Scheduled Time:</Typography>
                  <Typography>
                    {formData.scheduledDate?.toLocaleDateString()} at {formData.scheduledTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmSendReminder} 
            variant="contained" 
            color="primary"
            startIcon={<SendIcon />}
          >
            {formData.sendNow ? "Send Now" : "Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Body;