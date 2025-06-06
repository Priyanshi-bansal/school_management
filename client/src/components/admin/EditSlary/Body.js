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
  IconButton,
} from '@mui/material';
import { Paid as PaidIcon } from '@mui/icons-material';

import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
const Body = () => {
  const initialData = {
    name: "Assistant Professor Salary Structure 2023",
    applicableFrom: "2023-04-01",
    status: "active",
    components: []
  };

  const [formData, setFormData] = useState(initialData);
  const [salaryComponents, setSalaryComponents] = useState([
    {
      name: "",
      type: "earning",
      calculationType: "fixed",
      amount: "",
      percentage: "",
      basedOn: "",
    },
  ]);


  const addSalaryComponent = () => {
    setSalaryComponents([
      ...salaryComponents,
      {
        name: "",
        type: "earning",
        calculationType: "fixed",
        amount: "",
        percentage: "",
        basedOn: "",
      },
    ]);
  };

  const removeSalaryComponent = (index) => {
    const updatedComponents = [...salaryComponents];
    updatedComponents.splice(index, 1);
    setSalaryComponents(updatedComponents);
  };

  const handleSalaryComponentChange = (index, field, value) => {
    const updatedComponents = [...salaryComponents];
    updatedComponents[index][field] = value;
    setSalaryComponents(updatedComponents);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted structure:", formData);
    // Send to backend here
  };

  return (
    <Box sx={{ p: 3,width:1000 }}>
      <Typography variant="h5" gutterBottom>
        <PaidIcon color="primary" sx={{ mr: 1, height: 42, width: 42 }} />
        Edit salary
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
            Salary Components
          </Typography>

          {salaryComponents.map((component, index) => (
            <Grid container spacing={2} alignItems="center" key={index}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Component Name"
                  value={component.name}
                  onChange={(e) => handleSalaryComponentChange(index, "name", e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={component.type}
                    onChange={(e) => handleSalaryComponentChange(index, "type", e.target.value)}
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
                    value={component.calculationType}
                    onChange={(e) => handleSalaryComponentChange(index, "calculationType", e.target.value)}
                    label="Calculation Type"
                    required
                  >
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {component.calculationType === "fixed" ? (
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={component.amount}
                    onChange={(e) => handleSalaryComponentChange(index, "amount", e.target.value)}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={6} md={1}>
                    <TextField
                      fullWidth
                      label="%"
                      type="number"
                      value={component.percentage}
                      onChange={(e) => handleSalaryComponentChange(index, "percentage", e.target.value)}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Based On</InputLabel>
                      <Select
                        value={component.basedOn}
                        onChange={(e) => handleSalaryComponentChange(index, "basedOn", e.target.value)}
                        label="Based On"
                        required
                      >
                        <MenuItem value="basic">Basic Salary</MenuItem>
                        <MenuItem value="gross">Gross Salary</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={1}>
                <div className="flex space-x-2">
                  {index === salaryComponents.length - 1 && (
                    <IconButton color="primary" onClick={addSalaryComponent}>
                      <AddIcon />
                    </IconButton>
                  )}
                  {salaryComponents.length > 1 && (
                    <IconButton color="error" onClick={() => removeSalaryComponent(index)}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </div>
              </Grid>
            </Grid>
          ))}


          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Edit Salary
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Body;