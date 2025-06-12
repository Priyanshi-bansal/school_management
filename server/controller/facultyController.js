import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";

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
      { username: existingFaculty.username, id: existingFaculty._id, role: "Faculty" },
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








