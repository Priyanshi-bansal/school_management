import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mui/material";

// Icons
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import CakeIcon from "@mui/icons-material/Cake";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CallIcon from "@mui/icons-material/Call";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PersonIcon from "@mui/icons-material/Person";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const profileData = [
    {
      icon: <PersonIcon className="text-gray-600" />,
      label: "Name",
      value: user?.result?.name,
    },
    {
      icon: <EmailIcon className="text-gray-600" />,
      label: "Email",
      value: user?.result?.email,
    },
    {
      icon: <BadgeIcon className="text-gray-600" />,
      label: "Username",
      value: user?.result?.username,
    },
    {
      icon: <SchoolIcon className="text-gray-600" />,
      label: "Department",
      value: user?.result?.department,
    },
    {
      icon: <BadgeIcon className="text-gray-600" />,
      label: "Section",
      value: user?.result?.section,
    },
    {
      icon: <SchoolIcon className="text-gray-600" />,
      label: "Batch",
      value: user?.result?.batch,
    },
    {
      icon: <FamilyRestroomIcon className="text-gray-600" />,
      label: "Father's Name",
      value: user?.result?.fatherName,
    },
    {
      icon: <CallIcon className="text-gray-600" />,
      label: "Father's Contact",
      value: user?.result?.fatherContactNumber,
    },
    {
      icon: <FamilyRestroomIcon className="text-gray-600" />,
      label: "Mother's Name",
      value: user?.result?.motherName,
    },
    {
      icon: <CakeIcon className="text-gray-600" />,
      label: "DOB",
      value: user?.result?.dob,
    },
    {
      icon: <CalendarTodayIcon className="text-gray-600" />,
      label: "Joining Year",
      value: user?.result?.year,
    },
    {
      icon: <CallIcon className="text-gray-600" />,
      label: "Contact Number",
      value: user?.result?.contactNumber,
    },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <AssignmentIndIcon className="text-indigo-600 mr-3" fontSize="large" />
            <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
          </div>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate("/student/update")}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md normal-case text-sm md:text-base"
          >
            Update Profile
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <Avatar
                src={user?.result?.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid white",
                }}
                className="shadow-lg"
              />
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-6 md:px-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.result?.name}
              </h2>
              <p className="text-indigo-600 font-medium">
                {user?.result?.department} Student
              </p>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 text-gray-500">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        {item.label}
                      </p>
                      <p className="text-gray-800 font-medium">
                        {item.value || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;