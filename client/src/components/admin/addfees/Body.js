
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
  Checkbox,
  Collapse,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  CurrencyExchange as CurrencyExchangeIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  EventRepeat as EventRepeatIcon,
  CurrencyRupee as CurrencyRupeeIcon,

  PriceChange as PriceChangeIcon,
  Clear as ClearIcon
} from '@mui/icons-material';


const Body = () => {
  const [formData, setFormData] = useState({
    className: "",
    academicYear: "",
    components: [{
      name: "Tuition Fee",
      isOptional: false,
      isRefundable: true,
      earlyPaymentDiscount: {
        active: false,
        amount: 0,
        percentage: 0,
        applicableTill: ""
      },
      siblingDiscount: {
        active: false,
        percentage: 0,
        maxDiscount: 0
      },
      installments: [{
        name: "First Installment",
        dueDate: "",
        percentage: 100,
        lateFee: {
          active: false,
          amount: 0,
          percentage: 0,
          applicableAfter: 0
        }
      }]
    }]
  });
  const component = formData.components[0];
  const compIndex = 0;

  const [expandedComponent, setExpandedComponent] = useState(null);
  const [expandedInstallment, setExpandedInstallment] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...formData.components];
    updatedComponents[index][field] = value;
    setFormData(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  const handleEarlyPaymentChange = (compIndex, field, value) => {
    const updatedComponents = [...formData.components];
    updatedComponents[compIndex].earlyPaymentDiscount[field] = value;
    setFormData(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  const handleSiblingDiscountChange = (compIndex, field, value) => {
    const updatedComponents = [...formData.components];
    updatedComponents[compIndex].siblingDiscount[field] = value;
    setFormData(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  const handleInstallmentChange = (compIndex, instIndex, field, value) => {
    const updatedComponents = [...formData.components];
    updatedComponents[compIndex].installments[instIndex][field] = value;
    setFormData(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  const handleLateFeeChange = (compIndex, instIndex, field, value) => {
    const updatedComponents = [...formData.components];
    updatedComponents[compIndex].installments[instIndex].lateFee[field] = value;
    setFormData(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  const addComponent = () => {
    setFormData(prev => ({
      ...prev,
      components: [...prev.components, {
        name: "Tuition Fee",
        isOptional: false,
        isRefundable: true,
        earlyPaymentDiscount: {
          active: false,
          amount: 0,
          percentage: 0,
          applicableTill: ""
        },
        siblingDiscount: {
          active: false,
          percentage: 0,
          maxDiscount: 0
        },
        installments: [{
          name: "First Installment",
          dueDate: "",
          percentage: 100,
          lateFee: {
            active: false,
            amount: 0,
            percentage: 0,
            applicableAfter: 0
          }
        }]
      }]
    }));
  };

  const removeComponent = (index) => {
    const updated = [...formData.components];
    updated.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      components: updated
    }));
  };

  const addInstallment = (compIndex) => {
    const updatedComponents = [...formData.components];
    updatedComponents[compIndex].installments.push({
      name: `Installment ${updatedComponents[compIndex].installments.length + 1}`,
      dueDate: "",
      percentage: 0,
      lateFee: {
        active: false,
        amount: 0,
        percentage: 0,
        applicableAfter: 0
      }
    });
    setFormData(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  const removeInstallment = (compIndex, instIndex) => {
    const updatedComponents = [...formData.components];
    updatedComponents[compIndex].installments.splice(instIndex, 1);
    setFormData(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  const toggleComponentExpand = (index) => {
    setExpandedComponent(expandedComponent === index ? null : index);
  };

  const toggleInstallmentExpand = (compIndex, instIndex) => {
    const key = `${compIndex}-${instIndex}`;
    setExpandedInstallment(expandedInstallment === key ? null : key);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted fee structure:", formData);
    // Submit to backend here
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          p: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <AddIcon color="primary" sx={{
            mr: 2,
            fontSize: '2.5rem',
            backgroundColor: '#eef2ff',
            p: 1,
            borderRadius: '50%'
          }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Fee Structure Form
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Create and manage fee structures for classes
            </Typography>
          </Box>
        </Box>

        {/* Form Card */}
        <Paper elevation={0} sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Class Name"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Academic Year"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 3 }}>
              <PriceChangeIcon color="primary" sx={{
                mr: 2,
                fontSize: '2.5rem',
                backgroundColor: '#eef2ff',
                p: 1,
                borderRadius: '50%'
              }} />
              Fee Discount Components

            </Typography>
            <Box
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 2,
                  flexWrap: 'wrap'
                }}
                onClick={() => toggleComponentExpand(compIndex)}
              ></Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  <CurrencyExchangeIcon color="primary" sx={{
                    mr: 2,
                    fontSize: '2.5rem',
                    backgroundColor: '#eef2ff',
                    p: 1,
                    borderRadius: '50%'
                  }} />
                  Fee Discount
                </Typography>

                {/* Early Payment Discount */}
                <Box sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white'
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={component.earlyPaymentDiscount.active}
                        onChange={(e) => handleEarlyPaymentChange(compIndex, "active", e.target.checked)}
                      />
                    }
                    label="Early Payment Discount"
                  />
                  {component.earlyPaymentDiscount.active && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Discount Amount"
                          type="number"
                          value={component.earlyPaymentDiscount.amount}
                          onChange={(e) => handleEarlyPaymentChange(compIndex, "amount", e.target.value)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Discount Percentage"
                          type="number"
                          value={component.earlyPaymentDiscount.percentage}
                          onChange={(e) => handleEarlyPaymentChange(compIndex, "percentage", e.target.value)}
                          inputProps={{ min: 0, max: 100 }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Applicable Till"
                          type="date"
                          value={component.earlyPaymentDiscount.applicableTill}
                          onChange={(e) => handleEarlyPaymentChange(compIndex, "applicableTill", e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>

                {/* Sibling Discount */}
                <Box sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white'
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={component.siblingDiscount.active}
                        onChange={(e) => handleSiblingDiscountChange(compIndex, "active", e.target.checked)}
                      />
                    }
                    label="Sibling Discount"
                  />
                  {component.siblingDiscount.active && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Discount Percentage"
                          type="number"
                          value={component.siblingDiscount.percentage}
                          onChange={(e) => handleSiblingDiscountChange(compIndex, "percentage", e.target.value)}
                          inputProps={{ min: 0, max: 100 }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Maximum Discount"
                          type="number"
                          value={component.siblingDiscount.maxDiscount}
                          onChange={(e) => handleSiblingDiscountChange(compIndex, "maxDiscount", e.target.value)}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>

                {/* Installments */}
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  <EventRepeatIcon color="primary" sx={{
                    mr: 2,
                    fontSize: '2.5rem',
                    backgroundColor: '#eef2ff',
                    p: 1,
                    borderRadius: '50%'
                  }} />
                  Installments
                </Typography>

                {component.installments.map((installment, instIndex) => (
                  <Box
                    key={instIndex}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 1,
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'white'
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }} onClick={() => toggleInstallmentExpand(compIndex, instIndex)}>
                      <Typography sx={{ fontWeight: 500 }}>
                        {installment.name}
                      </Typography>
                      <Box>
                        {component.installments.length > 1 && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeInstallment(compIndex, instIndex);
                            }}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <RemoveIcon fontSize="small" color="error" />
                          </IconButton>
                        )}
                        {expandedInstallment === `${compIndex}-${instIndex}` ? (
                          <ExpandLessIcon fontSize="small" />
                        ) : (
                          <ExpandMoreIcon fontSize="small" />
                        )}
                      </Box>
                    </Box>

                    <Collapse in={expandedInstallment === `${compIndex}-${instIndex}`}>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Installment Name"
                            value={installment.name}
                            onChange={(e) => handleInstallmentChange(compIndex, instIndex, "name", e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={installment.dueDate}
                            onChange={(e) => handleInstallmentChange(compIndex, instIndex, "dueDate", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Percentage"
                            type="number"
                            value={installment.percentage}
                            onChange={(e) => handleInstallmentChange(compIndex, instIndex, "percentage", e.target.value)}
                            inputProps={{ min: 0, max: 100 }}
                            size="small"
                          />
                        </Grid>
                      </Grid>

                      {/* Late Fee */}
                      <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #e5e7eb' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={installment.lateFee.active}
                              onChange={(e) => handleLateFeeChange(compIndex, instIndex, "active", e.target.checked)}
                            />
                          }
                          label="Late Fee"
                        />
                        {installment.lateFee.active && (
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                label="Late Fee Amount"
                                type="number"
                                value={installment.lateFee.amount}
                                onChange={(e) => handleLateFeeChange(compIndex, instIndex, "amount", e.target.value)}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                label="Late Fee Percentage"
                                type="number"
                                value={installment.lateFee.percentage}
                                onChange={(e) => handleLateFeeChange(compIndex, instIndex, "percentage", e.target.value)}
                                inputProps={{ min: 0, max: 100 }}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                label="Applicable After (days)"
                                type="number"
                                value={installment.lateFee.applicableAfter}
                                onChange={(e) => handleLateFeeChange(compIndex, instIndex, "applicableAfter", e.target.value)}
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => addInstallment(compIndex)}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Installment
                </Button>
              </Box>
            </Box>


 <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 3 }}>
              <CurrencyRupeeIcon color="primary" sx={{
                mr: 2,
                fontSize: '2.5rem',
                backgroundColor: '#eef2ff',
                p: 1,
                borderRadius: '50%'
              }} />
              Fee Components
            </Typography>

            {formData.components.map((component, compIndex) => (
              <Box
                key={compIndex}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: 2, //
                    flexWrap: 'wrap' // 
                  }}
                  onClick={() => toggleComponentExpand(compIndex)}
                >
                  {/* Component Name Select */}
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel> Name</InputLabel>
                      <Select
                        value={component.name}
                        onChange={(e) =>
                          handleComponentChange(compIndex, 'name', e.target.value)
                        }
                        label=" Name"
                        sx={{
                          borderRadius: '8px'
                        }}
                      >
                        <MenuItem value="Tuition Fee">Tuition Fee</MenuItem>
                        <MenuItem value="Hostel Fee">Hostel Fee</MenuItem>
                        <MenuItem value="Transport Fee">Transport Fee</MenuItem>
                        <MenuItem value="Library Fee">Library Fee</MenuItem>
                        <MenuItem value="Examination Fee">Examination Fee</MenuItem>
                        <MenuItem value="Activity Fee">Activity Fee</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>


                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth size="small">
                      <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={component.earlyPaymentDiscount.amount}
                        onChange={(e) =>
                          handleEarlyPaymentChange(compIndex, 'amount', e.target.value)
                        }
                        size="small"
                      />
                    </FormControl>
                  </Box>

                  {/* Optional, Refundable, Remove and Expand Icons */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={component.isOptional}
                          onChange={(e) =>
                            handleComponentChange(compIndex, 'isOptional', e.target.checked)
                          }
                        />
                      }
                      label="Optional"
                      sx={{ mr: 0 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={component.isRefundable}
                          onChange={(e) =>
                            handleComponentChange(compIndex, 'isRefundable', e.target.checked)
                          }
                        />
                      }
                      label="Refundable"
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        removeComponent(compIndex);
                      }}
                    >
                      <RemoveIcon color="error" />
                    </IconButton>

                  </Box>
                </Box>

              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addComponent}
              sx={{ mt: 2 }}
            >
              Add Component
            </Button>

            <Divider sx={{ my: 4, borderColor: '#e5e7eb' }} />

            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              pt: 2
            }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={() => setFormData({
                  className: "",
                  academicYear: "",
                  components: [{
                    name: "Tuition Fee",
                    isOptional: false,
                    isRefundable: true,
                    earlyPaymentDiscount: {
                      active: false,
                      amount: 0,
                      percentage: 0,
                      applicableTill: ""
                    },
                    siblingDiscount: {
                      active: false,
                      percentage: 0,
                      maxDiscount: 0
                    },
                    installments: [{
                      name: "First Installment",
                      dueDate: "",
                      percentage: 100,
                      lateFee: {
                        active: false,
                        amount: 0,
                        percentage: 0,
                        applicableAfter: 0
                      }
                    }]
                  }]
                })}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3,
                  py: 1
                }}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                Save Fee Structure
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;