// controllers/classController.js
import Class from "../models/Class.js";
import asyncHandler from "express-async-handler";

const createClass = asyncHandler(async (req, res) => {
  const { name, numericValue, academicYear, description, capacity } = req.body;

  // Check if class already exists for this academic year
  const classExists = await Class.findOne({ name, academicYear });
  if (classExists) {
    res.status(400);
    throw new Error("Class already exists for this academic year");
  }

  const newClass = await Class.create({
    name,
    numericValue,
    academicYear,
    description,
    capacity: capacity || 40,
  });

  res.status(201).json(newClass);
});

const getClasses = asyncHandler(async (req, res) => {
  const { academicYear } = req.query;
  let query = {};

  if (academicYear) {
    query.academicYear = academicYear;
  }

  const classes = await Class.find(query)
    .populate("academicYear", "name")
    .populate("classTeacher", "name email")
    .sort("numericValue");

  res.json(classes);
});

const getClassById = asyncHandler(async (req, res) => {
  const classData = await Class.findById(req.params.id)
    .populate("academicYear", "name")
    .populate("classTeacher", "name email");

  if (!classData) {
    res.status(404);
    throw new Error("Class not found");
  }

  res.json(classData);
});

const updateClass = asyncHandler(async (req, res) => {
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    res.status(404);
    throw new Error("Class not found");
  }

  // Check if class name is being updated and if it already exists
  if (req.body.name && req.body.name !== classData.name) {
    const classExists = await Class.findOne({
      name: req.body.name,
      academicYear: classData.academicYear,
    });
    if (classExists) {
      res.status(400);
      throw new Error("Class with this name already exists for this academic year");
    }
  }

  classData.name = req.body.name || classData.name;
  classData.numericValue = req.body.numericValue || classData.numericValue;
  classData.description = req.body.description || classData.description;
  classData.capacity = req.body.capacity || classData.capacity;
  classData.classTeacher = req.body.classTeacher || classData.classTeacher;
  classData.isActive =
    req.body.isActive !== undefined ? req.body.isActive : classData.isActive;

  const updatedClass = await classData.save();

  res.json(updatedClass);
});

const deleteClass = asyncHandler(async (req, res) => {
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    res.status(404);
    throw new Error("Class not found");
  }

  // Check if there are sections associated with this class
  const sectionsCount = await Section.countDocuments({ class: classData._id });
  if (sectionsCount > 0) {
    res.status(400);
    throw new Error("Cannot delete class with existing sections");
  }

  await classData.remove();
  res.json({ message: "Class removed" });
});

const assignClassTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  const classData = await Class.findById(req.params.id);
  if (!classData) {
    res.status(404);
    throw new Error("Class not found");
  }

  // TODO: Verify that the teacher exists and is active

  classData.classTeacher = teacherId;
  const updatedClass = await classData.save();

  res.json(updatedClass);
});

export {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignClassTeacher,
};