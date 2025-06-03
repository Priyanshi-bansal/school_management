import mongoose from "mongoose";

const classSubjectSchema = mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  isElective: {
    type: Boolean,
    default: false,
  },
  electiveGroup: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("ClassSubject", classSubjectSchema);