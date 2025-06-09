import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";


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