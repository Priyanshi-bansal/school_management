// controllers/sectionController.js
import Section from "../models/Section.js";
import asyncHandler from "express-async-handler";

const createSection = asyncHandler(async (req, res) => {
  const { name, class: classId, academicYear, capacity } = req.body;

  // Check if section already exists for this class
  const sectionExists = await Section.findOne({ name, class: classId });
  if (sectionExists) {
    res.status(400);
    throw new Error("Section already exists for this class");
  }

  const section = await Section.create({
    name,
    class: classId,
    academicYear,
    capacity: capacity || 40,
  });

  res.status(201).json(section);
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

  // Check if student is already in this section
  if (section.students.includes(studentId)) {
    res.status(400);
    throw new Error("Student already in this section");
  }

  // Check if section has capacity
  if (section.students.length >= section.capacity) {
    res.status(400);
    throw new Error("Section has reached maximum capacity");
  }

  // TODO: Verify that the student exists and is active

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

  // Check if student is in this section
  if (!section.students.includes(studentId)) {
    res.status(400);
    throw new Error("Student not in this section");
  }

  section.students = section.students.filter(
    (id) => id.toString() !== studentId.toString()
  );
  const updatedSection = await section.save();

  res.json(updatedSection);
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
};