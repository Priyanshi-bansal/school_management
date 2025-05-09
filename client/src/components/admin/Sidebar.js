import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddIcon from "@mui/icons-material/Add";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-blue-600 transition-all duration-200 ease-in-out capitalize hover:bg-gray-100 py-2 rounded-lg";
const isActiveStyle =
  "flex items-center px-5 gap-3 text-blue-600 bg-blue-100 transition-all duration-200 ease-in-out capitalize py-2 rounded-lg";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    alert("OOPS! Your session expired. Please Login again");
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("admin")));
  }, [navigate]);

  return (
    <div className="flex-[0.2] bg-gray-50 h-full shadow-md p-4">
      <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 h-[calc(100vh-4rem)]">
        {/* Dashboard Section */}
        <NavLink
          to="/admin/home"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <HomeIcon />
          <h1 className="font-medium">Dashboard</h1>
        </NavLink>

        {/* Profile Section */}
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <AssignmentIndIcon />
          <h1 className="font-medium">Profile</h1>
        </NavLink>

        {/* Notice Section */}
        <NavLink
          to="/admin/createNotice"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <AddIcon />
          <h1 className="font-medium">Create Notice</h1>
        </NavLink>

        {/* Admin Management */}
        <NavLink
          to="/admin/addadmin"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <AddIcon />
          <h1 className="font-medium">Add Admin</h1>
        </NavLink>
        <NavLink
          to="/admin/deleteadmin"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <DeleteIcon />
          <h1 className="font-medium">Delete Admin</h1>
        </NavLink>

        {/* Department Management */}
        <NavLink
          to="/admin/adddepartment"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <AddIcon />
          <h1 className="font-medium">Add Department</h1>
        </NavLink>
        <NavLink
          to="/admin/deletedepartment"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <DeleteIcon />
          <h1 className="font-medium">Delete Department</h1>
        </NavLink>

        {/* Faculty Management */}
        <NavLink
          to="/admin/allfaculty"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <EngineeringIcon />
          <h1 className="font-medium">Our Faculty</h1>
        </NavLink>
        <NavLink
          to="/admin/addfaculty"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <AddIcon />
          <h1 className="font-medium">Add Faculty</h1>
        </NavLink>
        <NavLink
          to="/admin/deletefaculty"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <DeleteIcon />
          <h1 className="font-medium">Delete Faculty</h1>
        </NavLink>

        {/* Student Management */}
        <NavLink
          to="/admin/allstudent"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <BoyIcon />
          <h1 className="font-medium">Our Students</h1>
        </NavLink>
        <NavLink
          to="/admin/addstudent"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <AddIcon />
          <h1 className="font-medium">Add Students</h1>
        </NavLink>
        <NavLink
          to="/admin/deletestudent"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <DeleteIcon />
          <h1 className="font-medium">Delete Student</h1>
        </NavLink>

        {/* Subject Management */}
        <NavLink
          to="/admin/allsubject"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <MenuBookIcon />
          <h1 className="font-medium">Subjects</h1>
        </NavLink>
        <NavLink
          to="/admin/addsubject"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <AddIcon />
          <h1 className="font-medium">Add Subject</h1>
        </NavLink>
        <NavLink
          to="/admin/deletesubject"
          className={({ isActive }) =>
            isActive ? isActiveStyle : isNotActiveStyle
          }
        >
          <DeleteIcon />
          <h1 className="font-medium">Delete Subject</h1>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
