import FeeStructure from '../models/feeStructure.js';
import FeePayment from '../models/feePayment.js';
import Student from '../models/student.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import {generateReceiptNumber} from '../services/receiptGenerator.js';
import {sendEmailWithAttachment} from '../services/emailService.js';


  const createFeeStructure = async (req, res) => {
    try {
      console.log("Creating Fee Structure", req.body);
      console.log("req.user is:", req.userId);
      const feeStructure = new FeeStructure({
        ...req.body,
        createdBy: req.userId
      });
      await feeStructure.save();
      res.status(201).json(feeStructure);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const updateFeeStructure = async (req, res) => {
    try {
      const feeStructure = await FeeStructure.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          updatedBy: req.userId
        },
        { new: true }
      );
      if (!feeStructure) {
        return res.status(404).json({ error: 'Fee structure not found' });
      }
      res.json(feeStructure);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

   const getFeeStructures = async (req, res) => {
    try {
      const { academicYear, class: className, status } = req.query;
      const filter = {};
      
      if (academicYear) filter.academicYear = academicYear;
      if (className) filter.class = className;
      if (status) filter.status = status;

      const feeStructures = await FeeStructure.find(filter)
        .populate('createdBy')
        .populate('updatedBy')
        .sort('-createdAt');
      
      res.json(feeStructures);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getFeeStructureById = async (req, res) => {
    try {
      const feeStructure = await FeeStructure.findById(req.params.id)
        .populate('createdBy')
        .populate('updatedBy');
      
      if (!feeStructure) {
        return res.status(404).json({ error: 'Fee structure not found' });
      }
      
      res.json(feeStructure);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Fee Payment Management
  const createFeePayment = async (req, res) => {
    try {
      const { studentId, feeStructureId, installment, paymentDetails, discounts } = req.body;
      
      // Validate student
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      // Validate fee structure
      const feeStructure = await FeeStructure.findById(feeStructureId);
      if (!feeStructure || feeStructure.status !== 'active') {
        return res.status(400).json({ error: 'Invalid or inactive fee structure' });
      }
      
      // Calculate total amount with discounts
      let totalAmount = feeStructure.totalFee;
      
      if (installment) {
        const inst = feeStructure.installments.find(i => i.name === installment.name);
        if (!inst) {
          return res.status(400).json({ error: 'Invalid installment' });
        }
        totalAmount = feeStructure.totalFee * (inst.percentage / 100);
      }
      
      // Apply discounts
      let totalDiscount = 0;
      const appliedDiscounts = [];
      
      if (discounts && discounts.length > 0) {
        for (const discount of discounts) {
          // Validate discount (you might have business rules here)
          if (discount.type === 'sibling' && !student.siblings.length) {
            continue;
          }
          
          appliedDiscounts.push({
            ...discount,
            approvedBy: req.userId
          });
          
          totalDiscount += discount.amount;
        }
      }
      
      totalAmount -= totalDiscount;
      
      // Create payment record
      const payment = new FeePayment({
        student: studentId,
        feeStructure: feeStructureId,
        academicYear: feeStructure.academicYear,
        installment,
        paymentDetails: paymentDetails.map(pd => ({
          ...pd,
          collectedBy: req.userId
        })),
        discounts: appliedDiscounts,
        totalAmount,
        paidAmount: paymentDetails.reduce((sum, pd) => sum + pd.amount, 0),
        status: paymentDetails.reduce((sum, pd) => sum + pd.amount, 0) >= totalAmount ? 'paid' : 'partial',
        createdBy: req.userId
      });
      
      await payment.save();
      
      // Generate receipt
      const receiptUrl = await this.generateReceipt(payment._id);
      payment.receiptUrl = receiptUrl;
      await payment.save();
      
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const addPaymentToRecord = async (req, res) => {
    try {
      const payment = await FeePayment.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
      
      if (payment.status === 'paid') {
        return res.status(400).json({ error: 'Payment already completed' });
      }
      
      const newPayment = {
        ...req.body,
        collectedBy: req.userId
      };
      
      payment.paymentDetails.push(newPayment);
      payment.paidAmount += newPayment.amount;
      
      if (payment.paidAmount >= payment.totalAmount) {
        payment.status = 'paid';
      } else {
        payment.status = 'partial';
      }
      
      payment.updatedBy = req.userId
      await payment.save();
      
      // Update receipt if payment is now complete
      if (payment.status === 'paid') {
        const receiptUrl = await this.generateReceipt(payment._id);
        payment.receiptUrl = receiptUrl;
        await payment.save();
      }
      
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const applyDiscount = async (req, res) => {
    try {
      const payment = await FeePayment.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
      
      if (payment.status === 'paid') {
        return res.status(400).json({ error: 'Cannot apply discount to completed payment' });
      }
      
      const discount = {
        ...req.body,
        approvedBy: req.userId
      };
      
      payment.discounts.push(discount);
      payment.totalAmount -= discount.amount;
      
      // Recalculate status
      if (payment.paidAmount >= payment.totalAmount) {
        payment.status = 'paid';
      } else if (payment.paidAmount > 0) {
        payment.status = 'partial';
      }
      
      payment.updatedBy = req.userId
      await payment.save();
      
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const applyPenalty = async (req, res) => {
    try {
      const payment = await FeePayment.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
      
      const penalty = {
        ...req.body,
        appliedBy: req.userId
      };
      
      payment.penalties.push(penalty);
      payment.totalAmount += penalty.amount;
      
      // Recalculate status
      if (payment.paidAmount >= payment.totalAmount) {
        payment.status = 'paid';
      } else if (payment.paidAmount > 0) {
        payment.status = 'partial';
      } else {
        payment.status = 'pending';
      }
      
      payment.updatedBy = req.userId
      await payment.save();
      
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const initiateRefund = async (req, res) => {
    try {
      const payment = await FeePayment.findById(req.params.id)
        .populate('student', 'name email parentEmail');
      
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
      
      if (payment.paidAmount <= 0) {
        return res.status(400).json({ error: 'No payment to refund' });
      }
      
      const refundableComponents = payment.feeStructure.components
        .filter(c => c.refundable)
        .reduce((sum, c) => sum + c.amount, 0);
      
      const maxRefundable = refundableComponents * (payment.paidAmount / payment.totalAmount);
      
      if (req.body.amount > maxRefundable) {
        return res.status(400).json({ 
          error: `Refund amount exceeds maximum refundable amount of ${maxRefundable}`
        });
      }
      
      const refund = {
        ...req.body,
        processedBy: req.userId,
        status: 'pending'
      };
      
      payment.refunds.push(refund);
      payment.status = 'refunded';
      await payment.save();
      
      // Notify finance team (in real app, you'd use a queue or email service)
      // await sendRefundRequestNotification(payment, refund);
      
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Reports and Receipts
 const generateReceipt =  async (paymentId) => {
    const payment = await FeePayment.findById(paymentId)
      .populate('student', 'name rollNumber class')
      .populate('feeStructure', 'academicYear')
      .populate('createdBy', 'name')
      .populate('paymentDetails.collectedBy', 'name');
    
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `receipt_${payment._id}.pdf`;
    const filePath = path.join(__dirname, '../public/receipts', fileName);
    
    // Ensure receipts directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    
    doc.pipe(fs.createWriteStream(filePath));
    
    // Add school header
    doc.image(path.join(__dirname, '../public/images/school-logo.png'), 50, 45, { width: 50 });
    doc.fontSize(20).text('SCHOOL NAME', 110, 50);
    doc.fontSize(10).text('School Address Line 1', 110, 75);
    doc.fontSize(10).text('City, State, PIN', 110, 90);
    doc.moveDown(2);
    
    // Receipt title
    doc.fontSize(16).text('FEE PAYMENT RECEIPT', { align: 'center' });
    doc.moveDown();
    
    // Receipt details
    doc.fontSize(12).text(`Receipt No: ${payment.receiptNumber}`, { continued: true });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.text(`Academic Year: ${payment.feeStructure.academicYear}`);
    doc.moveDown();
    
    // Student details
    doc.font('Helvetica-Bold').text('Student Details:', { underline: true });
    doc.font('Helvetica');
    doc.text(`Name: ${payment.student.name}`);
    doc.text(`Class: ${payment.student.class}`);
    doc.text(`Roll No: ${payment.student.rollNumber}`);
    doc.moveDown();
    
    // Payment details
    doc.font('Helvetica-Bold').text('Payment Details:', { underline: true });
    doc.font('Helvetica');
    
    if (payment.installment) {
      doc.text(`Installment: ${payment.installment.name} (Due: ${new Date(payment.installment.dueDate).toLocaleDateString()})`);
    }
    
    doc.text(`Total Amount: ₹${payment.totalAmount.toFixed(2)}`);
    
    if (payment.discounts.length > 0) {
      doc.text('Discounts:');
      payment.discounts.forEach(d => {
        doc.text(`- ${d.type}: ₹${d.amount.toFixed(2)} (${d.reason || 'No reason provided'})`, { indent: 20 });
      });
    }
    
    if (payment.penalties.length > 0) {
      doc.text('Penalties:');
      payment.penalties.forEach(p => {
        doc.text(`- ${p.type}: ₹${p.amount.toFixed(2)} (${p.reason || 'No reason provided'})`, { indent: 20 });
      });
    }
    
    doc.text(`Paid Amount: ₹${payment.paidAmount.toFixed(2)}`);
    doc.moveDown();
    
    // Payment breakdown
    doc.font('Helvetica-Bold').text('Payment Breakdown:', { underline: true });
    doc.font('Helvetica');
    payment.paymentDetails.forEach((pd, i) => {
      doc.text(`${i + 1}. ₹${pd.amount.toFixed(2)} on ${new Date(pd.date).toLocaleDateString()} via ${pd.mode}`);
      doc.text(`   Collected by: ${pd.collectedBy.name}`, { indent: 20 });
      if (pd.transactionId) {
        doc.text(`   Transaction ID: ${pd.transactionId}`, { indent: 20 });
      }
    });
    doc.moveDown();
    
    // Footer
    doc.fontSize(10).text('This is a computer generated receipt. No signature required.', { align: 'center' });
    doc.text('Thank you!', { align: 'center' });
    
    doc.end();
    
    return `/receipts/${fileName}`;
  }

 const downloadReceipt =  async (req, res) => {
    try {
      const payment = await FeePayment.findById(req.params.id);
      if (!payment || !payment.receiptUrl) {
        return res.status(404).json({ error: 'Receipt not found' });
      }
      
      const filePath = path.join(__dirname, '../public', payment.receiptUrl);
      if (!fs.existsSync(filePath)) {
        // Regenerate receipt if file is missing
        await this.generateReceipt(payment._id);
      }
      
      res.download(filePath, `fee_receipt_${payment.receiptNumber}.pdf`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

 const emailReceipt =  async (req, res) => {
    try {
      const payment = await FeePayment.findById(req.params.id)
        .populate('student', 'email parentEmail');
      
      if (!payment || !payment.receiptUrl) {
        return res.status(404).json({ error: 'Receipt not found' });
      }
      
      const filePath = path.join(__dirname, '../public', payment.receiptUrl);
      if (!fs.existsSync(filePath)) {
        await this.generateReceipt(payment._id);
      }
      
      const emailAddresses = [];
      if (payment.student.email) emailAddresses.push(payment.student.email);
      if (payment.student.parentEmail) emailAddresses.push(payment.student.parentEmail);
      
      if (emailAddresses.length === 0) {
        return res.status(400).json({ error: 'No email addresses found for student' });
      }
      
      await sendEmailWithAttachment({
        to: emailAddresses,
        subject: `Fee Payment Receipt - ${payment.receiptNumber}`,
        text: `Dear Student/Parent,\n\nPlease find attached the fee payment receipt for your recent payment.\n\nThank you,\nSchool Administration`,
        attachments: [{
          filename: `fee_receipt_${payment.receiptNumber}.pdf`,
          path: filePath
        }]
      });
      
      res.json({ message: 'Receipt emailed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getFeePayments = async (req, res) => {
    try {
      const { studentId, academicYear, status, fromDate, toDate, class: className } = req.query;
      const filter = {};
      
      if (studentId) filter.student = studentId;
      if (academicYear) filter.academicYear = academicYear;
      if (status) filter.status = status;
      if (fromDate && toDate) {
        filter.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        };
      }
      
      if (className) {
        const students = await Student.find({ class: className }).select('_id');
        filter.student = { $in: students.map(s => s._id) };
      }
      
      const payments = await FeePayment.find(filter)
        .populate('student', 'name rollNumber class')
        .populate('feeStructure', 'academicYear')
        .populate('createdBy', 'name')
        .sort('-createdAt');
      
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getFeePaymentById = async (req, res) => {
    try {
      const payment = await FeePayment.findById(req.params.id)
        .populate('student', 'name rollNumber class')
        .populate('feeStructure', 'academicYear components')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name')
        .populate('paymentDetails.collectedBy', 'name')
        .populate('discounts.approvedBy', 'name')
        .populate('penalties.appliedBy', 'name')
        .populate('refunds.processedBy', 'name');
      
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

 const getFeeDefaulters =  async (req, res) => {
    try {
      const { academicYear, class: className, installment, dueDate } = req.query;
      const filter = {
        status: { $in: ['pending', 'partial', 'overdue'] }
      };
      
      if (academicYear) filter.academicYear = academicYear;
      if (className) {
        const students = await Student.find({ class: className }).select('_id');
        filter.student = { $in: students.map(s => s._id) };
      }
      if (installment) filter['installment.name'] = installment;
      if (dueDate) filter['installment.dueDate'] = { $lte: new Date(dueDate) };
      
      const defaulters = await FeePayment.find(filter)
        .populate('student', 'name rollNumber class parentContact')
        .populate('feeStructure', 'academicYear')
        .sort('installment.dueDate');
      
      res.json(defaulters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

 const FeePayments =  async (req, res) => {
    try {
      const { fromDate, toDate, academicYear, class: className } = req.query;
      const filter = {};
      
      if (fromDate && toDate) {
        filter.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        };
      }
      if (academicYear) filter.academicYear = academicYear;
      if (className) {
        const students = await Student.find({ class: className }).select('_id');
        filter.student = { $in: students.map(s => s._id) };
      }
      
      const payments = await FeePayment.find(filter)
        .populate('student', 'name rollNumber class')
        .populate('feeStructure', 'academicYear')
        .populate('createdBy', 'name')
        .sort('-createdAt');
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fee Payments');
      
      // Add headers
      worksheet.columns = [
        { header: 'Receipt No', key: 'receiptNumber', width: 15 },
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Student', key: 'student', width: 25 },
        { header: 'Class', key: 'class', width: 10 },
        { header: 'Roll No', key: 'rollNumber', width: 10 },
        { header: 'Academic Year', key: 'academicYear', width: 15 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Paid', key: 'paid', width: 12 },
        { header: 'Due', key: 'due', width: 12 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Payment Mode', key: 'mode', width: 15 },
        { header: 'Collected By', key: 'collectedBy', width: 20 }
      ];
      
      // Add data
      payments.forEach(payment => {
        const primaryPayment = payment.paymentDetails[0];
        worksheet.addRow({
          receiptNumber: payment.receiptNumber,
          date: payment.createdAt.toLocaleDateString(),
          student: payment.student.name,
          class: payment.student.class,
          rollNumber: payment.student.rollNumber,
          academicYear: payment.feeStructure.academicYear,
          amount: payment.totalAmount,
          paid: payment.paidAmount,
          due: payment.dueAmount,
          status: payment.status,
          mode: primaryPayment.mode,
          collectedBy: primaryPayment.collectedBy.name
        });
      });
      
      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=fee_payments.xlsx'
      );
      
      // Write workbook to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getFeeSummary = async (req, res) => {
    try {
      const { academicYear, class: className } = req.query;
      const match = {};
      
      if (academicYear) match.academicYear = academicYear;
      if (className) {
        const students = await Student.find({ class: className }).select('_id');
        match.student = { $in: students.map(s => s._id) };
      }
      
      const summary = await FeePayment.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalAmount' },
            totalPaid: { $sum: '$paidAmount' },
            totalDue: { $sum: '$dueAmount' },
            count: { $sum: 1 },
            paidCount: {
              $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
            },
            partialCount: {
              $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] }
            },
            dueCount: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            overdueCount: {
              $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalAmount: 1,
            totalPaid: 1,
            totalDue: 1,
            totalPayments: '$count',
            paidPayments: '$paidCount',
            partialPayments: '$partialCount',
            duePayments: '$dueCount',
            overduePayments: '$overdueCount'
          }
        }
      ]);
      
      res.json(summary[0] || {
        totalAmount: 0,
        totalPaid: 0,
        totalDue: 0,
        totalPayments: 0,
        paidPayments: 0,
        partialPayments: 0,
        duePayments: 0,
        overduePayments: 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export {
    createFeeStructure,
    updateFeeStructure,
    getFeeStructures,
    getFeeStructureById,
    createFeePayment,
    addPaymentToRecord,
    applyDiscount,
    applyPenalty,
    initiateRefund,
    generateReceipt,
    downloadReceipt,
    emailReceipt,
    getFeePayments,
    getFeePaymentById,
    getFeeDefaulters,
    FeePayments,  
    getFeeSummary
  }
