// controllers/timetable/timetableController.js
import ClassTimetable from "../models/classTimetableModel.js";
import DailyTimetable from "../models/dailyTimetableModel.js";
import TimeSlot from "../models/timeSlotModel.js";
import Class from "../models/Class.js";
import Section from "../models/Section.js";
import Subject from "../models/subject.js";
import Faculty from "../models/faculty.js";
import asyncHandler from "express-async-handler";

const createTimeSlots = asyncHandler(async (req, res) => {
  const { slots } = req.body;

  if (!slots || !Array.isArray(slots)) {
    res.status(400).send("Invalid time slots format");
  }

  // Validate each slot
  for (const slot of slots) {
    if (!slot.startTime || !slot.endTime || !slot.periodNumber) {
      res.status(400);
      throw new Error(
        "Each slot must have startTime, endTime and periodNumber"
      );
    }
  }

  // Delete existing slots
  await TimeSlot.deleteMany({});

  // Create new slots
  const createdSlots = await TimeSlot.insertMany(slots);

  res.status(201).json({
    status: "success",
    data: createdSlots,
  });
});

// @desc    Get all time slots
// @route   GET /api/timetable/slots
// @access  Private
const getTimeSlots = asyncHandler(async (req, res) => {
  const slots = await TimeSlot.find().sort("periodNumber");

  res.json({
    status: "success",
    data: slots,
  });
});

// @desc    Create/update class timetable
// @route   POST /api/timetable
// @access  Private/Admin
const createUpdateClassTimetable = asyncHandler(async (req, res) => {
  const {
    class: classId,
    section,
    academicYear,
    timetable,
    effectiveFrom,
  } = req.body;

  // Validate inputs
  if (!classId || !academicYear || !timetable || !effectiveFrom) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if class exists
  const classExists = await Class.findById(classId);
  if (!classExists) {
    res.status(404);
    throw new Error("Class not found");
  }

  // Check if section exists if provided
  if (section) {
    const sectionExists = await Section.findById(section);
    if (!sectionExists) {
      res.status(404);
      throw new Error("Section not found");
    }
  }

  // Validate timetable structure
  if (!Array.isArray(timetable)) {
    res.status(400);
    throw new Error("Timetable must be an array of daily timetables");
  }

  // Validate each day's timetable
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const teacherConflicts = {};

  for (const dayTimetable of timetable) {
    if (!days.includes(dayTimetable.day)) {
      res.status(400);
      throw new Error(`Invalid day: ${dayTimetable.day}`);
    }

    if (!Array.isArray(dayTimetable.slots)) {
      res.status(400);
      throw new Error(`Slots for ${dayTimetable.day} must be an array`);
    }

    for (const slot of dayTimetable.slots) {
      if (!slot.slot || !slot.periodNumber) {
        res.status(400);
        throw new Error(`Invalid slot ID for ${dayTimetable.day}`);
      }

      // Check if slot exists
      const slotExists = await TimeSlot.findById(slot.slot);
      if (!slotExists) {
        res.status(404);
        throw new Error(`Time slot not found: ${slot.slot}`);
      }

      // If subject is assigned, validate it
      if (slot.subject) {
        return res.status(400).send("Subject ID is required for each slot");
      }
      const subjectExists = await Subject.findById(slot.subject);
      if (!subjectExists) {
        res.status(404);
        throw new Error(`Subject not found: ${slot.subject}`);
      }

      // If teacher is assigned, validate and check for conflicts
      if (slot.teacher) {
        return res.status(400).send("Teacher ID is required for each slot");
      }
      const teacherExists = await Faculty.findById(slot.teacher);
      if (!teacherExists) {
        res.status(404);
        throw new Error(`Teacher not found: ${slot.teacher}`);
      }
    }
  }

  // Deactivate any existing active timetable for this class/section
  await ClassTimetable.updateMany(
    {
      class: classId,
      section: section || null,
      isActive: true,
    },
    { $set: { isActive: false } }
  );

  // Create daily timetables
  const dailyTimetables = await DailyTimetable.insertMany(timetable);

  // Create class timetable
  const newTimetable = await ClassTimetable.create({
    class: classId,
    section: section || null,
    academicYear,
    timetable: dailyTimetables.map((dt) => dt._id),
    effectiveFrom: new Date(effectiveFrom),
    isActive: true,
  });

  // Populate the response
  const populatedTimetable = await ClassTimetable.findById(newTimetable._id)
    .populate({
      path: "timetable",
      populate: {
        path: "slots.slot slots.subject slots.teacher",
        select: "startTime endTime periodNumber name subjectName",
      },
    })
    .populate("class section", "name");

  res.status(201).json({
    status: "success",
    data: populatedTimetable,
  });
});

// @desc    Get class timetable
// @route   GET /api/timetable
// @access  Private
const getClassTimetable = asyncHandler(async (req, res) => {
  const { class: classId, section, academicYear } = req.query;

  // Validate inputs
  if (!classId) {
    res.status(400);
    throw new Error("Class ID is required");
  }

  const query = {
    class: classId,
    isActive: true,
  };

  if (section) {
    query.section = section;
  } else {
    query.section = null;
  }

  if (academicYear) {
    query.academicYear = academicYear;
  } else {
    // Get current academic year if not specified
    const currentYear = await AcademicYear.findOne({ isCurrent: true });
    if (currentYear) {
      query.academicYear = currentYear._id;
    }
  }

  const timetable = await ClassTimetable.findOne(query)
    .populate({
      path: "timetable",
      populate: {
        path: "slots.slot slots.subject slots.teacher",
        select: "startTime endTime periodNumber name subjectName",
      },
    })
    .populate("class section", "name");

  if (!timetable) {
    res.status(404);
    throw new Error("Timetable not found");
  }

  res.json({
    status: "success",
    data: timetable,
  });
});

// @desc    Get teacher timetable
// @route   GET /api/timetable/teacher/:id
// @access  Private
const getTeacherTimetable = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;

  // Check if teacher exists
  const teacher = await Faculty.findById(teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  // Find all active timetables where this teacher is assigned
  const timetables = await ClassTimetable.find({
    isActive: true,
    "timetable.slots.teacher": teacherId,
  })
    .populate({
      path: "timetable",
      match: { "slots.teacher": teacherId },
      populate: {
        path: "slots.slot slots.subject",
        match: { "slots.teacher": teacherId },
      },
    })
    .populate("class section", "name");

  // Format the data for easier consumption
  const formattedTimetable = timetables.flatMap((ct) =>
    ct.timetable.flatMap((dt) =>
      dt.slots
        .filter((slot) => slot.teacher?.toString() === teacherId)
        .map((slot) => ({
          day: dt.day,
          class: ct.class.name,
          section: ct.section?.name || "All",
          period: slot.slot.periodNumber,
          startTime: slot.slot.startTime,
          endTime: slot.slot.endTime,
          subject: slot.subject?.subjectName || "N/A",
          room: slot.room || "N/A",
        }))
    )
  );

  res.json({
    status: "success",
    data: {
      teacher: {
        id: teacher._id,
        name: teacher.name,
      },
      timetable: formattedTimetable,
    },
  });
});

export {
  createTimeSlots,
  getTimeSlots,
  createUpdateClassTimetable,
  getClassTimetable,
  getTeacherTimetable,
};
