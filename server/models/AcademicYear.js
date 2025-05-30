import mongoose from "mongoose";

const academicYearSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
}, { timestamps: true });

export default mongoose.model("AcademicYear", academicYearSchema);
