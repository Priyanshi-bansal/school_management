import student from "../models/student.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import OrganizationIP from "../models/OrganizationIP.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.connection?.socket?.remoteAddress;
};

export const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingStudent = await Student.findOne({ username });
    if (!existingStudent) {
      errors.usernameError = "Student doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        username: existingStudent.username,
        id: existingStudent._id,
        role: "Student"
      },
      "sEcReT",
      { expiresIn: "12h" }
    );

    res.status(200).json({ result: existingStudent, token: token });
  } catch (error) {
    console.log(error);
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const student = await Student.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();
    if (student.passwordUpdated === false) {
      student.passwordUpdated = true;
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: student,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
    } = req.body;
    const updatedStudent = await Student.findOne({ email });
    if (name) {
      updatedStudent.name = name;
      await updatedStudent.save();
    }
    if (dob) {
      updatedStudent.dob = dob;
      await updatedStudent.save();
    }
    if (department) {
      updatedStudent.department = department;
      await updatedStudent.save();
    }
    if (contactNumber) {
      updatedStudent.contactNumber = contactNumber;
      await updatedStudent.save();
    }
    if (batch) {
      updatedStudent.batch = batch;
      await updatedStudent.save();
    }
    if (section) {
      updatedStudent.section = section;
      await updatedStudent.save();
    }
    if (year) {
      updatedStudent.year = year;
      await updatedStudent.save();
    }
    if (motherName) {
      updatedStudent.motherName = motherName;
      await updatedStudent.save();
    }
    if (fatherName) {
      updatedStudent.fatherName = fatherName;
      await updatedStudent.save();
    }
    if (fatherContactNumber) {
      updatedStudent.fatherContactNumber = fatherContactNumber;
      await updatedStudent.save();
    }
    if (avatar) {
      updatedStudent.avatar = avatar;
      await updatedStudent.save();
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const testResult = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    console.log(req.body);
    const errors = { notestError: String };
    const student = await Student.findOne({ department, year, section });
    console.log(student)
    const test = await Test.find({ department, year, section });
    console.log(test)
    if (test.length === 0) {
      errors.notestError = "No Test Found";
      return res.status(404).json(errors);
    }
    var result = [];
    for (var i = 0; i < test.length; i++) {
      var subjectCode = test[i].subjectCode;
      console.log("Subject Code",subjectCode)
      var subject = await Subject.findOne({ subjectCode });
      var marks = await Marks.findOne({
        student: student._id,
        exam: test[i]._id,
      });
      
      console.log("Subject",subject)
      console.log("Marks",marks)
      if (marks) {
        var temp = {
          marks: marks.marks,
          totalMarks: test[i]?.totalMarks,
          subjectName: subject?.subjectName,
          subjectCode,
          test: test[i]?.test,
        };

        result.push(temp);
      }
    }
    console.log(result);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const getTest = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const test = await Test.find({ department, year, section });
    if (test.length === 0) {
      errors.notestError = "No Test Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: test });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
}

export const getAttendanceBySubject = async (req, res) => {
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

export const getAttendance = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const student = await Student.findOne({ department, year, section });

    const attendence = await Attendence.find({
      student: student._id,
    }).populate("subject");
    if (!attendence) {
      res.status(400).json({ message: "Attendence not found" });
    }

    res.status(200).json({
      result: attendence.map((att) => {
        let res = {};
        res.percentage = (
          (att.lectureAttended / att.totalLecturesByFaculty) *
          100
        ).toFixed(2);
        res.subjectCode = att.subject.subjectCode;
        res.subjectName = att.subject.subjectName;
        res.attended = att.lectureAttended;
        res.total = att.totalLecturesByFaculty;
        return res;
      }),
    });
  } catch (error) {
    res.status(500).json(error);
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

export const getSubject = async (req, res) => {
  try {
    const { department, year } = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });
    const errors = { noSubjectError: String };

    const subjects = await Subject.find({ department, year });
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: subjects });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getStudent = async (req, res) => {
  try {
    const { email, department, year, section } = req.query;
    if (!email && !department && !year && !section) {
      return res.status(400).json({ message: "At least one query parameter is required" });
    }
    let query = {};
    if (email) {
      query.email = email;
    }
    if (department) {
      query.department = department;
    }
    if (year) {
      query.year = year;
    }
    if (section) {
      query.section = section;
    }
    const students = await Student.find(query);
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
