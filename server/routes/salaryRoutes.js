import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import {
  createSalaryStructure,
  updateSalaryStructure,
  getSalaryStructures,
  getSalaryStructureById,
  calculateSalary,
  processSalaryPayment,
  markSalaryAsPaid,
  downloadPayslip,
  emailPayslip,
  getSalaryPayments,
  getSalaryPaymentById,
  exportSalaryPayments,
  getSalarySummary,
  approveSalaryPayment
} from "../controller/salaryController.js";

// Salary Structure Routes
router.post("/structures", auth, createSalaryStructure);

router.put("/structures/:id", updateSalaryStructure);

router.get("/structures", getSalaryStructures);

router.get("/structures/:id", getSalaryStructureById);

// Salary Calculation and Payment
router.post("/calculate", calculateSalary);

router.post("/payments", processSalaryPayment);

router.put("/payments/:id/approve", approveSalaryPayment);

router.put("/payments/:id/mark-paid", markSalaryAsPaid);

// Reports and Payslips
router.get("/payments", getSalaryPayments);

router.get("/payments/:id", getSalaryPaymentById);

router.get("/payments/:id/payslip", downloadPayslip);

router.post("/payments/:id/email-payslip", emailPayslip);

router.get("/summary", getSalarySummary);

router.get("/export", exportSalaryPayments);

export default router;
