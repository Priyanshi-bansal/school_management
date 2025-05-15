import React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SchoolIcon from '@mui/icons-material/School';

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };

  return (
    <div className="flex justify-between items-center bg-gray-100 text-white px-6 py-4 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        {/* <img
          src="https://www.freeiconspng.com/thumbs/results-icon-png/results-icon-png-7.png"
          alt="SRMS Logo"
          className="h-8 w-8"
        />
        <h1 className="font-bold text-lg">SMS</h1> */}
        <SchoolIcon className="text-blue-600" fontSize="large" />
                <h1 className="text-xl font-bold text-blue-800">Admin Portal</h1>
      </div>

      {/* Welcome Message */}
      <h1 className="hidden sm:block font-medium text-base">
        Welcome, {user.result.name.split(" ")[0]}
      </h1>

      {/* User Info and Logout */}
      <div className="flex items-center space-x-4">
        <Avatar
          src={user.result.avatar}
          alt={user.result.name.charAt(0)}
           sx={{ width: 40, height: 40 }}
          className="border-2 border-blue-500"
        />
        <h1 className="hidden sm:block font-medium text-gray-800">{user.result.name.split(" ")[0]}</h1>
        <button 
          onClick={logout}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
};

export default Header;
