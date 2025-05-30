// controllers/academicCalendarController.js
import AcademicCalendar from "../models/AcademicCalendar.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new academic calendar event
// @route   POST /api/academic-calendar
// @access  Private/Admin
const createAcademicCalendarEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    academicYear,
    eventType,
    forClass,
    forSection,
    isImportant,
  } = req.body;

  const event = await AcademicCalendar.create({
    title,
    description,
    startDate,
    endDate,
    academicYear,
    eventType,
    forClass,
    forSection,
    isImportant: isImportant || false,
    createdBy: req.user._id,
  });

  res.status(201).json(event);
});

// @desc    Get all academic calendar events
// @route   GET /api/academic-calendar
// @access  Private
const getAcademicCalendarEvents = asyncHandler(async (req, res) => {
  const { academicYear, eventType, forClass, forSection, startDate, endDate } =
    req.query;

  let query = {};

  if (academicYear) {
    query.academicYear = academicYear;
  } else {
    // Default to current academic year if not specified
    const currentAcademicYear = await AcademicYear.findOne({ isCurrent: true });
    if (currentAcademicYear) {
      query.academicYear = currentAcademicYear._id;
    }
  }

  if (eventType) {
    query.eventType = eventType;
  }
  if (forClass) {
    query.forClass = forClass;
  }
  if (forSection) {
    query.forSection = forSection;
  }
  if (startDate && endDate) {
    query.$or = [
      {
        startDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
      {
        endDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
      {
        $and: [
          { startDate: { $lte: new Date(startDate) } },
          { endDate: { $gte: new Date(endDate) } },
        ],
      },
    ];
  } else if (startDate) {
    query.endDate = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.startDate = { $lte: new Date(endDate) };
  }

  const events = await AcademicCalendar.find(query)
    .populate("academicYear", "name")
    .populate("forClass", "name")
    .populate("forSection", "name")
    .populate("createdBy", "name")
    .sort("startDate");

  res.json(events);
});

// @desc    Get academic calendar event by ID
// @route   GET /api/academic-calendar/:id
// @access  Private
const getAcademicCalendarEventById = asyncHandler(async (req, res) => {
  const event = await AcademicCalendar.findById(req.params.id)
    .populate("academicYear", "name")
    .populate("forClass", "name")
    .populate("forSection", "name")
    .populate("createdBy", "name");

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.json(event);
});

// @desc    Update academic calendar event
// @route   PUT /api/academic-calendar/:id
// @access  Private/Admin
const updateAcademicCalendarEvent = asyncHandler(async (req, res) => {
  const event = await AcademicCalendar.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  event.title = req.body.title || event.title;
  event.description = req.body.description || event.description;
  event.startDate = req.body.startDate || event.startDate;
  event.endDate = req.body.endDate || event.endDate;
  event.eventType = req.body.eventType || event.eventType;
  event.forClass = req.body.forClass || event.forClass;
  event.forSection = req.body.forSection || event.forSection;
  event.isImportant =
    req.body.isImportant !== undefined ? req.body.isImportant : event.isImportant;

  const updatedEvent = await event.save();

  res.json(updatedEvent);
});

// @desc    Delete academic calendar event
// @route   DELETE /api/academic-calendar/:id
// @access  Private/Admin
const deleteAcademicCalendarEvent = asyncHandler(async (req, res) => {
  const event = await AcademicCalendar.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  await event.remove();
  res.json({ message: "Event removed" });
});

export {
  createAcademicCalendarEvent,
  getAcademicCalendarEvents,
  getAcademicCalendarEventById,
  updateAcademicCalendarEvent,
  deleteAcademicCalendarEvent,
};