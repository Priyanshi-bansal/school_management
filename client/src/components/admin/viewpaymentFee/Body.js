import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Card,
  CardContent,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  MonetizationOn as MonetizationOnIcon,
  CalendarToday as CalendarTodayIcon,


  Paid as PaidIcon,
  Check as CheckIcon,

  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  SummaryRow as SummaryRowIcon,
  Close as CloseIcon,


  CurrencyExchange as CurrencyExchangeIcon,

  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  EventRepeat as EventRepeatIcon,
  CurrencyRupee as CurrencyRupeeIcon,

  PriceChange as PriceChangeIcon,

  Clear as ClearIcon

} from '@mui/icons-material';
import { format } from 'date-fns';

// Dummy data for the fee structure
const dummyFeeStructure = {
  academicYear: '2023-2024',
  class: 'X',
  status: 'active',
  createdAt: '2023-01-15T10:30:00Z',
  createdBy: {
    name: 'Admin User'
  },
  updatedAt: '2023-06-20T14:45:00Z',
  updatedBy: {
    name: 'Admin User'
  },
  components: [
    { name: 'Tuition', amount: 50000, isOptional: false, refundable: false },
    { name: 'Library', amount: 2000, isOptional: false, refundable: true },
    { name: 'Sports', amount: 3000, isOptional: true, refundable: false },
    { name: 'Transportation', amount: 8000, isOptional: true, refundable: true },
    { name: 'Examination', amount: 1500, isOptional: false, refundable: false },
    { name: 'Activity', amount: 2500, isOptional: true, refundable: false }
  ],
  installments: [
    {
      name: 'First Installment',
      dueDate: '2023-04-15T00:00:00Z',
      percentage: 40,
      lateFee: {
        amount: 500,
        applicableAfter: 15
      }
    },
    {
      name: 'Second Installment',
      dueDate: '2023-08-15T00:00:00Z',
      percentage: 30,
      lateFee: {
        percentage: 5,
        applicableAfter: 10
      }
    },
    {
      name: 'Third Installment',
      dueDate: '2023-11-15T00:00:00Z',
      percentage: 30,
      lateFee: {
        amount: 1000,
        applicableAfter: 20
      }
    }
  ],
  earlyPaymentDiscount: {
    percentage: 5,
    applicableTill: '2023-03-31T00:00:00Z'
  },
  siblingDiscount: {
    percentage: 10,
    maxDiscount: 5000
  }
};

const Body = () => {

  const SummaryRow = ({ label, value, bold = false, color = 'text.primary' }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography>{label}:</Typography>
      <Typography fontWeight={bold ? 'bold' : 'normal'} color={color}>
        {value}
      </Typography>
    </Box>
  );

  const getStatusChip = () => {
    switch (dummyFeeStructure.status) {
      case 'active':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Active"
            color="success"
            variant="outlined"
            size="small"
          />
        );
      case 'inactive':
        return (
          <Chip
            icon={<CancelIcon />}
            label="Inactive"
            color="error"
            variant="outlined"
            size="small"
          />
        );
      default:
        return (
          <Chip
            icon={<HelpIcon />}
            label="Draft"
            color="warning"
            variant="outlined"
            size="small"
          />
        );
    }
  };

  // Calculate total fee
  const totalFee = dummyFeeStructure.components.reduce((sum, component) => sum + component.amount, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: 'primary.main', width: 46, height: 46 }}>
              <MonetizationOnIcon fontSize="large" />

            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" >
              Fee Payment for student
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Academic Year: <strong>{dummyFeeStructure.academicYear}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2}>
          {/* Fee Summary */}
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ transition: '0.3s' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PaidIcon color="primary" sx={{
                    mr: 2,
                    fontSize: '2.5rem',
                    backgroundColor: '#eef2ff',
                    p: 1,
                    borderRadius: '50%'
                  }} />
                  Fee Summary
                </Typography>
                <Divider sx={{ my: 2 }} />

                <SummaryRow label="Total Annual Fee" value={`₹${totalFee.toLocaleString()}`} bold />
                <Divider sx={{ my: 1.5 }} />

                {dummyFeeStructure.earlyPaymentDiscount && (
                  <SummaryRow
                    label="Early Payment Discount"
                    value={`${dummyFeeStructure.earlyPaymentDiscount.percentage}% (₹${(totalFee * dummyFeeStructure.earlyPaymentDiscount.percentage / 100).toLocaleString()})`}
                    color="success.main"
                  />
                )}
                <Divider sx={{ my: 1.5 }} />

                {dummyFeeStructure.siblingDiscount && (
                  <SummaryRow
                    label="Sibling Discount"
                    value={`${dummyFeeStructure.siblingDiscount.percentage}% (Max ₹${dummyFeeStructure.siblingDiscount.maxDiscount.toLocaleString()})`}
                    color="success.main"
                  />
                )}

                <Divider sx={{ my: 1.5 }} />

                <SummaryRow
                  label="Created"
                  value={`${format(new Date(dummyFeeStructure.createdAt), 'dd MMM yyyy')} by ${dummyFeeStructure.createdBy?.name || 'Admin'}`}
                />
                <Divider sx={{ my: 1.5 }} />

                {dummyFeeStructure.updatedAt && (
                  <SummaryRow
                    label="Last Updated"
                    value={`${format(new Date(dummyFeeStructure.updatedAt), 'dd MMM yyyy')} by ${dummyFeeStructure.updatedBy?.name || 'Admin'}`}
                  />
                )}

              </CardContent>
            </Card>
          </Grid>

          {/* Fee Components */}
          <Grid item xs={12} md={8}>
            <Card elevation={4} sx={{ transition: '0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <CurrencyRupeeIcon color="primary" sx={{
                    mr: 2,
                    fontSize: '2.5rem',
                    backgroundColor: '#eef2ff',
                    p: 1,
                    borderRadius: '50%'
                  }} />
                  Fee Components
                </Typography>
                <Divider sx={{ my: 2 }} />

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell align="right">Amount (₹)</TableCell>
                        <TableCell align="center">Optional</TableCell>
                        <TableCell align="center">Refundable</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dummyFeeStructure.components.map((component, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{component.name}</TableCell>
                          <TableCell align="right">{component.amount.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={component.isOptional ? 'Yes' : 'No'}
                              color={component.isOptional ? 'info' : 'default'}
                              icon={component.isOptional ? <CheckIcon /> : <CloseIcon />}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={component.refundable ? 'Yes' : 'No'}
                              color={component.refundable ? 'success' : 'default'}
                              icon={component.refundable ? <CheckIcon /> : <CloseIcon />}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Installment Plan */}
          <Grid item xs={12}>
            <Card elevation={4} sx={{ transition: '0.3s' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <EventRepeatIcon color="primary" sx={{
                    mr: 2,
                    fontSize: '2.5rem',
                    backgroundColor: '#eef2ff',
                    p: 1,
                    borderRadius: '50%'
                  }} />
                  Installment Plan
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  {dummyFeeStructure.installments.map((installment, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper elevation={3} sx={{
                        p: 2,
                        transition: '0.2s'

                      }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <Typography variant="body2">{index + 1}</Typography>
                          </Avatar>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {installment.name}
                          </Typography>
                        </Stack>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarTodayIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            Due: {format(new Date(installment.dueDate), 'dd MMM yyyy')}
                          </Typography>
                        </Box>

                        <Typography variant="body2" gutterBottom>
                          Amount: ₹{(totalFee * installment.percentage / 100).toLocaleString()} ({installment.percentage}%)
                        </Typography>

                        {installment.lateFee && (
                          <Box sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            p: 1,
                            borderRadius: 1,
                            mt: 1
                          }}>
                            <Typography variant="caption" fontWeight="bold">
                              Late Fee:
                              {installment.lateFee.amount
                                ? ` ₹${installment.lateFee.amount}`
                                : ` ${installment.lateFee.percentage}%`}
                            </Typography>
                            <Typography variant="caption">
                              Applicable after {installment.lateFee.applicableAfter} days
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>

  );
};

export default Body;