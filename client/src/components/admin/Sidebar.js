import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Person,
  Engineering,
  Add,
  PersonOutline,
  Delete,
  MenuBook,
  School,
  Groups,
  AdminPanelSettings,
  Notifications
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const menuItems = [
    { icon: <Home />, label: "Dashboard", path: "/admin/home" },
    { icon: <Person />, label: "Profile", path: "/admin/profile" },
    { 
      icon: <Notifications />, 
      label: "Create Notice", 
      path: "/admin/createNotice" 
    },
    { 
      header: "Admin Management",
      items: [
        // { icon: <Add />, label: "Add Admin", path: "/admin/addadmin" },
        { icon: <Engineering />, label: "Manage Admin", path: "/admin/manageadmin" }
      ]
    },
    { 
      header: "Department Management",
      items: [
        { icon: <Engineering />, label: "Manage Department", path: "/admin/adddepartment" },
        // { icon: <Delete />, label: "Manage Department", path: "/admin/managedepartment" }
      ]
    },
    { 
      header: "Faculty Management",
      items: [
        { icon: <Engineering />, label: "Manage Faculty", path: "/admin/allfaculty" },
        // { icon: <Add />, label: "Add Faculty", path: "/admin/addfaculty" },
        // { icon: <Delete />, label: "Delete Faculty", path: "/admin/deletefaculty" }
      ]
    },
    { 
      header: "Student Management",
      items: [
        { icon: <Groups />, label: "Manage Students", path: "/admin/allstudent" },
        // { icon: <Add />, label: "Add Students", path: "/admin/addstudent" },
        // { icon: <Delete />, label: "Delete Student", path: "/admin/deletestudent" }
      ]
    },
    { 
      header: "Subject Management",
      items: [
        { icon: <MenuBook />, label: "Manage Subjects", path: "/admin/allsubject" },
        // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
      ]
    },
     { 
      header: "section Management",
      items: [
        { icon: <MenuBook />, label: "Manage section", path: "/admin/managesection" },
        // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
      ]
    },
     { 
      header: "class Management",
      items: [
        { icon: <MenuBook />, label: "Manage Class", path: "/admin/GetClass" },
        // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
      ]
    },
      { 
      header: "Acedmic Management",
      items: [
        { icon: <MenuBook />, label: "manage Academic", path: "/admin/getacademic" },
        // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
      ]
    },
      { 
      header: "Acedmic Calendra Management",
      items: [
        { icon: <MenuBook />, label: "Calendra Management ", path: "/admin/calendramanagement" },
        // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
      ]
    },
     { 
      header: "Syllabus Management",
      items: [
        { icon: <MenuBook />, label: "syllabus Management ", path: "/admin/syllabusmanagement" },
        // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
      ]
    },
     { 
      header: "Time Table Management",
      items: [
        { icon: <MenuBook />, label: "Time Slot  ", path: "/admin/timetablemanagement" },
          { icon: <MenuBook />, label: "Daily Time Table  ", path: "/admin/dailytimetable" },
            { icon: <MenuBook />, label: "Class Time Table  ", path: "/admin/classtimetable" },
        // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
      ]
    },
     { 
      header: "Attendance",
    items: [
      { icon: <MenuBook />, label: "FacultyAttendance", path: "/admin/facultyattendance" },
      { icon: <MenuBook />, label: "StudentAttendance", path: "/admin/stuattendance" },
      // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
      // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
    ]
  },
  {
    header: "Assign class teacher",
    items: [
      { icon: <MenuBook />, label: "AssignTeacher", path: "/admin/AssignTeacher" },
      // { icon: <Add />, label: "Add Subject", path: "/admin/addsubject" },
      // { icon: <Delete />, label: "Delete Subject", path: "/admin/deletesubject" }
    ]
  },
   { 
      header: "Manage test",
      items: [
        // { icon: <Add />, label: "Add Admin", path: "/admin/gettestadmin" },
        { icon: <MenuBook />, label: "Manage test", path: "/admin/gettestadmin" }
      ]
    },
      { 
      header: "Fees Management",
      items: [
        { icon: <MenuBook />, label: "Fees Structure", path: "/admin/feesStructure" },
          { icon: <MenuBook />, label: "Fees Payment", path: "/admin/feepayment" },
        // { icon: <Add />, label: "Fees Management", path: "/admin/addsubject" },
        // { icon: <Delete />, label: "Delete Fees Management", path: "/admin/deletesFees Management" }
      ]
    },
     { 
      header: "Management Salary",
      items: [
        { icon: <MenuBook />, label: " Salary Structure", path: "/admin/getSalary" },

        { icon: <MenuBook />, label: "Process Salary Payment", path: "/admin/processsalarypayment" },

        { icon: <MenuBook />, label: "calculate salary", path: "/admin/calculateSalary" },

         
        // { icon: <Add />, label: "Management Salary", path: "/admin/addsubject" },
      
      ]

    
    },
];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
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
                          ? 'bg-blue-100 text-blue-600 font-medium' 
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
                          ? 'bg-blue-100 text-blue-600 font-medium' 
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
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <PersonOutline />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.result?.name}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;