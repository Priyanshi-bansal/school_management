const FeeStructure = require('../models/feeStructure');
const FeePayment = require('../models/feePayment');
const { generateFeeReceipt } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

// Create a fee structure
exports.createFeeStructure = async (req, res) => {
  try {
    const {
      class: className,
      academicYear,
      effectiveFrom,
      effectiveTill,
      components,
      createdBy
    } = req.body;

    const newStructure = new FeeStructure({
      class: className,
      academicYear,
      effectiveFrom,
      effectiveTill,
      components: components.map(c => ({ name: c.name, amount: c.amount })),
      createdBy
    });

    await newStructure.save();
    res.status(201).json(newStructure);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all fee structures
exports.getAllFeeStructures = async (req, res) => {
  try {
    const structures = await FeeStructure.find().populate('createdBy', 'name email');
    res.json(structures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record a fee payment
exports.createFeePayment = async (req, res) => {
  try {
    const {
      studentId,
      amountPaid,
      paymentDate,
      mode,
      status,
      transactionId,
      remarks,
      createdBy
    } = req.body;

    const newPayment = new FeePayment({
      studentId,
      amountPaid,
      paymentDate: paymentDate || new Date(),
      mode,
      status: status || 'paid',
      transactionId,
      remarks,
      createdBy
    });

    // Generate PDF receipt
    const receiptPath = path.join(__dirname, `../receipts/fee_${Date.now()}.pdf`);
    generateFeeReceipt(newPayment, receiptPath);
    newPayment.receiptUrl = receiptPath;

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get fee payments by student ID
exports.getPaymentsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const payments = await FeePayment.find({ studentId }).populate('createdBy', 'name');
    res.json(payments);
  } catch (err) {
    res.status(404).json({ error: 'No payments found' });
  }
};

// Fee summary per student
exports.getFeeSummary = async (req, res) => {
  try {
    const summary = await FeePayment.aggregate([
      {
        $group: {
          _id: '$studentId',
          totalPaid: { $sum: '$amountPaid' },
          latestPayment: { $max: '$paymentDate' }
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download fee receipt
exports.downloadFeeReceipt = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.paymentId);
    if (!payment || !payment.receiptUrl) {
      return res.status(404).json({ message: 'Receipt not available' });
    }

    res.download(payment.receiptUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Preview fee receipt in browser
exports.previewFeeReceipt = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.paymentId);
    if (!payment || !payment.receiptUrl) {
      return res.status(404).json({ message: 'Receipt not available' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.resolve(payment.receiptUrl));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete a fee payment
exports.deleteFeePayment = async (req, res) => {
  try {
    const deleted = await FeePayment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Payment not found' });

    // Optionally remove receipt file
    if (deleted.receiptUrl && fs.existsSync(deleted.receiptUrl)) {
      fs.unlinkSync(deleted.receiptUrl);
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a fee payment
exports.updateFeePayment = async (req, res) => {
  try {
    const { amountPaid, paymentDate, mode, status, transactionId, remarks } = req.body;
    const updatedPayment = await FeePayment.findByIdAndUpdate(
      req.params.id,
      {
        amountPaid,
        paymentDate,
        mode,
        status,
        transactionId,
        remarks
      },
      { new: true }
    );

    if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });

    res.json(updatedPayment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get fee structure by class and academic year
exports.getFeeStructureByClass = async (req, res) => {
  try {
    const { className, academicYear } = req.params;
    const structure = await FeeStructure.findOne({ class: className, academicYear })
      .populate('createdBy', 'name email');

    if (!structure) return res.status(404).json({ message: 'Fee structure not found' });

    res.json(structure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};