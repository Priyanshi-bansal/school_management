import Attendence from "../models/attendance.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import FacultyAttendance from "../models/FacultyAttendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { selectedStudents, subjectName, department, year, section, date } = req.body;

    const sub = await Subject.findOne({ subjectName });
    if (!sub) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const allStudents = await Student.find({ department, year, section });

    for (let student of allStudents) {
      let record = await Attendence.findOne({
        student: student._id,
        subject: sub._id,
      });

      const isPresent = selectedStudents.includes(String(student._id));

      const attendanceEntry = {
        date: date || new Date(),
        status: isPresent ? "present" : "absent",
      };

      if (!record) {
        // Create new attendance record
        const newRecord = new Attendence({
          student: student._id,
          subject: sub._id,
          totalLecturesByFaculty: 1,
          lectureAttended: isPresent ? 1 : 0,
          attandanceData: [attendanceEntry],
        });
        await newRecord.save();
      } else {
        // Update existing record
        record.totalLecturesByFaculty += 1;
        if (isPresent) record.lectureAttended += 1;
        record.attandanceData.push(attendanceEntry);
        await record.save();
      }
    }

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ backendError: error.message });
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params; // Get studentId from request parameters
    const { subjectName } = req.query; // Get subjectName from query parameters
    const errors = { noAttendanceError: String };
    // Find the subject
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      errors.noAttendanceError = "Subject not found";
      return res.status(404).json(errors);
    }
    // Find the attendance record for the student and subject
    const attendanceRecord = await Attendence.findOne({
      student: studentId,
      subject: subject._id,
    });
    if (!attendanceRecord) {
      errors.noAttendanceError = "No attendance record found for this student";
      return res.status(404).json(errors);
    }
    // Return the attendance data
    res.status(200).json({
      student: attendanceRecord.student,
      subject: attendanceRecord.subject,
      totalLecturesByFaculty: attendanceRecord.totalLecturesByFaculty,
      lectureAttended: attendanceRecord.lectureAttended,
      attandanceData: attendanceRecord.attandanceData,
    }); 
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error.message || "Internal server error";
    res.status(500).json(errors);
  }
};


export const getAttendance = async (req, res) => {
  try {
    const { department, year, section, subjectName } = req.query;

    // Find the subject
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Get all students in the given criteria
    const students = await Student.find({ department, year, section });

    const attendanceRecords = await Attendence.find({
      student: { $in: students.map((s) => s._id) },
      subject: subject._id,
    })
      .populate("student")
      .populate("subject");

    res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ backendError: error.message });
  }
};


export const editAttendance = async (req, res) => {
  try {
    const { studentId, subjectName, date, status } = req.body;

    // Find the subject
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    // Find the attendance record for the student and subject
    const attendanceRecord = await Attendence.findOne({
      student: studentId,
      subject: subject._id,
    });
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    // Find the attendance entry for the given date
    const attendanceEntry = attendanceRecord.attandanceData.find(
      (entry) => new Date(entry.date).toISOString().split("T")[0] === date
    );
    if (!attendanceEntry) {
      return res.status(404).json({ message: "Attendance entry not found for this date" });
    }
    // Update the status
    attendanceEntry.status = status;
    // Save the updated attendance record
    await attendanceRecord.save();
    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    res.status(500).json({ backendError: error.message || "Internal server error" });
  } 
}


export const deleteAttendance = async (req, res) => {
  try {
    const { studentId, subjectName, date } = req.body;

    // Find the subject
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    } 
    // Find the attendance record for the student and subject
    const attendanceRecord = await Attendence.findOne({
      student: studentId,
      subject: subject._id,
    });
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    // Find the index of the attendance entry for the given date
    const entryIndex = attendanceRecord.attandanceData.findIndex(
      (entry) => new Date(entry.date).toISOString().split("T")[0] === date
    );
    if (entryIndex === -1) {
      return res.status(404).json({ message: "Attendance entry not found for this date" });
    }
    // Remove the attendance entry
    attendanceRecord.attandanceData.splice(entryIndex, 1);
    // Update the total lectures and attended lectures
    attendanceRecord.totalLecturesByFaculty -= 1;
    if (attendanceRecord.attandanceData[entryIndex].status === "present") {
      attendanceRecord.lectureAttended -= 1;
    }
    // Save the updated attendance record
    await attendanceRecord.save();
    res.status(200).json({ message: "Attendance entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ backendError: error.message || "Internal server error" });
  } 
}

// Faculty Attendance
export const getFacultyAttendance = async (req, res) => {
  try {
    const { facultyId, startDate, endDate } = req.query;
    
    let query = {};
    if (facultyId) query.faculty = facultyId;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await FacultyAttendance.find(query)
      .populate("faculty", "name email department")
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};