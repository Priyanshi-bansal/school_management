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
    navigate("/login/facultylogin");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <SchoolIcon className="text-indigo-600" fontSize="large" />
        <h1 className="text-xl font-bold text-indigo-800">Faculty Portal</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="font-medium text-gray-800">{user.result.name}</p>
          <p className="text-xs text-gray-500">Faculty Member</p>
        </div>
        <Avatar
          src={user.result.avatar}
          alt={user.result.name.charAt(0)}
          sx={{ width: 40, height: 40 }}
          className="border-2 border-indigo-500"
        />
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