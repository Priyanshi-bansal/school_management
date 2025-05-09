import React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <img
          src="https://www.freeiconspng.com/thumbs/results-icon-png/results-icon-png-7.png"
          alt="SRMS Logo"
          className="h-8 w-8"
        />
        <h1 className="font-bold text-lg">SRMS</h1>
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
          sx={{ width: 32, height: 32 }}
          className="border-2 border-white"
        />
        <h1 className="hidden sm:block">{user.result.name.split(" ")[0]}</h1>
        <LogoutIcon
          onClick={logout}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
    </div>
  );
};

export default Header;
