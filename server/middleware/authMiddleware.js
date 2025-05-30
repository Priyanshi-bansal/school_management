// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/admin.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      let user;
      switch (decoded.role) {
        case "admin":
          user = await Admin.findById(decoded.id).select("-password");
          break;
        case "faculty":
          user = await Faculty.findById(decoded.id).select("-password");
          break;
        case "student":
          user = await Student.findById(decoded.id).select("-password");
          break;
        default:
          res.status(401);
          throw new Error("Not authorized, invalid role");
      }

      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // Check if user is active
      if (user.isActive === false) {
        res.status(401);
        throw new Error("Not authorized, account deactivated");
      }

      req.user = user;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  if (req.userRole !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
  next();
});

// Faculty middleware
const faculty = asyncHandler(async (req, res, next) => {
  if (req.userRole !== "faculty") {
    res.status(403);
    throw new Error("Not authorized as faculty");
  }
  next();
});

// Student middleware
const student = asyncHandler(async (req, res, next) => {
  if (req.userRole !== "student") {
    res.status(403);
    throw new Error("Not authorized as student");
  }
  next();
});

// Higher admin middleware (superadmin or admin)
const higherAdmin = asyncHandler(async (req, res, next) => {
  if (req.userRole === "admin" || req.userRole === "superadmin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as higher admin");
  }
});

// Super admin middleware
const superAdmin = asyncHandler(async (req, res, next) => {
  if (req.userRole !== "superadmin") {
    res.status(403);
    throw new Error("Not authorized as super admin");
  }
  next();
});

export { protect, admin, faculty, student, higherAdmin, superAdmin };