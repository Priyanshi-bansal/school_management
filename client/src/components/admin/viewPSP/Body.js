import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as BankIcon,
  Person as PersonIcon,
  Description as DocumentIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const Body = () => {
  // Dummy data that matches your schema
  const payment = {
    _id: "1",
    faculty: {
      _id: "101",
      name: "Dr. John Smith",
      designation: "Professor",
      department: "Computer Science",
      employeeId: "CS-2020-001"
    },
    salaryStructure: {
      _id: "s1",
      name: "Professor Salary Structure 2023"
    },
    month: 6,
    year: 2023,
    paymentDate: "2023-06-30T00:00:00.000Z",
    paymentMode: "bank",
    bankDetails: {
      accountNumber: "1234567890",
      bankName: "State Bank of India",
      branch: "Main Branch",
      IFSC: "SBIN0001234"
    },
    components: [
      { name: "Basic Salary", type: "earning", amount: 75000, calculationType: "fixed" },
      { name: "HRA", type: "earning", amount: 37500, calculationType: "percentage", percentage: 50, basedOn: "basic" },
      { name: "DA", type: "earning", amount: 15000, calculationType: "percentage", percentage: 20, basedOn: "basic" },
      { name: "Special Allowance", type: "earning", amount: 10000, calculationType: "fixed" },
      { name: "PF", type: "deduction", amount: 9000, calculationType: "percentage", percentage: 12, basedOn: "basic" },
      { name: "Professional Tax", type: "deduction", amount: 200, calculationType: "fixed" },
      { name: "TDS", type: "deduction", amount: 5000, calculationType: "variable" }
    ],
    workingDays: 22,
    presentDays: 20,
    leaveDays: 2,
    lopDays: 0,
    earnings: 137500,
    deductions: 14200,
    netSalary: 123300,
    taxDetails: {
      tds: 5000,
      professionalTax: 200,
      otherTax: 0
    },
    status: "paid",
    payslipGenerated: true,
    payslipUrl: "/payslips/1.pdf",
    remarks: "June 2023 salary processed",
    processedBy: {
      _id: "admin1",
      name: "Admin User"
    },
    approvedBy: {
      _id: "admin2",
      name: "Approver User"
    },
    createdAt: "2023-06-25T10:30:00.000Z",
    updatedAt: "2023-06-28T15:45:00.000Z"
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'paid': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Salary Payment Details</Typography>
        <Box>
          {payment.payslipGenerated && (
            <>
              <Button variant="outlined" startIcon={<PrintIcon />} sx={{ mr: 2 }}>
                Print Payslip
              </Button>
              <Button variant="contained" startIcon={<DownloadIcon />}>
                Download Payslip
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} /> Employee Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2, width: 56, height: 56 }} />
              <Box>
                <Typography variant="subtitle1">{payment.faculty.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {payment.faculty.designation} • {payment.faculty.department}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employee ID: {payment.faculty.employeeId}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DocumentIcon sx={{ mr: 1 }} /> Payment Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment Period</Typography>
                <Typography>{monthNames[payment.month - 1]} {payment.year}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment Date</Typography>
                <Typography>{new Date(payment.paymentDate).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment Mode</Typography>
                <Typography>{payment.paymentMode}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ mr: 1 }} /> Salary Breakdown
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Component</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payment.components.map((component, index) => (
                    <TableRow key={index}>
                      <TableCell>{component.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={component.type}
                          color={component.type === 'earning' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{component.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total Earnings</Typography>
                <Typography variant="h6" color="success.main">
                  ₹{payment.earnings.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total Deductions</Typography>
                <Typography variant="h6" color="error.main">
                  ₹{payment.deductions.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Net Salary</Typography>
                <Typography variant="h4">
                  ₹{payment.netSalary.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} /> Attendance Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Working Days</Typography>
                <Typography>{payment.workingDays}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Present Days</Typography>
                <Typography>{payment.presentDays}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Leave Days</Typography>
                <Typography>{payment.leaveDays}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">LOP Days</Typography>
                <Typography>{payment.lopDays}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <BankIcon sx={{ mr: 1 }} /> Payment Details
            </Typography>
            {payment.paymentMode === 'bank' && (
              <>
                <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                <Typography>{payment.bankDetails.bankName}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Account Number</Typography>
                <Typography>{payment.bankDetails.accountNumber}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>IFSC Code</Typography>
                <Typography>{payment.bankDetails.IFSC}</Typography>
              </>
            )}
            {payment.paymentMode === 'cheque' && (
              <>
                <Typography variant="body2" color="text.secondary">Cheque Number</Typography>
                <Typography>{payment.chequeDetails?.number}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Cheque Date</Typography>
                <Typography>{payment.chequeDetails?.date && new Date(payment.chequeDetails.date).toLocaleDateString()}</Typography>
              </>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Tax Details</Typography>
            <Typography variant="body2" color="text.secondary">TDS</Typography>
            <Typography>₹{payment.taxDetails.tds || 0}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Professional Tax</Typography>
            <Typography>₹{payment.taxDetails.professionalTax || 0}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Other Taxes</Typography>
            <Typography>₹{payment.taxDetails.otherTax || 0}</Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Processing Information</Typography>
            <Typography variant="body2" color="text.secondary">Processed By</Typography>
            <Typography>{payment.processedBy.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Approved By</Typography>
            <Typography>{payment.approvedBy?.name || 'Not approved yet'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Created At</Typography>
            <Typography>{new Date(payment.createdAt).toLocaleString()}</Typography>
            {payment.updatedAt && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Last Updated</Typography>
                <Typography>{new Date(payment.updatedAt).toLocaleString()}</Typography>
              </>
            )}
            {payment.remarks && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Remarks</Typography>
                <Typography>{payment.remarks}</Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Body;