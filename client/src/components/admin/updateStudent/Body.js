import React, { useState } from 'react';
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Paper,
    Avatar,
    InputAdornment,
    IconButton,
    Tooltip,
    Divider
} from '@mui/material';
import {
    Person,
    CalendarToday,
    Phone,
    Email,
    School,
    Work,
    Image,
    Clear,
    Check,
    Edit
} from '@mui/icons-material';

function StudentForm() {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        department: '',
        contact: '',
        avatar: '',
        email: '',
        designation: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setFormData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.contact) newErrors.contact = 'Contact is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.designation) newErrors.designation = 'Designation is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                console.log('Submitted Data:', formData);
                setIsSubmitting(false);
                // Show success message or redirect
            }, 1500);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            dob: '',
            department: '',
            contact: '',
            avatar: '',
            email: '',
            designation: '',
        });
        setErrors({});
        setAvatarPreview(null);
    };

    return (
        <Paper elevation={3} sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 800,
            mx: 'auto',
            mt: 4


        }}>
            {/* Header with Edit Icon */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 6,
                gap: 2,

            }}>
                <Edit sx={{ fontSize: 32, color: "primary.main" }} />
                <Typography variant="h5" fontWeight={600} color="primary.main">
                    Update Student
                </Typography>
            </Box>



            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Name */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Full Name"
                            name="name"
                            fullWidth
                            size="small" // <-- This makes the input smaller
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person  />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    minHeight: 40, // You can adjust this to control overall height
                                },
                            }}
                            required
                        />
                    </Grid>


                    {/* DOB */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dob}
                            onChange={handleChange}
                            error={!!errors.dob}
                            helperText={errors.dob}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarToday color="primary.main" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    minHeight: 40, // You can adjust this to control overall height
                                },
                            }}

                            required
                        />
                    </Grid>

                    {/* Department */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors.department} size="small">
                            <InputLabel id="department-label">
                                <School sx={{ mr: 1 }} />
                                Department
                            </InputLabel>
                            <Select
                                labelId="department-label"
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiSelect-select': {
                                        minHeight: 40,  // Adjust height here
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingTop: '8px',
                                        paddingBottom: '8px',
                                    },
                                }}
                                required
                            >
                                <MenuItem value="Computer Science">Computer Science</MenuItem>
                                <MenuItem value="Electronics">Electronics</MenuItem>
                                <MenuItem value="Mechanical">Mechanical</MenuItem>
                            </Select>
                            {errors.department && (
                                <Typography variant="caption" color="error">
                                    {errors.department}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Contact */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Contact Number"
                            name="contact"
                            type="tel"
                            fullWidth
                            size='small'
                            value={formData.contact}
                            onChange={handleChange}
                            error={!!errors.contact}
                            helperText={errors.contact}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="primary.main" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    minHeight: 40, // You can adjust this to control overall height
                                },
                            }}

                            required
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Email Address"
                            name="email"
                            type="email"
                            fullWidth
                            size='small'
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="primary.main" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    minHeight: 40, // You can adjust this to control overall height
                                },
                            }}

                            required
                        />
                    </Grid>

                    {/* Designation */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Designation"
                            name="designation"
                            fullWidth
                            size="small"  // reduces input height
                            value={formData.designation}
                            onChange={handleChange}
                            error={!!errors.designation}
                            helperText={errors.designation}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Work />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    minHeight: 40,  // Adjust height here


                                },
                            }}
                            required
                        />
                    </Grid>

                    {/* Avatar URL */}
                    {!avatarPreview && (
                        <Grid item xs={12}>
                            <TextField
                                label="Avatar URL (optional)"
                                name="avatar"
                                fullWidth
                                size='small'
                                value={formData.avatar}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Image color="primary.main" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        minHeight: 40, // You can adjust this to control overall height
                                    },
                                }}


                            />
                        </Grid>
                    )}

                    {/* Form Actions */}
                    <Grid item xs={12}>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2
                        }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleReset}
                                startIcon={<Clear color="primary.main" />}
                                sx={{
                                    px: 3,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2
                                    }
                                }}
                            >
                                Clear Form
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<Check />}
                                disabled={isSubmitting}
                                sx={{
                                    px: 3,
                                    fontWeight: 600,
                                    boxShadow: 2,
                                    '&:hover': {
                                        boxShadow: 3
                                    }
                                }}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Student'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

export default StudentForm;