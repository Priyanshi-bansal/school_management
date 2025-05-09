import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div
      className="min-h-screen w-full flex justify-center items-center p-4"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-7xl bg-black bg-opacity-50 p-8 rounded-xl shadow-2xl backdrop-blur-lg">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl text-center font-bold mb-10">
          School Management System
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Admin", color: "bg-[#E91E63]", link: "/login/adminlogin" },
            { title: "Faculty", color: "bg-[#5a51d6]", link: "/login/facultylogin" },
            { title: "Student", color: "bg-[#d65158]", link: "/login/studentlogin" },
          ].map(({ title, color, link }) => (
            <div
              key={title}
              className={`h-80 w-full flex flex-col justify-center items-center text-white p-6 rounded-xl shadow-xl ${color} bg-opacity-70 backdrop-blur-md transition-transform transform hover:scale-105 hover:shadow-2xl`}
            >
              <h2 className="text-3xl font-extrabold mb-6">{title}</h2>
              <Link
                to={link}
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200 w-32 h-10 flex items-center justify-center rounded-lg"
              >
                Login
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
