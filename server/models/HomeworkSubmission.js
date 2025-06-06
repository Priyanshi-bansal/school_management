import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  homework: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Homework",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  textSubmission: String,
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  status: {
    type: String,
    enum: ["submitted", "late", "resubmitted", "draft"],
    default: "submitted"
  },
  grade: {
    score: Number,
    maxScore: Number,
    feedback: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty"
    },
    gradedAt: Date
  },
  isGraded: {
    type: Boolean,
    default: false
  },
  comments: [{
    text: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "comments.postedByModel"
    },
    postedByModel: {
      type: String,
      enum: ["Faculty", "Student"]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  version: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Indexes for performance
submissionSchema.index({ homework: 1, student: 1 }, { unique: true });
submissionSchema.index({ student: 1, isGraded: 1 });

export default mongoose.model("HomeworkSubmission", submissionSchema);