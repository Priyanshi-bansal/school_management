// controllers/sectionController.js
import Section from "../models/Section.js";
import asyncHandler from "express-async-handler";
import Student from "../models/student.js";
import Class from "../models/Class.js";

const createSection = asyncHandler(async (req, res) => {
  const { name, classId, academicYear, capacity } = req.body;

  const existingClass = await Class.findById(classId);
  if (!existingClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  const existingSection = await Section.findOne({ name, class: classId });
  if (existingSection) {
    res.status(400);
    throw new Error("Section with this name already exists for this class");
  }

  const newSection = await Section.create({
    name,
    class: classId,
    academicYear,
    capacity: capacity || 40,
  });

  existingClass.sections = existingClass.sections || [];
  existingClass.sections.push(newSection._id);
  await existingClass.save();

  res.status(201).json(newSection);
});

const getSections = asyncHandler(async (req, res) => {
  const { class: classId, academicYear } = req.query;
  let query = {};

  if (classId) {
    query.class = classId;
  }
  if (academicYear) {
    query.academicYear = academicYear;
  }

  const sections = await Section.find(query)
    .populate("class", "name")
    .populate("academicYear", "name")
    .populate("classTeacher", "name email")
    .populate("students", "name email")
    .sort("name");

  res.json(sections);
});

const getSectionById = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.id)
    .populate("class", "name")
    .populate("academicYear", "name")
    .populate("classTeacher", "name email")
    .populate("students", "name email");

  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }

  res.json(section);
});

const updateSection = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.id);

  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }

  // Check if section name is being updated and if it already exists
  if (req.body.name && req.body.name !== section.name) {
    const sectionExists = await Section.findOne({
      name: req.body.name,
      class: section.class,
    });
    if (sectionExists) {
      res.status(400);
      throw new Error("Section with this name already exists for this class");
    }
  }

  section.name = req.body.name || section.name;
  section.capacity = req.body.capacity || section.capacity;
  section.classTeacher = req.body.classTeacher || section.classTeacher;
  section.isActive =
    req.body.isActive !== undefined ? req.body.isActive : section.isActive;

  const updatedSection = await section.save();

  res.json(updatedSection);
});

const deleteSection = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.id);

  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }

  // Check if there are students in this section
  if (section.students.length > 0) {
    res.status(400);
    throw new Error("Cannot delete section with existing students");
  }

  await section.remove();
  res.json({ message: "Section removed" });
});

const assignSectionTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  const section = await Section.findById(req.params.id);
  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }

  // TODO: Verify that the teacher exists and is active

  section.classTeacher = teacherId;
  const updatedSection = await section.save();

  res.json(updatedSection);
});

const addStudentToSection = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const section = await Section.findById(req.params.id);
  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // Already assigned?
  if (student.section && student.section.toString() !== section._id.toString()) {
    res.status(400);
    throw new Error("Student already assigned to another section");
  }

  if (section.students.includes(studentId)) {
    res.status(400);
    throw new Error("Student already in this section");
  }

  if (section.students.length >= section.capacity) {
    res.status(400);
    throw new Error("Section has reached maximum capacity");
  }

  // Assign
  student.section = section._id;
  await student.save();

  section.students.push(studentId);
  const updatedSection = await section.save();

  res.json(updatedSection);
});


const removeStudentFromSection = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const section = await Section.findById(req.params.id);
  if (!section) {
    res.status(404);
    throw new Error("Section not found");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (!section.students.includes(studentId)) {
    res.status(400);
    throw new Error("Student not in this section");
  }

  section.students = section.students.filter(
    (id) => id.toString() !== studentId.toString()
  );
  await section.save();

  student.section = null;
  await student.save();

  res.json({ message: "Student removed from section" });
});

const getAvailableStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({ section: null });
  res.json(students);
});


export {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
  assignSectionTeacher,
  addStudentToSection,
  removeStudentFromSection,
  getAvailableStudents
};