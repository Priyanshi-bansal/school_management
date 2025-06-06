import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section"
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  // Added files field for teacher uploads
  files: [{
    name: String,
    url: String,
    type: String, // pdf, doc, ppt, etc.
    size: Number // in bytes
  }],
  submissionType: {
    type: String,
    enum: ["text", "file", "both"],
    default: "file"
  },
  allowedFormats: [String],
  points: {
    type: Number,
    default: 100
  },
  instructions: String,
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published"
  }
}, { timestamps: true });

export default mongoose.model("Homework", homeworkSchema);