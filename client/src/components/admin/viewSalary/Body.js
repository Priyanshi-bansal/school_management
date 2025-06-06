import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paid as PaidIcon,
  Add,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  const [salaryStructure] = useState({
    name: "Assistant Professor Salary Structure 2023",
    applicableFrom: "2023-04-01",
    status: "active",
    components: [
      {
        name: "Basic Salary",
        type: "earning",
        calculationType: "fixed",
        amount: 45000,
      },
      {
        name: "HRA",
        type: "earning",
        calculationType: "percentage",
        percentage: 40,
        basedOn: "basic",
      },
      {
        name: "DA",
        type: "earning",
        calculationType: "percentage",
        percentage: 15,
        basedOn: "basic",
      },
      {
        name: "Medical Allowance",
        type: "earning",
        calculationType: "fixed",
        amount: 3000,
      },
      {
        name: "PF",
        type: "deduction",
        calculationType: "percentage",
        percentage: 12,
        basedOn: "basic",
      },
      {
        name: "Professional Tax",
        type: "deduction",
        calculationType: "fixed",
        amount: 200,
      },
    ],
  });

  const [faculty, setFaculty] = useState([
    {
      _id: "1",
      name: "Professor. John Doe",
      basicSalary: 80000,
      allowances: 20000,
      deductions: 5000,
      netSalary: 95000,
      status: "Approved",
      paymentDate: "2023-06-15",
    },
    {
      _id: "2",
      name: "Associate Professor. Jane Smith",
      basicSalary: 60000,
      allowances: 15000,
      deductions: 4000,
      netSalary: 71000,
      status: "Pending",
      paymentDate: "",
    },
    {
      _id: "3",
      name: "Assistant Professor. Robert Johnson",
      basicSalary: 50000,
      allowances: 10000,
      deductions: 3000,
      netSalary: 57000,
      status: "Rejected",
      paymentDate: "",
    },
  ]);

  const [expandedStructure, setExpandedStructure] = useState(true);

  const calculateComponentAmount = (component) => {
    const basicSalary =
      salaryStructure.components.find((c) => c.name === "Basic Salary")?.amount || 0;
    return component.calculationType === "percentage"
      ? (component.percentage / 100) * basicSalary
      : component.amount;
  };

  const totalEarnings = salaryStructure.components
    .filter((c) => c.type === "earning")
    .reduce((sum, c) => sum + calculateComponentAmount(c), 0);

  const totalDeductions = salaryStructure.components
    .filter((c) => c.type === "deduction")
    .reduce((sum, c) => sum + calculateComponentAmount(c), 0);

  const netSalary = totalEarnings - totalDeductions;

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PaidIcon color="primary" sx={{ mr: 1, height: 42, width: 42 }} />
        <Typography variant="h5">Salary Management</Typography>
        
       
      </Box>

      {/* Salary Structure Accordion */}
    
         
          <Typography variant="body2">Status: {salaryStructure.status}</Typography>
          <TableContainer component={Paper} sx={{ my: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Calculation</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryStructure.components.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.type}</TableCell>
                    <TableCell>
                      {c.calculationType === "percentage"
                        ? `${c.percentage}% of ${c.basedOn}`
                        : "Fixed"}
                    </TableCell>
                    <TableCell align="right">
                      ₹{calculateComponentAmount(c).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
    
  

      {/* Salary Summary (Moved Outside Accordion) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: "#e8f5e9" }}>
            <Typography variant="subtitle1">Total Earnings</Typography>
            <Typography variant="h6">₹{totalEarnings.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: "#ffebee" }}>
            <Typography variant="subtitle1">Total Deductions</Typography>
            <Typography variant="h6">₹{totalDeductions.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: "#e3f2fd" }}>
            <Typography variant="subtitle1">Net Salary</Typography>
            <Typography variant="h6" fontWeight="bold">
              ₹{netSalary.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Body;
