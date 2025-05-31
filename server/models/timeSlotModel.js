// models/timetable/timeSlotModel.js
import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format (HH:mm)`
    }
  },
  endTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format (HH:mm)`
    }
  },
  periodNumber: { 
    type: Number, 
    required: true,
    min: 1
  },
  isBreak: { 
    type: Boolean, 
    default: false 
  },
  breakName: { 
    type: String,
    required: function() {
      return this.isBreak;
    }
  }
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

export default TimeSlot;

