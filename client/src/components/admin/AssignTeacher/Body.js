import React, { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    MenuItem,
    Select,
    FormControl,
    Button,
    Box,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Avatar,
    Chip
} from "@mui/material";

const Body = () => {
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const teachers = [
        { name: "John Doe", subject: "Mathematics" },
        { name: "Jane Smith", subject: "Science" },
        { name: "Michael Johnson", subject: "Literature" },
        { name: "Emily Davis", subject: "History" }
    ];

    const classes = [1, 2, 3, 4];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            if (selectedTeacher && selectedClass) {
                setSnackbarMessage(`Successfully assigned ${selectedTeacher} to Class ${selectedClass}`);
                setSnackbarSeverity("success");
            } else {
                setSnackbarMessage("Please select both a teacher and a class.");
                setSnackbarSeverity("error");
            }
            setOpenSnackbar(true);
            setIsSubmitting(false);
        }, 1000);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const getInitials = (name) =>
        name.split(' ').map(n => n[0]).join('');

    return (
        <div>
            <Typography
                variant="h2"
                sx={{
                    textAlign: "center",
                    mt: 5,
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <PersonIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
                Assign Class Teacher
            </Typography>

            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    justifyContent: "center",
                    p: 3,
                    transition: 'all 0.3s ease'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 700,
                        
                            boxShadow: 6
                        
                    }}
                >
                    <form onSubmit={handleSubmit}>
                       
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 , color: 'primary.main'}}>
                                Select Teacher
                            </Typography>
                            <Select
                                displayEmpty
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                renderValue={(selected) =>
                                    selected ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                {getInitials(selected)}
                                            </Avatar>
                                            <Typography>{selected}</Typography>
                                        </Box>
                                    ) : (
                                        "Select Teacher"
                                    )
                                }
                                sx={{ borderRadius: 3 }}
                                inputProps={{ 'aria-label': 'Select Teacher' }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            mt: 1,
                                            borderRadius: 2,
                                            boxShadow: 3
                                        }
                                    }
                                }}
                            >
                                <MenuItem disabled value="">
                                    <em>Select Teacher</em>
                                </MenuItem>
                                {teachers.map((teacher, idx) => (
                                    <MenuItem key={idx} value={teacher.name}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                {getInitials(teacher.name)}
                                            </Avatar>
                                            <Box>
                                                <Typography fontWeight="medium">{teacher.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {teacher.subject}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 ,color: 'primary.main' }}>
                                Select Class
                            </Typography>
                            <Select
                                displayEmpty
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                renderValue={(selected) =>
                                    selected ? (
                                        <Chip
                                            label={`Class ${selected}`}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    ) : (
                                        "Select Class"
                                    )
                                }
                                sx={{ borderRadius: 3 }}
                                inputProps={{ 'aria-label': 'Select Class' }}
                            >
                                <MenuItem disabled value="">
                                    <em>Select Class</em>
                                </MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls} value={cls}>
                                        Class {cls}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                                height: "50px",
                                borderRadius: 3,
                                fontSize: '1rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'primary.dark'
                                }
                            }}
                            startIcon={isSubmitting ? null : <CheckCircleIcon />}
                        >
                            {isSubmitting ? 'Assigning...' : 'Assign Teacher'}
                        </Button>
                    </form>
                </Paper>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                    elevation={6}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Body;
