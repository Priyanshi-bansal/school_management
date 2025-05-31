import Syllabus from '../models/syllabusModel.js';
import ClassSubject from '../models/ClassSubject.js';
import asyncHandler from 'express-async-handler';


const createUpdateSyllabus = asyncHandler(async (req, res) => {
  const { class: classId, subject: subjectId, academicYear, chapters } = req.body;

  // Validate inputs
  if (!classId || !subjectId || !academicYear || !chapters) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Validate faculty permission if not admin
  if (req.user.role === 'faculty') {
    const teachingSubject = await ClassSubject.findOne({
      subject: subjectId,
      teacher: req.user._id
    });

    if (!teachingSubject) {
      res.status(403);
      throw new Error('Not authorized to update this syllabus');
    }
  }

  // Validate chapters structure
  if (!Array.isArray(chapters)) {
    res.status(400);
    throw new Error('Chapters must be an array');
  }

  for (const chapter of chapters) {
    if (!chapter.chapterNumber || !chapter.title || !Array.isArray(chapter.topics)) {
      res.status(400);
      throw new Error('Each chapter must have chapterNumber, title and topics array');
    }

    for (const topic of chapter.topics) {
      if (!topic.topicNumber || !topic.title) {
        res.status(400);
        throw new Error('Each topic must have topicNumber and title');
      }
    }
  }

  // Create or update syllabus
  const filter = { class: classId, subject: subjectId, academicYear };
  const update = { 
    chapters,
    lastUpdated: Date.now(),
    updatedBy: req.user._id
  };

  const syllabus = await Syllabus.findOneAndUpdate(
    filter,
    update,
    { new: true, upsert: true, runValidators: true }
  )
    .populate('subject', 'subjectName code')
    .populate('class', 'name')
    .populate('academicYear', 'name');

  res.status(201).json({
    status: 'success',
    data: syllabus
  });
});

const getSyllabus = asyncHandler(async (req, res) => {
  const { class: classId, subject: subjectId, academicYear } = req.query;

  // Validate inputs
  if (!classId || !subjectId) {
    return res.status(400).send('Class ID and Subject ID are required');
  }

  const query = {
    class: classId,
    subject: subjectId
  };

  if (academicYear) {
    query.academicYear = academicYear;
  } else {
    // Get current academic year if not specified
    const currentYear = await AcademicYear.findOne({ isCurrent: true });
    if (currentYear) {
      query.academicYear = currentYear._id;
    }
  }

  const syllabus = await Syllabus.findOne(query)
    .populate('subject', 'subjectName code')
    .populate('class', 'name')
    .populate('academicYear', 'name');

  if (!syllabus) {
   return res.status(404).send('Syllabus not found');
  }

  res.json({
    status: 'success',
    data: syllabus
  });
});

const getClassSyllabi = asyncHandler(async (req, res) => {
  const { class: classId, academicYear } = req.query;

  // Validate inputs
  if (!classId) {
    res.status(400);
    throw new Error('Class ID is required');
  }

  const query = { class: classId };

  if (academicYear) {
    query.academicYear = academicYear;
  } else {
    // Get current academic year if not specified
    const currentYear = await AcademicYear.findOne({ isCurrent: true });
    if (currentYear) {
      query.academicYear = currentYear._id;
    }
  }

  const syllabi = await Syllabus.find(query)
    .populate('subject', 'subjectName code')
    .populate('academicYear', 'name');

  res.json({
    status: 'success',
    data: syllabi
  });
});

// @desc    Get syllabus progress
// @route   GET /api/syllabus/progress
// @access  Private/Faculty
const getSyllabusProgress = asyncHandler(async (req, res) => {
  const { class: classId, subject: subjectId, academicYear } = req.query;

  // Validate inputs
  if (!classId || !subjectId) {
    res.status(400);
    throw new Error('Class ID and Subject ID are required');
  }

  // Check faculty permission if not admin
  if (req.user.role === 'faculty') {
    const teachingSubject = await ClassSubject.findOne({
      class: classId,
      subject: subjectId,
      teacher: req.user._id
    });

    if (!teachingSubject) {
      res.status(403);
      throw new Error('Not authorized to view this syllabus progress');
    }
  }

  const query = {
    class: classId,
    subject: subjectId
  };

  if (academicYear) {
    query.academicYear = academicYear;
  } else {
    // Get current academic year if not specified
    const currentYear = await AcademicYear.findOne({ isCurrent: true });
    if (currentYear) {
      query.academicYear = currentYear._id;
    }
  }

  const syllabus = await Syllabus.findOne(query);

  if (!syllabus) {
    res.status(404);
    throw new Error('Syllabus not found');
  }

  // Calculate progress
  let totalTopics = 0;
  let completedTopics = 0;

  syllabus.chapters.forEach(chapter => {
    chapter.topics.forEach(topic => {
      totalTopics++;
      if (topic.isCompleted) {
        completedTopics++;
      }
    });
  });

  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  res.json({
    status: 'success',
    data: {
      syllabus: syllabus._id,
      class: classId,
      subject: subjectId,
      totalChapters: syllabus.chapters.length,
      totalTopics,
      completedTopics,
      progress,
      lastUpdated: syllabus.lastUpdated
    }
  });
});

// @desc    Update topic completion status
// @route   PUT /api/syllabus/topic
// @access  Private/Faculty
const updateTopicStatus = asyncHandler(async (req, res) => {
  const { syllabusId, chapterNumber, topicNumber, isCompleted } = req.body;

  // Validate inputs
  if (!syllabusId || !chapterNumber || !topicNumber || typeof isCompleted !== 'boolean') {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const syllabus = await Syllabus.findById(syllabusId);
  if (!syllabus) {
    res.status(404);
    throw new Error('Syllabus not found');
  }

  // Check faculty permission if not admin
  if (req.user.role === 'faculty') {
    const teachingSubject = await ClassSubject.findOne({
      class: syllabus.class,
      subject: syllabus.subject,
      teacher: req.user._id
    });

    if (!teachingSubject) {
      res.status(403);
      throw new Error('Not authorized to update this syllabus');
    }
  }

  // Find and update the topic
  const chapter = syllabus.chapters.find(
    chap => chap.chapterNumber === parseInt(chapterNumber)
  );

  if (!chapter) {
    res.status(404);
    throw new Error('Chapter not found');
  }

  const topic = chapter.topics.find(
    top => top.topicNumber === parseInt(topicNumber)
  );

  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  topic.isCompleted = isCompleted;
  topic.completedOn = isCompleted ? Date.now() : null;
  syllabus.lastUpdated = Date.now();
  syllabus.updatedBy = req.user._id;

  await syllabus.save();

  res.json({
    status: 'success',
    data: {
      syllabus: syllabus._id,
      chapter: chapterNumber,
      topic: topicNumber,
      isCompleted,
      updatedAt: syllabus.lastUpdated
    }
  });
});

export {
  createUpdateSyllabus,
  getSyllabus,
  getClassSyllabi,
  getSyllabusProgress,
  updateTopicStatus
};