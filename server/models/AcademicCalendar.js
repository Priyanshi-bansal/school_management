import mongoose from "mongoose";

const academicCalendarSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["holiday", "exam", "event", "meeting", "other"],
    required: true,
  },
  forClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  forSection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
}, { timestamps: true });

export default mongoose.model("AcademicCalendar", academicCalendarSchema);