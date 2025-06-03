import mongoose from 'mongoose';

const slotAssignmentSchema = new mongoose.Schema({
  slot: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TimeSlot', 
    required: true 
  },
  subject: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject' 
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty',
    validate: {
      validator: async function(teacherId) {
        if (!teacherId) return true;
        const classSubject = await mongoose.model('ClassSubject').findOne({
          teacher: teacherId,
          subject: this.subject,
          class: this.parent().parent().class,
          academicYear: this.parent().parent().academicYear
        });
        return !!classSubject;
      },
      message: 'Teacher is not assigned to this subject for the class'
    }
  },
  substituteTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    validate: {
      validator: async function(substituteId) {
        if (!substituteId) return true;
        if (this.teacher && this.teacher.equals(substituteId)) return false;
        
        const conflict = await mongoose.model('DailyTimetable').findOne({
          _id: { $ne: this.parent()._id },
          day: this.parent().day,
          'slots.slot': this.slot,
          $or: [
            { 'slots.teacher': substituteId },
            { 'slots.substituteTeacher': substituteId }
          ]
        });
        
        return !conflict;
      },
      message: 'Substitute teacher is already assigned during this period'
    }
  },
  substitutionReason: {
    type: String,
    required: function() {
      return !!this.substituteTeacher;
    }
  },
  originalTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  room: {
    type: String,
    uppercase: true,
    trim: true
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const dailyTimetableSchema = new mongoose.Schema({
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
    index: true
  },
  date: {
    type: Date,
    index: true
  },
  slots: [slotAssignmentSchema],
  version: {
    type: Number,
    default: 1
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

dailyTimetableSchema.index({ 'slots.teacher': 1, 'slots.slot': 1, day: 1 });
dailyTimetableSchema.index({ 'slots.substituteTeacher': 1, 'slots.slot': 1, day: 1 });

export default mongoose.model('DailyTimetable', dailyTimetableSchema);