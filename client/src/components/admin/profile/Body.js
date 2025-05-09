import React from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import { Avatar } from "@mui/material";
import Data from "./Data";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="flex-[0.8] mt-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-700">
          <div className="flex items-center space-x-2 text-gray-600 mb-4 md:mb-0">
            <AssignmentIndIcon />
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <div
            onClick={() => navigate("/admin/update")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
          >
            <SecurityUpdateIcon />
            <span className="font-medium">Update</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="w-full bg-white rounded-xl shadow-lg relative pt-16 pb-10 px-6 md:px-10">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-10">
            <Avatar
              src={user.result.avatar}
              sx={{ width: 80, height: 80 }}
              className="shadow-md"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
            <div className="space-y-6">
              <Data label="Name" value={user.result.name} />
              <Data label="Email" value={user.result.email} />
              <Data label="Username" value={user.result.username} />
              <Data label="Department" value={user.result.department} />
            </div>
            <div className="space-y-6">
              <Data label="DOB" value={user.result.dob} />
              <Data label="Joining Year" value={user.result.joiningYear} />
              <Data label="Contact Number" value={user.result.contactNumber} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
