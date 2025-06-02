import express from 'express';
import {
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
} from '../controller/timetableController.js';

const router = express.Router();

// TimeSlot routes
router.post('/timeslots', createTimeSlot);
router.get('/timeslots', getTimeSlots);
router.get('/timeslots/:id', getTimeSlotById);
router.put('/timeslots/:id', updateTimeSlot);
router.delete('/timeslots/:id', deleteTimeSlot);

// DailyTimetable routes
router.post('/dailytimetables', createDailyTimetable);
router.get('/dailytimetables/:id', getDailyTimetableById);
router.put('/dailytimetables/:id', updateDailyTimetable);

// ClassTimetable routes
router.post('/classtimetables', createClassTimetable);
router.get('/classtimetables', getClassTimetables);
router.get('/classtimetables/:id', getClassTimetableById);
router.put('/classtimetables/:id', updateClassTimetable);
router.delete('/classtimetables/:id', deleteClassTimetable);

// Special routes
router.get('/class/:classId/section/:sectionId', getClassTimetable);
router.get('/teacher/:teacherId', getTeacherTimetable);

export default router;