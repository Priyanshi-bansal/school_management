const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema({
  role: { type: String, enum: ['faculty', 'principal', 'admin'], required: true },
  baseSalary: { type: Number, required: true },
  allowances: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  deductions: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
