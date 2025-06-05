import mongoose from "mongoose";

const facultyAttendanceSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "absent"
  },
  ipAddress: {
    type: String
  },
  locationVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

facultyAttendanceSchema.index({ faculty: 1, date: { $trunc: { $divide: ["$date", 86400000] } } }, { unique: true });

export default mongoose.model("FacultyAttendance", facultyAttendanceSchema);