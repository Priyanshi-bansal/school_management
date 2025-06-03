const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  mode: {
    type: String,
    enum: ['cash', 'online', 'bank transfer', 'cheque'],
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'partial', 'due'],
    default: 'paid'
  },
  receiptUrl: {
    type: String // file path or cloud URL
  },
  transactionId: {
    type: String // for online payment gateways
  },
  remarks: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // staff/admin who created this
  }
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', feePaymentSchema);
