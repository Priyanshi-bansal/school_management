import express from "express";
import {
  facultyLogin,
  updatedPassword,
  updateFaculty,
  getStudent,
  

} from "../controller/facultyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", facultyLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateFaculty);
// router.post("/createtest", auth, createTest);
// router.post("/gettest", auth, getTest);
router.post("/getstudent", auth, getStudent);
// router.get("/getalltest", auth, getAllTest);
// router.post("/uploadmarks", auth, uploadMarks);
// router.post("/getmarks", auth, getMarks);
// router.post("/getmarksbystudent", auth, getMarksByStudent);
// router.post("/getmarksbytest", auth, getMarksByTest);
// router.post("/getmarksbystudentandtest", auth, getMarksByStudentAndTest);
// router.post("/getmarksbydepartment", auth, getMarksByDepartment);

export default router;
