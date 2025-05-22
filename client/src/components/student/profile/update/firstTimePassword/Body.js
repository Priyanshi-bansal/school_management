import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    <div className="flex flex-col items-center w-full px-4 mt-24">
      <form
        onSubmit={update}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Update Password
        </h1>

        {/* New Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="bg-gray-800 rounded-lg px-3 flex items-center space-x-3">
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
              type={showPassword ? "text" : "password"}
              className="bg-gray-800 text-white w-full py-2 placeholder:text-sm outline-none"
              placeholder="New Password"
            />
            {showPassword ? (
              <VisibilityOffIcon
                onClick={() => setShowPassword(false)}
                className="cursor-pointer text-white"
              />
            ) : (
              <VisibilityIcon
                onClick={() => setShowPassword(true)}
                className="cursor-pointer text-white"
              />
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="bg-gray-800 rounded-lg px-3 flex items-center space-x-3">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              type={showPassword ? "text" : "password"}
              className="bg-gray-800 text-white w-full py-2 placeholder:text-sm outline-none"
              placeholder="Confirm Password"
            />
            {showPassword ? (
              <VisibilityOffIcon
                onClick={() => setShowPassword(false)}
                className="cursor-pointer text-white"
              />
            ) : (
              <VisibilityIcon
                onClick={() => setShowPassword(true)}
                className="cursor-pointer text-white"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-150"
        >
          Update
        </button>

        {/* Feedback */}
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
          <p className="text-red-500 text-center text-sm">
            {error.mismatchError || error.backendError}
          </p>
        )}
      </form>
    </div>
  );
};

export default Body;
