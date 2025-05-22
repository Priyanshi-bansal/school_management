import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home,
  Person,
  Assignment,
  Add,
  Event,
  School,
  Assessment,
  Logout
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    alert("Your session has expired. Please login again.");
    dispatch({ type: "LOGOUT" });
    navigate("/login/facultylogin");
  };

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("faculty")));
  }, [navigate]);

  const menuItems = [
    { icon: <Home />, label: "Dashboard", path: "/faculty/home" },
    { icon: <Person />, label: "Profile", path: "/faculty/profile" },
    { 
      header: "Teaching",
      items: [
        { icon: <Assignment />, label: "Create Test", path: "/faculty/createtest" },
        { icon: <Add />, label: "Upload Marks", path: "/faculty/uploadmarks" },
        { icon: <Event />, label: "Mark Attendance", path: "/faculty/markattendance" }
      ]
    },
    { 
      header: "Results",
      items: [
        { icon: <Assessment />, label: "View Results", path: "/faculty/result" },
        { icon: <School />, label: "Class Performance", path: "/faculty/classperformance" }
      ]
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-indigo-600 text-white">
            <h1 className="text-xl font-bold">Faculty Portal</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.header ? (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.header}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                )}
                
                {item.items?.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 ml-6 rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </NavLink>
                ))}
              </React.Fragment>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <Logout className="mr-3 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;