import mongoose from "mongoose";

const organizationIPSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    unique: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("OrganizationIP", organizationIPSchema);