import React, { useState } from "react";
import {
  Person as PersonIcon,
  Class as ClassIcon,
  Category as CategoryIcon,
  Clear,
  Save
} from "@mui/icons-material";
import {
  Select,
  MenuItem,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  Avatar,
  Paper,
  Grid,
  InputAdornment,
  Divider
} from "@mui/material";

const Body = () => {
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    student: ""
  });

  const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const sections = ["A", "B", "C", "D", "E"];
  const students = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Williams",
    "David Miller"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.class && formData.section && formData.student) {
      alert(`Assigned ${formData.student} to Class ${formData.class} Section ${formData.section}`);
    } else {
      alert("Please fill all fields");
    }
  };

  const resetForm = () => {
    setFormData({
      class: "",
      section: "",
      student: ""
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        
          <PersonIcon sx={{ fontSize: 42,  mr: 2, color:'primary.main' }} />
   
        <Typography variant="h4" sx={{ fontWeight: 500, color: 'text.primary' }}>
          Student Section Assignment
        </Typography>
      </Box>

      {/* Form */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Class */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ClassIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select Class</em>
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>
                      Class {cls}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            {/* Section */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select Section</em>
                  </MenuItem>
                  {sections.map((section) => (
                    <MenuItem key={section} value={section}>
                      Section {section}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            {/* Student */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Student"
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select Student</em>
                  </MenuItem>
                  {students.map((student, idx) => (
                    <MenuItem key={idx} value={student}>
                      {student}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={resetForm}
                  sx={{
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  sx={{
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    }
                  }}
                >
                  Assign Student
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Body;