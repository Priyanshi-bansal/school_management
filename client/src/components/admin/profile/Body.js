import React from "react";
import {
  AssignmentInd as ProfileIcon,
  Edit as EditIcon,
  Email,
  Person,
  Badge,
  School,
  Cake,
  CalendarToday,
  Phone,
} from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import Data from "./Data";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Sample data - replace with your actual data structure
  const profileData = [
    {
      icon: <Person className="text-gray-600" />,
      label: "Name",
      value: user.result.name,
    },
    {
      icon: <Email className="text-gray-600" />,
      label: "Email",
      value: user.result.email,
    },
    {
      icon: <Badge className="text-gray-600" />,
      label: "Username",
      value: user.result.username,
    },
    {
      icon: <School className="text-gray-600" />,
      label: "Department",
      value: user.result.department,
    },
    {
      icon: <Cake className="text-gray-600" />,
      label: "DOB",
      value: user.result.dob || "Not specified",
    },
    {
      icon: <CalendarToday className="text-gray-600" />,
      label: "Joining Year",
      value: user.result.joiningYear,
    },
    {
      icon: <Phone className="text-gray-600" />,
      label: "Contact",
      value: user.result.contactNumber || "Not specified",
    },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <ProfileIcon className="text-indigo-600 mr-3" fontSize="large" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
          </div>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate("/admin/update")}
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
                src={user.result.avatar}
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
                {user.result.name}
              </h2>
              <p className="text-indigo-600 font-medium">
                {user.result.department} Admin
              </p>
            </div>

            {/* Profile Details Grid - Improved Contrast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <Data
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                  />
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
