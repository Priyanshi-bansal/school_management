import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
    },
    department: {
      type: String,
    },
    dob: {
      type: String,
    },
    joiningYear: {
      type: String,
    },
    avatar: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "subadmin"],
      default: "admin",
    },
    passwordUpdated: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
