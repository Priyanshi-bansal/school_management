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
    ref: 'Faculty' 
  },
  room: String
});

const dailyTimetableSchema = new mongoose.Schema({
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true 
  },
  slots: [slotAssignmentSchema]
});

const DailyTimetable = mongoose.model('DailyTimetable', dailyTimetableSchema);

export default DailyTimetable;