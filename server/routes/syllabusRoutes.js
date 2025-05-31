// routes/academic/syllabusRoutes.js
import express from 'express';
import {
  createUpdateSyllabus,
  getSyllabus,
  getClassSyllabi,
  getSyllabusProgress,
  updateTopicStatus
} from '../controller/syllabusController.js';
import { protect, admin, faculty } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, faculty, createUpdateSyllabus)
  .get(protect, getSyllabus);

router.route('/class')
  .get(protect, getClassSyllabi);

router.route('/progress')
  .get(protect, faculty, getSyllabusProgress);

router.route('/topic')
  .put(protect, faculty, updateTopicStatus);

export default router;