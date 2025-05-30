import express from "express";
import {
  createAcademicCalendarEvent,
  getAcademicCalendarEvents,
  getAcademicCalendarEventById,
  updateAcademicCalendarEvent,
  deleteAcademicCalendarEvent,
} from "../controller/academicCalendarController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post( createAcademicCalendarEvent)
  .get(protect, getAcademicCalendarEvents);
router
  .route("/:id")
  .get(protect, getAcademicCalendarEventById)
  .put(protect, admin, updateAcademicCalendarEvent)
  .delete(protect, admin, deleteAcademicCalendarEvent);

export default router;