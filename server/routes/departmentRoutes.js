import express from "express";
import { addDepartment, deleteDepartment, updateDepartment, getAllDepartment, getDepartmentById } from "../controller/departmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add-department", addDepartment);
router.post("/delete-department", auth, deleteDepartment);
router.post("/update-department", auth, updateDepartment);
router.get("/get-all-department", auth, getAllDepartment);
router.get("/get-department/:id", auth, getDepartmentById);


export default router;
