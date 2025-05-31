import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import academicYearRoutes from "./routes/academicYearRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import academicCalendarRoutes from "./routes/academicCalendarRoutes.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
console.log("Main File");
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/academic-year", academicYearRoutes);
app.use("/api/class", classRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/academic-calendar", academicCalendarRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello to college erp API");
});
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("MongoDB connected successfully")
  )
  .catch((error) => console.log("Mongo Error", error.message));

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
