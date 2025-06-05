import mongoose from 'mongoose';

const paymentDetailSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  mode: {
    type: String,
    required: true,
    enum: ['cash', 'cheque', 'online', 'bank_transfer', 'card', 'dd']
  },
  transactionId: String,
  chequeDetails: {
    number: String,
    bank: String,
    branch: String,
    date: Date
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const discountSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['early_payment', 'sibling', 'scholarship', 'staff', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  approvedAt: {
    type: Date,
    default: Date.now
  }
});

const penaltySchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['late_payment', 'damage', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: String,
  appliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const refundSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['cash', 'cheque', 'bank_transfer']
  },
  transactionId: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed'],
    default: 'pending'
  }
});

const feePaymentSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeStructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeStructure',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  installment: {
    name: String,
    dueDate: Date
  },
  paymentDetails: [paymentDetailSchema],
  discounts: [discountSchema],
  penalties: [penaltySchema],
  refunds: [refundSchema],
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue', 'refunded', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: function() {
      return this.totalAmount - this.paidAmount;
    }
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedAt: Date,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook for receipt number
feePaymentSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const count = await this.constructor.countDocuments();
    this.receiptNumber = `REC-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('FeePayment', feePaymentSchema);