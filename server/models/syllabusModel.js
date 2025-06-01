// models/academic/syllabusModel.js
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  topicNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  duration: Number, // in hours
  teachingMethods: [String],
  learningOutcomes: [String],
  resources: [{
    type: { type: String, enum: ['book', 'video', 'website', 'document'] },
    title: String,
    url: String
  }],
  isCompleted: { type: Boolean, default: false },
  completedOn: Date,
  notes: String
});

const chapterSchema = new mongoose.Schema({
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  topics: [topicSchema],
  assessments: [{
    type: { type: String, enum: ['quiz', 'assignment', 'project'] },
    title: String,
    description: String,
    dueDate: Date,
    maxMarks: Number
  }]
});

const syllabusSchema = new mongoose.Schema({
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  subjectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject', 
    required: true 
  },
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true 
  },
  chapters: [chapterSchema],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin'
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'updatedByModel' 
  },
  updatedByModel: {
    type: String,
    enum: ['Admin', 'Faculty']
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster querying
syllabusSchema.index({ classId: 1, subjectId: 1, academicYear: 1 }, { unique: true });


// Virtual for progress calculation
syllabusSchema.virtual('progress').get(function() {
  let totalTopics = 0;
  let completedTopics = 0;
  
  this.chapters.forEach(chapter => {
    chapter.topics.forEach(topic => {
      totalTopics++;
      if (topic.isCompleted) {
        completedTopics++;
      }
    });
  });
  
  return totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
});

const Syllabus = mongoose.model('Syllabus', syllabusSchema);

export default Syllabus;