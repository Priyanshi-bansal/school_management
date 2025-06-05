import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import {
  createFeeStructure,
  updateFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  createFeePayment,
  addPaymentToRecord,
  applyDiscount,
  applyPenalty,
  initiateRefund,
  getFeePayments,
  getFeePaymentById,
  downloadReceipt,
  emailReceipt,
  getFeeDefaulters,
  getFeeSummary,
} from "../controller/feeController.js";

// Fee Structure Routes
router.post("/structures", auth, createFeeStructure);

router.put("/structures/:id", auth, updateFeeStructure);

router.get("/structures", auth, getFeeStructures);

router.get("/structures/:id", auth, getFeeStructureById);

// Fee Payment Routes
router.post("/payments", auth, createFeePayment);

router.post("/payments/:id/add-payment", auth, addPaymentToRecord);

router.post("/payments/:id/discounts", auth, applyDiscount);

router.post("/payments/:id/penalties", auth, applyPenalty);

router.post("/payments/:id/refunds", auth, initiateRefund);

// Reports and Receipts
router.get("/payments", auth, getFeePayments);

router.get("/payments/:id", auth, getFeePaymentById);

router.get("/payments/:id/receipt", auth, downloadReceipt);

router.post("/payments/:id/email-receipt", auth, emailReceipt);

router.get("/defaulters", auth, getFeeDefaulters);

router.get("/summary", auth, getFeeSummary);


export default router;
