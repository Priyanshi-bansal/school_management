import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: { 
    type: String, 
    required: true,
    validate: {
      validator: v => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
      message: props => `${props.value} is not a valid time (HH:MM)`
    }
  },
  endTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        const isValidFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        const isAfterStart = new Date(`1970-01-01T${v}:00`) > new Date(`1970-01-01T${this.startTime}:00`);
        return isValidFormat && isAfterStart;
      },
      message: 'End time must be valid and after start time'
    }
  },
  periodNumber: { 
    type: Number, 
    required: true,
    min: 1,
    max: 12
  },
  isBreak: { 
    type: Boolean, 
    default: false 
  },
  breakName: { 
    type: String,
    required: function() { return this.isBreak; }
  },
  isTeachingSlot: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('TimeSlot', timeSlotSchema);