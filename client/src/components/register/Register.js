import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/admin-login");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/assets/bg-admin.avif')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="relative flex w-3/4 max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Panel */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/asset/bg-admin.avif')" }}
        >
          {/* Empty for background image */}
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-16">
          <h2 className="text-4xl font-bold text-gray-800">Register</h2>
          <p className="mt-4 text-lg text-gray-600">Please create your account</p>

          <form className="mt-10 space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Register
            </button>

            <p className="mt-4 text-sm text-gray-600">
              Already have an account? 
              <span
                onClick={handleLoginRedirect}
                className="text-yellow-500 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
