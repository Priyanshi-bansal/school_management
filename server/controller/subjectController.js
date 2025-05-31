// controllers/subjectController.js
import Subject from "../models/subject.js";
import ClassSubject from "../models/ClassSubject.js";
import asyncHandler from "express-async-handler";


const createSubject = asyncHandler(async (req, res) => {
  const { subjectName, subjectCode, department, totalLectures, year } = req.body;

  // Check if subject with this code already exists
  const subjectExists = await Subject.findOne({ subjectCode });
  if (subjectExists) {
    res.status(400);
    throw new Error("Subject with this code already exists");
  }

  const subject = await Subject.create({
    subjectName,
    subjectCode,
    department,
    totalLectures: totalLectures || 10,
    year,
  });

  res.status(201).json(subject);
});

const getSubjects = asyncHandler(async (req, res) => {
  const { department, year } = req.query;
  let query = {};

  if (department) {
    query.department = department;
  }
  if (year) {
    query.year = year;
  }

  const subjects = await Subject.find(query).sort("subjectName");
  res.json(subjects);
});

const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  res.json(subject);
});

const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  // Check if subject code is being updated and if it already exists
  if (req.body.subjectCode && req.body.subjectCode !== subject.subjectCode) {
    const subjectExists = await Subject.findOne({
      subjectCode: req.body.subjectCode,
    });
    if (subjectExists) {
      res.status(400);
      throw new Error("Subject with this code already exists");
    }
  }

  subject.subjectName = req.body.subjectName || subject.subjectName;
  subject.subjectCode = req.body.subjectCode || subject.subjectCode;
  subject.department = req.body.department || subject.department;
  subject.totalLectures = req.body.totalLectures || subject.totalLectures;
  subject.year = req.body.year || subject.year;

  const updatedSubject = await subject.save();

  res.json(updatedSubject);
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  // Check if subject is assigned to any class
  const classSubjectCount = await ClassSubject.countDocuments({
    subject: subject._id,
  });
  if (classSubjectCount > 0) {
    res.status(400);
    throw new Error("Cannot delete subject assigned to classes");
  }

  await subject.remove();
  res.json({ message: "Subject removed" });
});

const assignSubjectToClass = asyncHandler(async (req, res) => {
  const { subject, class: classId, academicYear, isElective, electiveGroup } =
    req.body;

  // Check if subject is already assigned to this class
  const classSubjectExists = await ClassSubject.findOne({
    subject,
    class: classId,
    academicYear,
  });
  if (classSubjectExists) {
    res.status(400);
    throw new Error("Subject already assigned to this class");
  }

  const classSubject = await ClassSubject.create({
    subject,
    class: classId,
    academicYear,
    isElective: isElective || false,
    electiveGroup: isElective ? electiveGroup : undefined,
  });

  res.status(201).json(classSubject);
});

const getClassSubjects = asyncHandler(async (req, res) => {
  const { class: classId, academicYear } = req.query;

  if (!classId || !academicYear) {
    res.status(400);
    throw new Error("Class and academic year are required");
  }

  const classSubjects = await ClassSubject.find({
    class: classId,
    academicYear,
  })
    .populate("subject", "subjectName subjectCode")
    .populate("teacher", "name email")
    .sort("subject.subjectName");

  res.json(classSubjects);
});

const assignTeacherToClassSubject = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  const classSubject = await ClassSubject.findById(req.params.id);
  if (!classSubject) {
    res.status(404);
    throw new Error("Class subject not found");
  }

  // TODO: Verify that the teacher exists and is active

  classSubject.teacher = teacherId;
  const updatedClassSubject = await classSubject.save();

  res.json(updatedClassSubject);
});

const getClassSubjectTeacher = asyncHandler(async (req, res) => {
  const classSubject = await ClassSubject.findById(req.params.id)
    .populate("teacher", "name email");

  if (!classSubject) {
    res.status(404);
    throw new Error("Class subject not found");
  }

  res.json(classSubject.teacher);
});

const getTeacherClassSubjects = asyncHandler(async (req, res) => {
  const { teacherId } = req.query;

  if (!teacherId) {
    res.status(400);
    throw new Error("Teacher ID is required");
  }

  const classSubjects = await ClassSubject.find({ teacher: teacherId })
    .populate("subject", "subjectName subjectCode")
    .populate("class", "name")
    .sort("subject.subjectName");

  res.json(classSubjects);
});

const updateClassSubjectSyllabus = asyncHandler(async (req, res) => {
  const { syllabus } = req.body;

  const classSubject = await ClassSubject.findById(req.params.id);
  if (!classSubject) {
    res.status(404);
    throw new Error("Class subject not found");
  }

  classSubject.syllabus = syllabus;
  const updatedClassSubject = await classSubject.save();

  res.json(updatedClassSubject);
});

export {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignSubjectToClass,
  getClassSubjects,
  assignTeacherToClassSubject,
  updateClassSubjectSyllabus,
};