import express from 'express';
import {
  createTimeSlot,
  getTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  getAllTimeSlots,
  bulkCreateTimeSlots,
  createDailyTimetable,
  getDailyTimetable,
  updateDailyTimetable,
  deleteDailyTimetable,
  createClassTimetable,
  getClassTimetable,
  updateClassTimetable,
  deleteClassTimetable,
  getClassTimetableByClass,
  getTeacherTimetable,
  validateTimetableConflicts,
  assignSubstituteTeacher,
  getTimetableConflicts
} from '../controller/timetableController.js';
import auth  from '../middleware/auth.js';

const router = express.Router();

// TimeSlot Routes
router.post('/timeslots', auth, createTimeSlot);
router.get('/timeslots', auth, getAllTimeSlots);
router.get('/timeslots/:id', auth, getTimeSlot);
router.put('/timeslots/:id', auth, updateTimeSlot);
router.delete('/timeslots/:id', auth, deleteTimeSlot);
router.post('/timeslots/bulk', auth, bulkCreateTimeSlots);

// DailyTimetable Routes
router.post('/daily', auth, createDailyTimetable);
router.get('/daily/:id', auth, getDailyTimetable);
router.put('/daily/:id', auth, updateDailyTimetable);
router.delete('/daily/:id', auth, deleteDailyTimetable);

// ClassTimetable Routes
router.post('/classes', auth, createClassTimetable);
router.get('/classes/:id', auth, getClassTimetable);
router.put('/classes/:id', auth, updateClassTimetable);
router.delete('/classes/:id', auth, deleteClassTimetable);

// Specialized Routes
router.get('/classes/:classId/:sectionId/:academicYearId', auth, getClassTimetableByClass);
router.get('/teachers/:teacherId/schedule', auth, getTeacherTimetable);
router.post('/validate', auth, validateTimetableConflicts);
router.patch('/:timetableId/days/:dayId/slots/:slotId/substitute', auth, assignSubstituteTeacher);
router.get('/:timetableId/conflicts', auth, getTimetableConflicts);

export default router;