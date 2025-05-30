import express from "express";
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignClassTeacher,
} from "../controller/classController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createClass)
  .get(protect, admin, getClasses);
router
  .route("/:id")
  .get(protect, admin, getClassById)
  .put(protect, admin, updateClass)
  .delete(protect, admin, deleteClass);
router
  .route("/:id/assign-teacher")
  .put(protect, admin, assignClassTeacher);

export default router;
