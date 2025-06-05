import mongoose from 'mongoose';

const salaryComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['HRA', 'DA', 'TA', 'Medical', 'Special Allowance', 'Bonus', 'PF', 'Professional Tax', 'TDS', 'ESI', 'Loan Recovery']
  },
  type: {
    type: String,
    required: true,
    enum: ['earning', 'deduction']
  },
  calculationType: {
    type: String,
    required: true,
    enum: ['fixed', 'percentage', 'variable']
  },
  amount: {
    type: Number,
    required: function() {
      return this.calculationType === 'fixed';
    }
  },
  percentage: {
    type: Number,
    required: function() {
      return this.calculationType === 'percentage';
    },
    min: 0,
    max: 100
  },
  basedOn: {
    type: String,
    required: function() {
      return this.calculationType === 'percentage';
    },
    enum: ['basic', 'gross']
  },
  taxExempt: {
    type: Boolean,
    default: false
  },
  maxLimit: Number,
  minLimit: Number
});

const salaryStructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  applicableFrom: {
    type: Date,
    required: true
  },
  applicableTo: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  components: [salaryComponentSchema],
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for basic salary (sum of all fixed earning components)
salaryStructureSchema.virtual('basicSalary').get(function() {
  return this.components
    .filter(c => c.type === 'earning' && c.calculationType === 'fixed')
    .reduce((sum, component) => sum + component.amount, 0);
});

export default mongoose.model('SalaryStructure', salaryStructureSchema);