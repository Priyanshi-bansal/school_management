import mongoose from 'mongoose';

const classTimetableSchema = new mongoose.Schema({
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true,
    index: true
  },
  section: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section',
    index: true
  },
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true,
    index: true
  },
  timetable: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DailyTimetable' 
  }],
  effectiveFrom: { 
    type: Date, 
    required: true,
    index: true,
    validate: {
      validator: function(v) {
        return v >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Effective date cannot be in the past'
    }
  },
  effectiveTill: {
    type: Date,
    index: true,
    validate: {
      validator: function(v) {
        return !v || v > this.effectiveFrom;
      },
      message: 'End date must be after start date'
    }
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
  parentVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassTimetable'
  },
  changeReason: String,
  validationHash: String,
  lastValidatedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

classTimetableSchema.index({
  class: 1,
  section: 1,
  academicYear: 1,
  isActive: 1
});

classTimetableSchema.pre('save', async function(next) {
  if (this.isModified('timetable')) {
    this.lastValidatedAt = new Date();
    this.validationHash = await this.generateValidationHash();
  }
  next();
});

classTimetableSchema.methods.generateValidationHash = async function() {
  const dailyTimetables = await mongoose.model('DailyTimetable')
    .find({ _id: { $in: this.timetable } })
    .populate('slots.teacher slots.subject slots.slot');
  
  const crypto = await import('crypto');
  const hash = crypto.createHash('sha256');
  
  dailyTimetables.forEach(day => {
    day.slots.forEach(slot => {
      hash.update(`${slot.teacher?._id || ''}-${slot.subject?._id || ''}-${slot.slot?._id || ''}`);
    });
  });
  
  return hash.digest('hex');
};

export default mongoose.model('ClassTimetable', classTimetableSchema);