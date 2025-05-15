import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

// Icons
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import CakeIcon from "@mui/icons-material/Cake";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CallIcon from "@mui/icons-material/Call";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between mr-8">
          <div className="flex space-x-2 text-gray-400">
            <AssignmentIndIcon />
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
          <div
            onClick={() => navigate("/student/update")}
            className="flex space-x-2 cursor-pointer text-blue-600 hover:underline"
          >
            <SecurityUpdateIcon />
            <h1 className="font-bold">Update</h1>
          </div>
        </div>

        {/* Profile Card */}
        <div className="w-[98%] bg-white relative rounded-xl shadow-md">
          {/* Avatar */}
          <div className="absolute left-1/2 -top-10 transform -translate-x-1/2">
            <Avatar src={user?.result?.avatar} sx={{ width: 70, height: 70 }} />
          </div>

          {/* Info Grid */}
          <div className="overflow-y-scroll h-[36rem] py-10 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <InfoCard icon={<BadgeIcon />} label="Name" value={user?.result?.name} />
              <InfoCard icon={<EmailIcon />} label="Email" value={user?.result?.email} />
              <InfoCard icon={<BadgeIcon />} label="Username" value={user?.result?.username} />
              <InfoCard icon={<SchoolIcon />} label="Department" value={user?.result?.department} />
              <InfoCard icon={<FamilyRestroomIcon />} label="Father's Name" value={user?.result?.fatherName} />
              <InfoCard icon={<FamilyRestroomIcon />} label="Mother's Name" value={user?.result?.motherName} />
              <InfoCard icon={<CakeIcon />} label="DOB" value={user?.result?.dob} />
              <InfoCard icon={<CalendarTodayIcon />} label="Joining Year" value={user?.result?.year} />
              <InfoCard icon={<CallIcon />} label="Contact Number" value={user?.result?.contactNumber} />
              <InfoCard icon={<BadgeIcon />} label="Section" value={user?.result?.section} />
              <InfoCard icon={<CallIcon />} label="Father's Contact Number" value={user?.result?.fatherContactNumber} />
              <InfoCard icon={<SchoolIcon />} label="Batch" value={user?.result?.batch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// InfoCard Component — Icon left, label above value, value in input-style box
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-1 flex flex-col h-full justify-between shadow-sm">
    <div className="flex items-center mb-3">
      <div className="text-gray-500 text-3xl mr-2 flex-shrink-0 flex items-center justify-center">{icon}</div>
      <span className="text-sm text-gray-500 font-medium">{label}</span>
    </div>
    <div className="mt-2">
      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 text-lg font-medium">
        {value || "N/A"}
      </div>
    </div>
  </div>
);
export default Body;
