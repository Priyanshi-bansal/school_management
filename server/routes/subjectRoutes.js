import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignSubjectToClass,
  getClassSubjects,
  assignTeacherToClassSubject,
  updateClassSubjectSyllabus,
} from "../controller/subjectController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createSubject)
  .get(protect, admin, getSubjects);
router
  .route("/:id")
  .get(protect, admin, getSubjectById)
  .put(protect, admin, updateSubject)
  .delete(protect, admin, deleteSubject);

// Class subject routes
router
  .route("/class-subjects")
  .post(protect, admin, assignSubjectToClass)
  .get(protect, admin, getClassSubjects);
router
  .route("/class-subjects/:id/assign-teacher")
  .put(protect, admin, assignTeacherToClassSubject);
router
  .route("/class-subjects/:id/syllabus")
  .put(protect, admin, updateClassSubjectSyllabus);

export default router;