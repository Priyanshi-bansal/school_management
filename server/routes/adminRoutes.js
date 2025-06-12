import express from "express";
import auth from "../middleware/auth.js";
import {
  adminLogin,
  updateAdmin,
  addAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  getStudent,
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllSubject,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  getOrganizationIPs, addOrganizationIP, deleteOrganizationIP
} from "../controller/adminController.js";
const router = express.Router();
console.log("Routes Page");
router.post("/login", adminLogin);
router.post("/updatepassword", auth, updatedPassword);
router.get("/getallstudent", auth, getAllStudent);
router.get("/getallfaculty", auth, getAllFaculty);
router.get("/getallsubject", auth, getAllSubject);
router.get("/getalladmin", auth, getAllAdmin);
router.post("/updateprofile", auth, updateAdmin);
router.post("/addadmin", addAdmin);
router.post("/addfaculty", auth, addFaculty);
router.post("/getfaculty", auth, getFaculty);
router.post("/addsubject", auth, addSubject);
router.post("/getsubject", auth, getSubject);
router.post("/addstudent", auth, addStudent);
router.post("/getstudent", auth, getStudent);

router.post("/getadmin", auth, getAdmin);
router.post("/deleteadmin", auth, deleteAdmin);
router.post("/deletefaculty", auth, deleteFaculty);
router.post("/deletestudent", auth, deleteStudent);
router.post("/deletesubject", auth, deleteSubject);
router.get("/getorganizationips", auth, getOrganizationIPs);
router.post("/addorganizationip", auth, addOrganizationIP); 
router.post("/deleteorganizationip", auth, deleteOrganizationIP);

export default router;
