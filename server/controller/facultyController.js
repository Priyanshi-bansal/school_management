import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import OrganizationIP from "../models/OrganizationIP.js";
import FacultyAttendance from "../models/FacultyAttendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.connection?.socket?.remoteAddress;
};

// export const facultyLogin = async (req, res) => {
//   const { username, password } = req.body;
//   const errors = { usernameError: String, passwordError: String };
//   try {
//     const existingFaculty = await Faculty.findOne({ username });
//     if (!existingFaculty) {
//       errors.usernameError = "Faculty doesn't exist.";
//       return res.status(404).json(errors);
//     }
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       existingFaculty.password
//     );
//     if (!isPasswordCorrect) {
//       errors.passwordError = "Invalid Credentials";
//       return res.status(404).json(errors);
//     }

//     const token = jwt.sign(
//       {
//         email: existingFaculty.email,
//         id: existingFaculty._id,
//       },
//       "sEcReT",
//       { expiresIn: "12h" }
//     );

//     res.status(200).json({ result: existingFaculty, token: token });
//   } catch (error) {
//     console.log(error);
//   }
// };


export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  
  try {
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      errors.usernameError = "Faculty doesn't exist.";
      return res.status(404).json(errors);
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingFaculty.password);
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    // IP verification
    const clientIp = getClientIp(req);
    const isAllowedIP = await OrganizationIP.findOne({ ipAddress: clientIp });
    const isInOrganizationNetwork = !!isAllowedIP;

    // Mark attendance if in organization network
    if (isInOrganizationNetwork) {
      await markFacultyPresent(existingFaculty._id, clientIp);
    }

    const token = jwt.sign(
      { email: existingFaculty.email, id: existingFaculty._id },
      "sEcReT",
      { expiresIn: "12h" }
    );

    res.status(200).json({ 
      result: existingFaculty, 
      token: token,
      isInOrganizationNetwork
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Helper to mark faculty present
async function markFacultyPresent(facultyId, ipAddress) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await FacultyAttendance.findOneAndUpdate(
    { faculty: facultyId, date: { $gte: today } },
    {
      faculty: facultyId,
      status: "present",
      ipAddress,
      locationVerified: true,
      date: new Date()
    },
    { upsert: true, new: true }
  );
}


export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const faculty = await Faculty.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    faculty.password = hashedPassword;
    await faculty.save();
    if (faculty.passwordUpdated === false) {
      faculty.passwordUpdated = true;
      await faculty.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: faculty,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, designation } =
      req.body;
    const updatedFaculty = await Faculty.findOne({ email });
    if (name) {
      updatedFaculty.name = name;
      await updatedFaculty.save();
    }
    if (dob) {
      updatedFaculty.dob = dob;
      await updatedFaculty.save();
    }
    if (department) {
      updatedFaculty.department = department;
      await updatedFaculty.save();
    }
    if (contactNumber) {
      updatedFaculty.contactNumber = contactNumber;
      await updatedFaculty.save();
    }
    if (designation) {
      updatedFaculty.designation = designation;
      await updatedFaculty.save();
    }
    if (avatar) {
      updatedFaculty.avatar = avatar;
      await updatedFaculty.save();
    }
    res.status(200).json(updatedFaculty);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
    const students = await Student.find({ department, year, section });
    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const createTest = async (req, res) => {
  try {
    const { subjectCode, department, year, section, date, test, totalMarks } =
      req.body;
    const errors = { testError: String };
    const existingTest = await Test.findOne({
      subjectCode,
      department,
      year,
      section,
      test,
    });
    if (existingTest) {
      errors.testError = "Given Test is already created";
      return res.status(400).json(errors);
    }

    const newTest = await new Test({
      totalMarks,
      section,
      test,
      date,
      department,
      subjectCode,
      year,
    });

    await newTest.save();
    const students = await Student.find({ department, year, section });
    return res.status(200).json({
      success: true,
      message: "Test added successfully",
      response: newTest,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getTest = async (req, res) => {
  try {
    const { department, year, section } = req.body;

    if (!department || !year || !section) {
      return res.status(400).json({ error: "Department, year, and section are required." });
    }

    const tests = await Test.find({ department, year, section });

    return res.status(200).json({ result: tests });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return res.status(500).json({ error: "Failed to fetch tests." });
  }
};


export const getAllTest = async (req, res) => {
  try {
    const tests = await Test.find();

    return res.status(200).json({ result: tests });
  } catch (error) {
    console.error("Error fetching all tests:", error);
    return res.status(500).json({ error: "Failed to fetch all tests." });
  }
};


export const getMarksByTest = async (req, res) => {
  try {
    const { department, year, section, test } = req.body;
    const errors = { noMarksError: String };
    const existingTest = await Test.findOne({
      department,
      year,
      section,
      test,
    });
    if (!existingTest) {
      errors.noMarksError = "No Marks Found";
      return res.status(404).json(errors);
    }
    const marks = await Marks.find({ exam: existingTest._id }).populate(
      "student"
    );
    if (marks.length === 0) {
      errors.noMarksError = "No Marks Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: marks });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getMarksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params; 
    const errors = { noMarksError: String };
    const marks = await Marks.find({ student: studentId }).populate("exam");
    if (marks.length === 0) {
      errors.noMarksError = "No Marks Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: marks });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getMarksByStudentAndTest = async (req, res) => {
  try {
    const { studentId, testId } = req.params;
    const errors = { noMarksError: String };
    const marks = await Marks.findOne({
      student: studentId,
      exam: testId,
    }).populate("exam");
    if (!marks) {
      errors.noMarksError = "No Marks Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: marks });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getMarks = async (req, res) => {
  try {
    const { department, year, section, test } = req.body;

    if (!department || !year || !section || !test) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingTest = await Test.findOne({
      department,
      year,
      section,
      test,
    });

    if (!existingTest) {
      return res.status(404).json({ error: "Test not found" });
    }

    const marks = await Marks.find({ exam: existingTest._id }).populate(
      "student"
    );

    res.status(200).json({ result: marks });
  } catch (error) {
    console.error("Error fetching marks:", error);
    return res.status(500).json({ error: "Failed to fetch marks." });
  }
}

export const getMarksByDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({ error: "Department is required" });
    }

    const marks = await Marks.find({
      department
    }).populate("student");

    res.status(200).json({ result: marks });
  } catch (error) {
    console.error("Error fetching marks by department:", error);
    return res.status(500).json({ error: "Failed to fetch marks." });
  }
}

export const uploadMarks = async (req, res) => {
  try {
    const { department, year, section, test, marks } = req.body;

     // Input validation
    if (!department || !year || !section || !test || !marks || !Array.isArray(marks)) {
      return res.status(400).json({ error: "All fields are required and marks must be an array" });
    }

    const existingTest = await Test.findOne({
      department,
      year,
      section,
      test,
    });

     if (!existingTest) {
      return res.status(404).json({ error: "Test not found" });
    }

    const isAlready = await Marks.find({
      exam: existingTest._id,
    });

    if (isAlready.length !== 0) {
      return res.status(400).json({ examError: "You have already uploaded marks for the given exam" });
    }

   // Prepare marks documents
    const marksDocs = marks.map((m) => ({
      student: m._id,
      exam: existingTest._id,
      marks: m.value,
    }));

    // Insert all at once
    await Marks.insertMany(marksDocs);

    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
     res.status(500).json({ backendError: error.message || "Internal server error" });
  }
};


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


