import mongoose from "mongoose";

const classSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  sections: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Section"
}],
  numericValue: {
    type: Number,
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  capacity: {
    type: Number,
    default: 40,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Class", classSchema);
