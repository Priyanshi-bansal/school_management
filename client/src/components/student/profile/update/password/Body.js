import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminUpdatePassword } from "../../../../../redux/actions/adminActions";
import * as classes from "../../../../../utils/styles";
import { facultyUpdatePassword } from "../../../../../redux/actions/facultyActions";
import { studentUpdatePassword } from "../../../../../redux/actions/studentActions";
const Body = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const update = (e) => {
    e.preventDefault();

    setLoading(true);
    dispatch(
      studentUpdatePassword(
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          email: user.result.email,
        },
        navigate
      )
    );
  };

  useEffect(() => {
    if (store.errors) {
      setLoading(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [store.errors]);

  return (
    <div className="flex-[0.8] mt-6 px-4">
      <div className="space-y-6">
        <div className="flex items-center text-gray-500 space-x-2">
          <VisibilityOffIcon />
          <h1 className="text-lg font-semibold">Update Password</h1>
        </div>

        <div className="bg-white shadow-md rounded-xl p-8 max-w-xl mx-auto">
          <form onSubmit={update} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Change Your Password
            </h2>

            {/* New Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="flex-grow outline-none text-sm"
                  required
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(false)}
                    className="cursor-pointer text-gray-500"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(true)}
                    className="cursor-pointer text-gray-500"
                  />
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="flex-grow outline-none text-sm"
                  required
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(false)}
                    className="cursor-pointer text-gray-500"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(true)}
                    className="cursor-pointer text-gray-500"
                  />
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between space-x-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/profile")}
                className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>

            {/* Loading & Errors */}
            {loading && (
              <Spinner
                message="Updating"
                height={30}
                width={150}
                color="#111111"
                messageColor="blue"
              />
            )}
            {(error.mismatchError || error.backendError) && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error.mismatchError || error.backendError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
