const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  salaryStructureId: { type: mongoose.Schema.Types.ObjectId, ref: 'SalaryStructure', required: true },
  grossSalary: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' }
});

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);
