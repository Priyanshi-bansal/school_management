import express from "express";
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  getTest,
  testResult,
  getAttendance,
  getAttendanceBySubject,
  getAttendanceByStudent,
  getSubject
  
} from "../controller/studentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", studentLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateStudent);
router.post("/gettest", auth, getTest);
router.post("/testresult", auth, testResult);
router.post("/attendance", auth, getAttendance);
router.post("/attendancebysubject", auth, getAttendanceBySubject);
router.post("/attendancebystudent", auth, getAttendanceByStudent);
router.post("/getsubject", auth, getSubject);

export default router;
