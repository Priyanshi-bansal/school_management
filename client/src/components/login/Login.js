import React from "react";
import { Link } from "react-router-dom";
 
const Login = () => {
  return (
    <div
      className="min-h-screen w-full flex justify-center items-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
      }}
    >
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden flex">
        {/* Left Panel */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url("/assets/bg-admin.avif")` }}
        ></div>
 
        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-16">
          <h2 className="text-4xl font-bold text-gray-800">School Management System</h2>
          <p className="mt-4 text-lg text-gray-600">Please select your login type</p>
 
          <div className="mt-10 space-y-8">
            {["Admin", "Faculty", "Student"].map((role, index) => (
              <div
                key={role}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                  index === 0
                    ? "bg-[#E91E63] text-white"
                    : index === 1
                    ? "bg-[#5a51d6] text-white"
                    : "bg-[#d65158] text-white"
                }`}
              >
                <h3 className="text-xl font-semibold">{role} Login</h3>
                <Link
                  to={`/login/${role.toLowerCase()}login`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Login
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Login;