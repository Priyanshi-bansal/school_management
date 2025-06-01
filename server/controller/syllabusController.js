import Student from '../models/student.js';
import Syllabus from '../models/syllabusModel.js';
import mongoose from 'mongoose';

// 1. Create a new syllabus
export const createSyllabus = async (req, res) => {
  try {
    const { classId, subjectId, academicYear } = req.body;
    
    // Check if syllabus already exists for this class-subject-year combination
    const existingSyllabus = await Syllabus.findOne({ classId, subjectId, academicYear });
    if (existingSyllabus) {
      return res.status(400).json({ error: 'Syllabus already exists for this class, subject, and academic year' });
    }
    
    const syllabus = new Syllabus({
        classId,
        subjectId,
        academicYear,
      createdBy: req.user._id
    });
    
    await syllabus.save();
    res.status(201).json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Get all syllabi (with optional filtering)
export const getAllSyllabus = async (req, res) => {
  try {
    const { classId, subjectId, academicYear } = req.query;
    const filter = {};
    
    if (classId) filter.class = classId;
    if (subjectId) filter.subject = subjectId;
    if (academicYear) filter.academicYear = academicYear;
    
    const syllabus = await Syllabus.find(filter)
      .populate('classId')
      .populate('subjectId')
      .populate('academicYear')
      .populate('createdBy')
      .populate('updatedBy');
      
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a single syllabus by ID
export const getSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .populate('classId')
      .populate('subjectId')
      .populate('academicYear')
      .populate('createdBy')
      .populate('updatedBy');
      
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update syllabus basic info
export const updateSyllabus = async (req, res) => {
  try {
    const { classId, subjectId, academicYear } = req.body;
    if (!classId || !subjectId || !academicYear) {
      return res.status(400).json({ error: 'Class ID, Subject ID, and Academic Year are required' });
    }
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      {
        classId,
        subjectId,
        academicYear,
        updatedBy: req.user._id,
        updatedByModel: req.user.role === 'admin' ? 'Admin' : 'Faculty',
        lastUpdated: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. Delete a syllabus
export const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndDelete(req.params.id);
    
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    res.json({ message: 'Syllabus deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Add a new chapter to syllabus
export const addChapter = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    // Generate chapter number if not provided
    if (!req.body.chapterNumber) {
      req.body.chapterNumber = syllabus.chapters.length + 1;
    }
    
    syllabus.chapters.push(req.body);
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.status(201).json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 7. Update a chapter
export const updateChapter = async (req, res) => {
  try {
    const { syllabusId, chapterId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapterIndex = syllabus.chapters.findIndex(
      chap => chap._id.toString() === chapterId
    );
    
    if (chapterIndex === -1) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    syllabus.chapters[chapterIndex] = {
      ...syllabus.chapters[chapterIndex].toObject(),
      ...req.body
    };
    
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 8. Delete a chapter
export const deleteChapter = async (req, res) => {
  try {
    const { syllabusId, chapterId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    syllabus.chapters = syllabus.chapters.filter(
      chap => chap._id.toString() !== chapterId
    );
    
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// 9. Add a topic to a chapter
export const addTopic = async (req, res) => {
  try {
    const { syllabusId, chapterId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    // Generate topic number if not provided
    if (!req.body.topicNumber) {
      req.body.topicNumber = chapter.topics.length + 1;
    }
    
    chapter.topics.push(req.body);
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.status(201).json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 10. Update a topic
export const updateTopic = async (req, res) => {
  try {
    const { syllabusId, chapterId, topicId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    const topic = chapter.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    topic.set(req.body);
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 11. Mark topic as completed/incomplete
export const toggleTopicCompletion = async (req, res) => {
  try {
    const { syllabusId, chapterId, topicId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    const topic = chapter.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    topic.isCompleted = !topic.isCompleted;
    topic.completedOn = topic.isCompleted ? new Date() : null;
    
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 12. Delete a topic
export const deleteTopic = async (req, res) => {
  try {
    const { syllabusId, chapterId, topicId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    chapter.topics = chapter.topics.filter(
      topic => topic._id.toString() !== topicId
    );
    
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 13. Add an assessment to a chapter
export const addAssessment = async (req, res) => {
  try {
    const { syllabusId, chapterId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    chapter.assessments.push(req.body);
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.status(201).json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 14. Update an assessment
export const updateAssessment = async (req, res) => {
  try {
    const { syllabusId, chapterId, assessmentId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    const assessment = chapter.assessments.id(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    assessment.set(req.body);
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 15. Delete an assessment
export const deleteAssessment = async (req, res) => {
  try {
    const { syllabusId, chapterId, assessmentId } = req.params;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    chapter.assessments = chapter.assessments.filter(
      assessment => assessment._id.toString() !== assessmentId
    );
    
    syllabus.updatedBy = req.user._id;
    syllabus.updatedByModel = req.user.role === 'admin' ? 'Admin' : 'Faculty';
    syllabus.lastUpdated = Date.now();
    
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 16. Get syllabus progress
export const getSyllabusProgress = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .select('chapters progress');
      
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    // The progress virtual will be automatically included
    res.json({
      progress: syllabus.progress,
      totalChapters: syllabus.chapters.length,
      completedTopics: syllabus.chapters.reduce(
        (acc, chapter) => acc + chapter.topics.filter(t => t.isCompleted).length,
        0
      ),
      totalTopics: syllabus.chapters.reduce(
        (acc, chapter) => acc + chapter.topics.length,
        0
      )
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 17. Get chapter-wise progress
export const getChapterProgress = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .select('chapters');
      
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    const progress = syllabus.chapters.map(chapter => ({
      chapterId: chapter._id,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      totalTopics: chapter.topics.length,
      completedTopics: chapter.topics.filter(t => t.isCompleted).length,
      progress: chapter.topics.length > 0 
        ? (chapter.topics.filter(t => t.isCompleted).length / chapter.topics.length) * 100 
        : 0
    }));
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 18. Get syllabus by class, subject, and academic year
export const getSyllabusByFilters = async (req, res) => {
  try {
    const { classId, subjectId, academicYearId } = req.params;
    
    const syllabus = await Syllabus.findOne({
      class: classId,
      subject: subjectId,
      academicYear: academicYearId
    })
    .populate('class', 'name level')
    .populate('subject', 'name code')
    .populate('academicYear', 'name');
    
    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }
    
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 19. Clone syllabus from previous academic year
export const cloneSyllabus = async (req, res) => {
  try {
    const { sourceSyllabusId, academicYearId } = req.body;
    
    // Get source syllabus
    const sourceSyllabus = await Syllabus.findById(sourceSyllabusId);
    if (!sourceSyllabus) {
      return res.status(404).json({ error: 'Source syllabus not found' });
    }
    
    // Check if syllabus already exists for the new academic year
    const existingSyllabus = await Syllabus.findOne({
      class: sourceSyllabus.class,
      subject: sourceSyllabus.subject,
      academicYear: academicYearId
    });
    
    if (existingSyllabus) {
      return res.status(400).json({ error: 'Syllabus already exists for this academic year' });
    }
    
    // Create new syllabus with cloned data
    const newSyllabus = new Syllabus({
      ...sourceSyllabus.toObject(),
      _id: new mongoose.Types.ObjectId(),
      academicYear: academicYearId,
      createdBy: req.user._id,
      updatedBy: req.user._id,
      updatedByModel: req.user.role === 'admin' ? 'Admin' : 'Faculty',
      lastUpdated: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Reset completion status for all topics
    newSyllabus.chapters.forEach(chapter => {
      chapter.topics.forEach(topic => {
        topic.isCompleted = false;
        topic.completedOn = null;
      });
    });
    
    await newSyllabus.save();
    res.status(201).json(newSyllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get syllabus for a student's enrolled class
export const getStudentSyllabus = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).populate('year');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const syllabus = await Syllabus.findOne({
      class: student.enrolledClass,
      academicYear: currentAcademicYear // You'd need to fetch this
    }).populate('subject', 'name code');

    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark multiple topics as completed (for a teacher)
export const completeTopics = async (req, res) => {
  try {
    const { syllabusId, chapterId, topicIds } = req.body;
    
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) return res.status(404).json({ error: 'Syllabus not found' });

    const chapter = syllabus.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    chapter.topics.forEach(topic => {
      if (topicIds.includes(topic._id.toString())) {
        topic.isCompleted = true;
        topic.completedOn = new Date();
      }
    });

    syllabus.updatedBy = req.user._id;
    await syllabus.save();
    res.json(syllabus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
