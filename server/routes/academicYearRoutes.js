import express from "express";
import {
  createAcademicYear,
  getAcademicYears,
  getCurrentAcademicYear,
  setCurrentAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../controller/academicYearController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createAcademicYear)
  .get(protect, admin, getAcademicYears);
router.route("/current").get(protect, getCurrentAcademicYear);
router
  .route("/:id/set-current")
  .put(protect, admin, setCurrentAcademicYear);
router
  .route("/:id")
  .put(protect, admin, updateAcademicYear)
  .delete(protect, admin, deleteAcademicYear);

export default router;