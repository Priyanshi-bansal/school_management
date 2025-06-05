import mongoose from 'mongoose';

const feeComponentSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['Tuition', 'Library', 'Sports', 'Transportation', 'Examination', 'Activity', 'Admission', 'Other']
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  isOptional: { 
    type: Boolean, 
    default: false 
  },
  refundable: {
    type: Boolean,
    default: false
  }
});

const installmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  lateFee: {
    amount: Number,
    percentage: Number,
    applicableAfter: Number // days after due date
  }
});

const feeStructureSchema = mongoose.Schema({
  academicYear: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{4}$/, 'Please enter a valid academic year format (YYYY-YYYY)']
  },
  class: {
    type: String,
    required: true,
    enum: ['Nursery', 'KG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  },
  components: [feeComponentSchema],
  installments: [installmentSchema],
  earlyPaymentDiscount: {
    amount: Number,
    percentage: Number,
    applicableTill: Date
  },
  siblingDiscount: {
    percentage: Number,
    maxDiscount: Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate total fee
feeStructureSchema.virtual('totalFee').get(function() {
  return this.components.reduce((sum, component) => sum + component.amount, 0);
});

// Add pre-save hook for updatedAt
feeStructureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('FeeStructure', feeStructureSchema);