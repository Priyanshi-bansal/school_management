// routes/academic/syllabusRoutes.js
import express from 'express';
import {
  createSyllabus,
  getAllSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus,
  addChapter,
  updateChapter,
  deleteChapter,
  addTopic,
  updateTopic,
  deleteTopic,
  toggleTopicCompletion,
  addAssessment,
  updateAssessment,
  deleteAssessment,
  getSyllabusProgress,
  getChapterProgress,
  getSyllabusByFilters,
  cloneSyllabus,
  getStudentSyllabus,
  completeTopics

} from '../controller/syllabusController.js';
import { protect, admin, faculty } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSyllabus);
router.get('/all', protect, getAllSyllabus);  
router.get('/:id', protect, getSyllabus);
router.put('/:id', protect, faculty, updateSyllabus);
router.delete('/:id', protect, faculty, deleteSyllabus);
router.post('/:id/chapters', protect, faculty, addChapter);
router.put('/:id/chapters/:chapterId', protect, faculty, updateChapter);
router.delete('/:id/chapters/:chapterId', protect, faculty, deleteChapter);
router.post('/:id/chapters/:chapterId/topics', protect, faculty, addTopic);
router.put('/:id/chapters/:chapterId/topics/:topicId', protect, faculty, updateTopic);
router.delete('/:id/chapters/:chapterId/topics/:topicId', protect, faculty, deleteTopic);
router.post('/:id/chapters/:chapterId/topics/:topicId/toggle-completion', protect, faculty, toggleTopicCompletion);
router.post('/:id/chapters/:chapterId/assessments', protect, faculty, addAssessment);
router.put('/:id/chapters/:chapterId/assessments/:assessmentId', protect, faculty, updateAssessment);
router.delete('/:id/chapters/:chapterId/assessments/:assessmentId', protect, faculty, deleteAssessment);
router.get('/:id/progress', protect, getSyllabusProgress);
router.get('/:id/chapters/:chapterId/progress', protect, getChapterProgress);
router.get('/filters', protect, getSyllabusByFilters);
router.post('/:id/clone', protect, faculty, cloneSyllabus);
router.get('/:id/student', protect, getStudentSyllabus);
router.post('/:id/chapters/:chapterId/topics/:topicId/complete', protect, faculty, completeTopics);

export default router;