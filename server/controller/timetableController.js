import mongoose from 'mongoose';
import ClassTimetable from '../models/classTimetableModel.js';
import DailyTimetable from '../models/dailyTimetableModel.js';
import TimeSlot from '../models/timeSlotModel.js';

// TimeSlot Controllers
const createTimeSlot = async (req, res) => {
  try {
    const { startTime, endTime, periodNumber, isBreak, breakName } = req.body;
    
    if (isBreak && !breakName) {
      return res.status(400).json({ message: "Break name is required for break slots" });
    }

    const newSlot = new TimeSlot({
      startTime,
      endTime,
      periodNumber,
      isBreak,
      breakName: isBreak ? breakName : undefined
    });

    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTimeSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find().sort({ periodNumber: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTimeSlotById = async (req, res) => {
  try {

    const slot = await TimeSlot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimeSlot = async (req, res) => {
  try {

    const { startTime, endTime, periodNumber, isBreak, breakName } = req.body;
    
    if (isBreak && !breakName) {
      return res.status(400).json({ message: "Break name is required for break slots" });
    }

    const updatedSlot = await TimeSlot.findByIdAndUpdate(
      req.params.id,
      {
        startTime,
        endTime,
        periodNumber,
        isBreak,
        breakName: isBreak ? breakName : undefined
      },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    res.json(updatedSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTimeSlot = async (req, res) => {
  try {

    const slot = await TimeSlot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    res.json({ message: "Time slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Daily Timetable Controllers
const createDailyTimetable = async (req, res) => {
  try {
    const { day, slots } = req.body;

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day" });
    }

    for (const slot of slots) {
      if (slot.subject) {
        return res.status(400).json({ message: "Invalid subject ID" });
      }
      if (slot.teacher) {
        return res.status(400).json({ message: "Invalid teacher ID" });
      }
    }

    const newDailyTimetable = new DailyTimetable({
      day,
      slots
    });

    await newDailyTimetable.save();
    res.status(201).json(newDailyTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDailyTimetableById = async (req, res) => {
  try {

    const dailyTimetable = await DailyTimetable.findById(req.params.id)
      .populate('slots.slot')
      .populate('slots.subject')
      .populate('slots.teacher');

    if (!dailyTimetable) {
      return res.status(404).json({ message: "Daily timetable not found" });
    }
    res.json(dailyTimetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDailyTimetable = async (req, res) => {
  try {

    const { day, slots } = req.body;

    const updatedDailyTimetable = await DailyTimetable.findByIdAndUpdate(
      req.params.id,
      { day, slots },
      { new: true }
    ).populate('slots.slot')
     .populate('slots.subject')
     .populate('slots.teacher');

    if (!updatedDailyTimetable) {
      return res.status(404).json({ message: "Daily timetable not found" });
    }

    res.json(updatedDailyTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Class Timetable Controllers
const createClassTimetable = async (req, res) => {
  try {
    const { class: classId, section, academicYear, timetable, effectiveFrom, effectiveTill, isActive, createdBy } = req.body;

    if (!classId || !academicYear || !effectiveFrom || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const idsToValidate = [
      { value: classId, name: 'Class' },
      { value: academicYear, name: 'AcademicYear' },
      { value: createdBy, name: 'Admin' }
    ];

    const existingTimetable = await ClassTimetable.findOne({
      class: classId,
      section: section || { $exists: false },
      academicYear,
      isActive: true
    });

    if (existingTimetable) {
      return res.status(400).json({ 
        message: "An active timetable already exists for this class/section and academic year" 
      });
    }

    const newClassTimetable = new ClassTimetable({
      class: classId,
      section,
      academicYear,
      timetable,
      effectiveFrom,
      effectiveTill,
      isActive,
      createdBy
    });

    await newClassTimetable.save();
    res.status(201).json(newClassTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getClassTimetables = async (req, res) => {
  try {
    const { classId, sectionId, academicYearId, isActive } = req.query;
    const filter = {};

    if (classId) filter.class = classId;
    if (sectionId) filter.section = sectionId;
    if (academicYearId) filter.academicYear = academicYearId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const timetables = await ClassTimetable.find(filter)
      .populate('class')
      .populate('section')
      .populate('academicYear')
      .populate('timetable')
      .populate('createdBy', 'name email');

    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassTimetableById = async (req, res) => {
  try {

    const timetable = await ClassTimetable.findById(req.params.id)
      .populate('class')
      .populate('section')
      .populate('academicYear')
      .populate({
        path: 'timetable',
        populate: {
          path: 'slots.slot slots.subject slots.teacher',
          select: 'startTime endTime periodNumber name email'
        }
      })
      .populate('createdBy', 'name email');

    if (!timetable) {
      return res.status(404).json({ message: "Class timetable not found" });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClassTimetable = async (req, res) => {
  try {

    const { timetable, effectiveFrom, effectiveTill, isActive } = req.body;

    const updatedTimetable = await ClassTimetable.findByIdAndUpdate(
      req.params.id,
      { timetable, effectiveFrom, effectiveTill, isActive },
      { new: true }
    )
    .populate('class')
    .populate('section')
    .populate('academicYear')
    .populate({
      path: 'timetable',
      populate: {
        path: 'slots.slot slots.subject slots.teacher',
        select: 'startTime endTime periodNumber name email'
      }
    });

    if (!updatedTimetable) {
      return res.status(404).json({ message: "Class timetable not found" });
    }

    res.json(updatedTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteClassTimetable = async (req, res) => {
  try {

    const timetable = await ClassTimetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: "Class timetable not found" });
    }
    res.json({ message: "Class timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get timetable for a specific class and section
 * @route GET /api/timetable/class/:classId/section/:sectionId
 * @access Public
 */
const getClassTimetable = async (req, res) => {
  try {
    const { classId, sectionId } = req.params;
    const { academicYearId } = req.query;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(classId) || 
        !mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ message: "Invalid class or section ID" });
    }

    if (academicYearId && !mongoose.Types.ObjectId.isValid(academicYearId)) {
      return res.status(400).json({ message: "Invalid academic year ID" });
    }

    // Build filter
    const filter = {
      class: classId,
      section: sectionId,
      isActive: true
    };

    if (academicYearId) {
      filter.academicYear = academicYearId;
    }

    // Find timetable with full population
    const timetable = await ClassTimetable.findOne(filter)
      .populate('class', 'name code')
      .populate('section', 'name')
      .populate('academicYear', 'name year')
      .populate({
        path: 'timetable',
        populate: {
          path: 'slots.slot slots.subject slots.teacher',
          select: 'startTime endTime periodNumber name code email'
        }
      });

    if (!timetable) {
      return res.status(404).json({ 
        message: "No active timetable found for this class/section" 
      });
    }

    // Format the response
    const formattedTimetable = {
      class: timetable.class,
      section: timetable.section,
      academicYear: timetable.academicYear,
      effectiveFrom: timetable.effectiveFrom,
      effectiveTill: timetable.effectiveTill,
      days: timetable.timetable.map(day => ({
        day: day.day,
        slots: day.slots.map(slot => ({
          period: slot.slot.periodNumber,
          startTime: slot.slot.startTime,
          endTime: slot.slot.endTime,
          isBreak: slot.slot.isBreak,
          breakName: slot.slot.breakName,
          subject: slot.subject,
          teacher: slot.teacher,
          room: slot.room
        }))
      }))
    };

    res.json(formattedTimetable);

  } catch (error) {
    console.error('Error fetching class timetable:', error);
    res.status(500).json({ 
      message: "Server error while fetching timetable",
      error: error.message 
    });
  }
};

/**
 * @desc Get timetable for a specific teacher
 * @route GET /api/timetable/teacher/:teacherId
 * @access Public
 */
const getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { academicYearId } = req.query;

    // Validate teacher ID
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    if (academicYearId && !mongoose.Types.ObjectId.isValid(academicYearId)) {
      return res.status(400).json({ message: "Invalid academic year ID" });
    }

    // Build filter
    const filter = { 
      isActive: true,
      'timetable.slots.teacher': teacherId 
    };

    if (academicYearId) {
      filter.academicYear = academicYearId;
    }

    // Find all timetables where the teacher has classes
    const timetables = await ClassTimetable.find(filter)
      .populate('class', 'name code')
      .populate('section', 'name')
      .populate('academicYear', 'name year')
      .populate({
        path: 'timetable',
        populate: {
          path: 'slots.slot slots.subject slots.teacher',
          match: { 'slots.teacher': teacherId },
          select: 'startTime endTime periodNumber name code email'
        }
      });

    // Format the response
    const teacherTimetable = timetables
      .filter(timetable => timetable.timetable.some(day => day.slots.length > 0))
      .map(timetable => {
        const daysWithClasses = timetable.timetable
          .filter(day => day.slots.length > 0)
          .map(day => ({
            day: day.day,
            classes: day.slots.map(slot => ({
              period: slot.slot.periodNumber,
              startTime: slot.slot.startTime,
              endTime: slot.slot.endTime,
              subject: slot.subject,
              class: timetable.class.name,
              section: timetable.section?.name || 'All',
              room: slot.room
            }))
          }));

        return {
          academicYear: timetable.academicYear,
          class: timetable.class,
          section: timetable.section,
          schedule: daysWithClasses
        };
      });

    if (teacherTimetable.length === 0) {
      return res.status(404).json({ 
        message: "No classes found for this teacher" 
      });
    }

    res.json(teacherTimetable);

  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    res.status(500).json({ 
      message: "Server error while fetching teacher timetable",
      error: error.message 
    });
  }
};

export {
  createTimeSlot,
  getTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot,
  createDailyTimetable,
  getDailyTimetableById,
  updateDailyTimetable,
  createClassTimetable,
  getClassTimetables,
  getClassTimetableById,
  updateClassTimetable,
  deleteClassTimetable,
  getClassTimetable,
  getTeacherTimetable
};