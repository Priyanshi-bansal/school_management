import express from "express";
import {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
  assignSectionTeacher,
  addStudentToSection,
  removeStudentFromSection,
} from "../controller/sectionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createSection)
  .get(protect, admin, getSections);
router
  .route("/:id")
  .get(protect, admin, getSectionById)
  .put(protect, admin, updateSection)
  .delete(protect, admin, deleteSection);
router
  .route("/:id/assign-teacher")
  .put(protect, admin, assignSectionTeacher);
router
  .route("/:id/add-student")
  .put(protect, admin, addStudentToSection);
router
  .route("/:id/remove-student")
  .put(protect, admin, removeStudentFromSection);

export default router;
