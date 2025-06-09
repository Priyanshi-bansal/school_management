import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";



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

