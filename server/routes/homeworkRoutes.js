import express from "express";
import HomeworkController from "../controllers/homeworkController";
import authMiddleware from "../middleware/auth";
import uploadMiddleware from "../middleware/fileUploadMiddleware";
import {
  createHomework,
  getHomeworkForClass,
  updateHomework,
  deleteHomework,
  getHomeworkSubmissions,
  gradeSubmission,
  sendReminder,
  getHomeworkStats,
  getStudentHomework,
  submitHomework,
  updateSubmission,
  getSubmission,
  addComment,
  uploadHomework,
  addFilesToHomework,
  deleteHomeworkFile,
} from "../controllers/homeworkController.js";

const router = express.Router();

// Create homework
router.post("/:classId/:sectionId/:subjectId", 
    uploadMiddleware.array("files"),
    createHomework);

// Get homework for class/subject
router.get("/class/:classId/subject/:subjectId", getHomeworkForClass);

// Update homework
router.put("/:homeworkId", updateHomework);

// Delete homework
router.delete("/:homeworkId", deleteHomework);

// Get submissions for homework
router.get("/:homeworkId/submissions", getHomeworkSubmissions);

// Grade submission
router.put("/submissions/:submissionId/grade", gradeSubmission);

// Send reminder
router.post("/:homeworkId/reminders", sendReminder);

// Get homework statistics
router.get("/stats/class/:classId/subject/:subjectId", getHomeworkStats);

// Get student homework
router.get("/", getStudentHomework);

// Submit homework
router.post(
  "/:homeworkId/submit",
  uploadMiddleware.array("files"),
  submitHomework
);

// Update submission
router.put(
  "/submissions/:submissionId",
  uploadMiddleware.array("files"),
  updateSubmission
);

// Get submission
router.get("/:homeworkId/submission", getSubmission);

// Add comment
router.post("/submissions/:submissionId/comments", addComment);

// Upload homework files
router.post(
  "/:homeworkId/upload",
  uploadMiddleware.array("files"),
  uploadHomework
);

// Add files to homework
router.post(
  "/:homeworkId/files",
  uploadMiddleware.array("files"),
  addFilesToHomework
);

// Delete homework file
router.delete(
  "/:homeworkId/files/:fileId",
  deleteHomeworkFile
);

export default router;
