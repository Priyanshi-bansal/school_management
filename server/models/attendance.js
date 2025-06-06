import mongoose from "mongoose";
const { Schema } = mongoose;
const attendenceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
  },
  totalLecturesByFaculty: {
    type: Number,
    default: 0,
  },
  lectureAttended: {
    type: Number,
    default: 0,
  },
  attandanceData:{
    type: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          default: "absent",
        },
      },
    ],
    default: [],
  }
});

export default mongoose.model("Attendance", attendenceSchema);
