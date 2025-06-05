import mongoose from 'mongoose';
import {
  createTimeSlotService,
  getTimeSlotByIdService,
  updateTimeSlotService,
  deleteTimeSlotService,
  getAllTimeSlotsService,
  createDailyTimetableService,
  getDailyTimetableByIdService,
  updateDailyTimetableService,
  deleteDailyTimetableService,
  createClassTimetableService,
  getClassTimetableByIdService,
  updateClassTimetableService,
  deleteClassTimetableService,
  getClassTimetableByClassService,
  getTeacherTimetableService,
  validateTimetableConflictsService,
  assignSubstituteTeacherService,
  getRoomAssignmentsService,
  getTimetableConflictsService,
  bulkCreateTimeSlotsService
} from '../services/timetable.service.js';

// TimeSlot Controllers
export const createTimeSlot = async (req, res) => {
  try {
    const timeSlot = await createTimeSlotService(req.body);
    res.status(201).json({
      success: true,
      message: 'Time slot created successfully',
      data: timeSlot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create time slot',
      error: error.message
    });
  }
};

export const getTimeSlot = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const timeSlot = await getTimeSlotByIdService(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    res.status(200).json(timeSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTimeSlot = async (req, res) => {
  try {
    const updatedSlot = await updateTimeSlotService(req.params.id, req.body);
    if (!updatedSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    res.status(200).json(updatedSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTimeSlot = async (req, res) => {
  try {
    const deletedSlot = await deleteTimeSlotService(req.params.id);
    if (!deletedSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    res.status(200).json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await getAllTimeSlotsService();
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkCreateTimeSlots = async (req, res) => {
  try {
    const result = await bulkCreateTimeSlotsService(req.body);
    res.status(201).json({
      success: true,
      message: `${result.insertedCount} time slots created successfully`,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create time slots',
      error: error.message
    });
  }
};

// DailyTimetable Controllers
export const createDailyTimetable = async (req, res) => {
  try {
    const dailyTimetable = await createDailyTimetableService(req.body);
    res.status(201).json(dailyTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDailyTimetable = async (req, res) => {
  try {
    const dailyTimetable = await getDailyTimetableByIdService(req.params.id);
    if (!dailyTimetable) {
      return res.status(404).json({ message: 'Daily timetable not found' });
    }
    res.status(200).json(dailyTimetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDailyTimetable = async (req, res) => {
  try {
    const updatedDailyTimetable = await updateDailyTimetableService(
      req.params.id,
      req.body
    );
    if (!updatedDailyTimetable) {
      return res.status(404).json({ message: 'Daily timetable not found' });
    }
    res.status(200).json(updatedDailyTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDailyTimetable = async (req, res) => {
  try {
    const deletedDailyTimetable = await deleteDailyTimetableService(req.params.id);
    if (!deletedDailyTimetable) {
      return res.status(404).json({ message: 'Daily timetable not found' });
    }
    res.status(200).json({ message: 'Daily timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createClassTimetable = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { classId, sectionId, academicYearId, timetable, effectiveFrom } = req.body;
    
    // First validate for conflicts
    const conflicts = await validateTimetableConflictsService({
      timetableData: timetable,
      classId,
      sectionId,
      academicYearId
    });

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Timetable conflicts detected',
        conflicts
      });
    }

    const newTimetable = await createClassTimetableService({
      classId,
      sectionId,
      academicYearId,
      timetable,
      effectiveFrom,
      createdBy: req.userId
    }, { session });

    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      message: 'Class timetable created successfully',
      data: newTimetable
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: 'Failed to create class timetable',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

export const getClassTimetable = async (req, res) => {
  try {
    const timetable = await getClassTimetableByIdService(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Class timetable not found' });
    }
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClassTimetable = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { timetable, effectiveFrom, effectiveTill, isActive } = req.body;
    
    // Validate conflicts if timetable is being updated
    if (timetable) {
      const existingTimetable = await getClassTimetableByIdService(req.params.id);
      const conflicts = await validateTimetableConflictsService({
        timetableData: timetable,
        classId: existingTimetable.class,
        sectionId: existingTimetable.section,
        academicYearId: existingTimetable.academicYear,
        excludeTimetableId: req.params.id
      });

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Timetable conflicts detected',
          conflicts
        });
      }
    }

    const updatedTimetable = await updateClassTimetableService(
      req.params.id,
      { timetable, effectiveFrom, effectiveTill, isActive },
      { session }
    );

    if (!updatedTimetable) {
      return res.status(404).json({ message: 'Class timetable not found' });
    }

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      message: 'Class timetable updated successfully',
      data: updatedTimetable
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: 'Failed to update class timetable',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

export const deleteClassTimetable = async (req, res) => {
  try {
    const deletedTimetable = await deleteClassTimetableService(req.params.id);
    if (!deletedTimetable) {
      return res.status(404).json({ message: 'Class timetable not found' });
    }
    res.status(200).json({ message: 'Class timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Specialized Controllers
export const getClassTimetableByClass = async (req, res) => {
  try {
    const { classId, sectionId, academicYearId } = req.params;
    const timetable = await getClassTimetableByClassService(
      classId,
      sectionId,
      academicYearId
    );
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found for this class' });
    }
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Both startDate and endDate query parameters are required' 
      });
    }

    const timetable = await getTeacherTimetableService(
      teacherId,
      new Date(startDate),
      new Date(endDate)
    );
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateTimetableConflicts = async (req, res) => {
  try {
    const { timetableData, classId, sectionId, academicYearId } = req.body;
    const conflicts = await validateTimetableConflictsService({
      timetableData,
      classId,
      sectionId,
      academicYearId
    });
    res.status(200).json({
      hasConflicts: conflicts.length > 0,
      conflicts,
      count: conflicts.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignSubstituteTeacher = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { timetableId, dayId, slotId } = req.params;
    const { teacherId, reason } = req.body;

    const result = await assignSubstituteTeacherService(
      timetableId,
      dayId,
      slotId,
      teacherId,
      reason,
      { session }
    );

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      message: 'Substitute teacher assigned successfully',
      data: result
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: 'Failed to assign substitute teacher',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};


export const getTimetableConflicts = async (req, res) => {
  try {
    const { timetableId } = req.params;
    const conflicts = await getTimetableConflictsService(timetableId);
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
