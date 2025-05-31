import express from "express";
import {
  markAttendance,
  getAttendance,
  getAttendanceByStudent,
  editAttendance,
  deleteAttendance,
  getFacultyAttendance
} from "../controller/attandanceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/markattendance", auth, markAttendance);
router.post("/getAttendance", auth, getAttendance);
router.post("/getattendancebystudent", auth, getAttendanceByStudent);
router.post("/editattendance", auth, editAttendance);
router.post("/deleteattendance", auth, deleteAttendance);
router.post("/getfacultyattendance", auth, getFacultyAttendance);

export default router;
