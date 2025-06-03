const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  class: { type: String, required: true },
  academicYear: { type: String, required: true },
  effectiveFrom: { type: Date, required: true },
  effectiveTill: { type: Date, required: true },
  components: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
