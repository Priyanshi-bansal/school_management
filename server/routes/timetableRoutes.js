// routes/timetable/timetableRoutes.js
import express from 'express';
import {
  createTimeSlots,
  getTimeSlots,
  createUpdateClassTimetable,
  getClassTimetable,
  getTeacherTimetable
} from '../controller/timetableController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/slots')
  .post(protect, admin, createTimeSlots)
  .get(protect, getTimeSlots);

router.route('/')
  .post(protect, admin, createUpdateClassTimetable)
  .get(protect, getClassTimetable);

router.route('/teacher/:id')
  .get(protect, getTeacherTimetable);

export default router;