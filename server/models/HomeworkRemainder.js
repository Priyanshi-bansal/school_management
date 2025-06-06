import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  homework: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Homework",
    required: true
  },
  sentTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }],
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  },
  message: String,
  sentAt: {
    type: Date,
    default: Date.now
  },
  scheduled: {
    type: Boolean,
    default: false
  },
  scheduledDate: Date
}, { timestamps: true });

export default mongoose.model("HomeworkReminder", reminderSchema);