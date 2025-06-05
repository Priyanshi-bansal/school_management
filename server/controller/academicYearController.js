import AcademicYear from "../models/AcademicYear.js";
import asyncHandler from "express-async-handler";

const createAcademicYear = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, description } = req.body;

  const yearExists = await AcademicYear.findOne({ name });
  if (yearExists) {
    res.status(400);
    throw new Error("Academic year already exists");
  }

  if (req.body.isCurrent) {
    await AcademicYear.updateMany({}, { $set: { isCurrent: false } });
  }

  const academicYear = await AcademicYear.create({
    name,
    startDate,
    endDate,
    description,
    isCurrent: req.body.isCurrent || false,
    createdBy: req.userId,
  });

  res.status(201).json(academicYear);
});

const getAcademicYears = asyncHandler(async (req, res) => {
  const academicYears = await AcademicYear.find({}).sort("-startDate");
  res.json(academicYears);
});

const getCurrentAcademicYear = asyncHandler(async (req, res) => {
  const academicYear = await AcademicYear.findOne({ isCurrent: true });
  if (!academicYear) {
    res.status(404);
    throw new Error("No current academic year set");
  }
  res.json(academicYear);
});

const setCurrentAcademicYear = asyncHandler(async (req, res) => {
  await AcademicYear.updateMany({}, { $set: { isCurrent: false } });

  const academicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    { $set: { isCurrent: true } },
    { new: true }
  );

  if (!academicYear) {
    res.status(404);
    throw new Error("Academic year not found");
  }

  res.json(academicYear);
});

const updateAcademicYear = asyncHandler(async (req, res) => {
  const academicYear = await AcademicYear.findById(req.params.id);

  if (!academicYear) {
    res.status(404);
    throw new Error("Academic year not found");
  }

  if (req.body.isCurrent) {
    await AcademicYear.updateMany(
      { _id: { $ne: academicYear._id } },
      { $set: { isCurrent: false } }
    );
  }

  academicYear.name = req.body.name || academicYear.name;
  academicYear.startDate = req.body.startDate || academicYear.startDate;
  academicYear.endDate = req.body.endDate || academicYear.endDate;
  academicYear.description = req.body.description || academicYear.description;
  academicYear.isCurrent =
    req.body.isCurrent !== undefined
      ? req.body.isCurrent
      : academicYear.isCurrent;

  const updatedAcademicYear = await academicYear.save();

  res.json(updatedAcademicYear);
});

const deleteAcademicYear = asyncHandler(async (req, res) => {
  const academicYear = await AcademicYear.findById(req.params.id);

  if (!academicYear) {
    res.status(404);
    throw new Error("Academic year not found");
  }

  if (academicYear.isCurrent) {
    res.status(400);
    throw new Error("Cannot delete current academic year");
  }

  // TODO: Check if there are any classes, sections, etc. associated with this academic year

  await academicYear.remove();
  res.json({ message: "Academic year removed" });
});

export {
  createAcademicYear,
  getAcademicYears,
  getCurrentAcademicYear,
  setCurrentAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};