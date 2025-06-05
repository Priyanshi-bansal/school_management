import mongoose from 'mongoose';

const payslipComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['earning', 'deduction']
  },
  amount: {
    type: Number,
    required: true
  },
  calculationType: {
    type: String,
    required: true,
    enum: ['fixed', 'percentage', 'variable']
  },
  basedOn: String,
  percentage: Number
});

const salaryPaymentSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  salaryStructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalaryStructure',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['bank', 'cash', 'cheque']
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    branch: String,
    IFSC: String
  },
  chequeDetails: {
    number: String,
    date: Date
  },
  components: [payslipComponentSchema],
  workingDays: {
    type: Number,
    required: true
  },
  presentDays: {
    type: Number,
    required: true
  },
  leaveDays: {
    type: Number,
    default: 0
  },
  lopDays: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    required: true
  },
  deductions: {
    type: Number,
    required: true
  },
  netSalary: {
    type: Number,
    required: true
  },
  taxDetails: {
    tds: Number,
    professionalTax: Number,
    otherTax: Number
  },
  status: {
    type: String,
    enum: ['draft', 'approved', 'paid', 'cancelled'],
    default: 'draft'
  },
  payslipGenerated: {
    type: Boolean,
    default: false
  },
  payslipUrl: String,
  remarks: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
salaryPaymentSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// Virtual for payment period
salaryPaymentSchema.virtual('paymentPeriod').get(function() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[this.month - 1]} ${this.year}`;
});

export default mongoose.model('SalaryPayment', salaryPaymentSchema);