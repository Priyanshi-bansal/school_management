import express from "express";
import mongoose from "mongoose";

const classTimetableSchema = new mongoose.Schema({
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  section: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section' 
  },
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true 
  },
  timetable: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DailyTimetable' 
  }],
  effectiveFrom: { 
    type: Date, 
    required: true 
  },
  effectiveTill: Date,
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  }
}, {
  timestamps: true
});

// Indexes
classTimetableSchema.index({ class: 1, section: 1, academicYear: 1, isActive: 1 });

const ClassTimetable = mongoose.model('ClassTimetable', classTimetableSchema);

export default ClassTimetable;