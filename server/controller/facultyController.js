import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      errors.usernameError = "Faculty doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingFaculty.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingFaculty.email,
        id: existingFaculty._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingFaculty, token: token });
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
    const { selectedStudents, subjectName, department, year, section } =
      req.body;

    const sub = await Subject.findOne({ subjectName });

    const allStudents = await Student.find({ department, year, section });

    for (let i = 0; i < allStudents.length; i++) {
      const pre = await Attendence.findOne({
        student: allStudents[i]._id,
        subject: sub._id,
      });
      if (!pre) {
        const attendence = new Attendence({
          student: allStudents[i]._id,
          subject: sub._id,
        });
        attendence.totalLecturesByFaculty += 1;
        await attendence.save();
      } else {
        pre.totalLecturesByFaculty += 1;
        await pre.save();
      }
    }

    for (var a = 0; a < selectedStudents.length; a++) {
      const pre = await Attendence.findOne({
        student: selectedStudents[a],
        subject: sub._id,
      });
      if (!pre) {
        const attendence = new Attendence({
          student: selectedStudents[a],
          subject: sub._id,
        });

        attendence.lectureAttended += 1;
        await attendence.save();
      } else {
        pre.lectureAttended += 1;
        await pre.save();
      }
    }
    res.status(200).json({ message: "Attendance Marked successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
