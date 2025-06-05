import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Body = () => {
  const initialData = {
    name: "Assistant Professor Salary Structure 2023",
    applicableFrom: "2023-04-01",
    status: "active",
    components: []
  };

  const [formData, setFormData] = useState(initialData);
  const [newComponent, setNewComponent] = useState({
    name: "",
    type: "earning",
    calculationType: "fixed",
    amount: 0,
    percentage: 0,
    basedOn: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewComponentChange = (e) => {
    const { name, value } = e.target;
    setNewComponent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addComponent = () => {
    if (!newComponent.name.trim()) return;

    setFormData(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));

    setNewComponent({
      name: "",
      type: "earning",
      calculationType: "fixed",
      amount: 0,
      percentage: 0,
      basedOn: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted structure:", formData);
    // Send to backend here
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Salary Structure Form
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Structure Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Applicable From"
                name="applicableFrom"
                type="date"
                value={formData.applicableFrom}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Add New Component
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Component Name"
                name="name"
                value={newComponent.name}
                onChange={handleNewComponentChange}
                required
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={newComponent.type}
                  onChange={handleNewComponentChange}
                  label="Type"
                  required
                >
                  <MenuItem value="earning">Earning</MenuItem>
                  <MenuItem value="deduction">Deduction</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Calculation Type</InputLabel>
                <Select
                  name="calculationType"
                  value={newComponent.calculationType}
                  onChange={handleNewComponentChange}
                  label="Calculation Type"
                  required
                >
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {newComponent.calculationType === "fixed" ? (
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={newComponent.amount}
                  onChange={handleNewComponentChange}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={6} md={1}>
                  <TextField
                    fullWidth
                    label="%"
                    name="percentage"
                    type="number"
                    value={newComponent.percentage}
                    onChange={handleNewComponentChange}
                    required
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
                {newComponent.calculationType === "percentage" && (
                  <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Based On</InputLabel>
                      <Select
                        name="basedOn"
                        value={newComponent.basedOn}
                        onChange={handleNewComponentChange}
                        required
                      >
                        <MenuItem value="basic">Basic Salary</MenuItem>
                        <MenuItem value="gross">Gross Salary</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

              </>
            )}

            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addComponent}
              
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Structure
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Body;
