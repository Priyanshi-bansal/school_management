import React, { useEffect, useState } from "react";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { updateAdmin } from "../../../../redux/actions/adminActions";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../../utils/Spinner";
import { SET_ERRORS } from "../../../../redux/actionTypes";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: user.result.email,
    department: "",
    contactNumber: "",
    avatar: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    if (
      value.name === "" &&
      value.dob === "" &&
      value.department === "" &&
      value.contactNumber === "" &&
      value.avatar === ""
    ) {
      alert("Enter at least one value");
      setLoading(false);
    } else {
      dispatch(updateAdmin(value, navigate));
      alert("Kindly login again to see updates");
    }
  };

  useEffect(() => {
    if (store.errors || store.admin.updatedAdmin) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.updatedAdmin]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-700">
          <div className="flex items-center space-x-2 text-gray-600 mb-4 md:mb-0">
            <SecurityUpdateIcon />
            <h1 className="text-xl font-semibold">Update Profile</h1>
          </div>

          <div
            onClick={() => navigate("/admin/update/password")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
          >
            <VisibilityOffIcon />
            <span className="font-medium">Update Password</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  placeholder={user.result?.name}
                  value={value.name}
                  onChange={(e) => setValue({ ...value, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DOB:
                </label>
                <input
                  type="date"
                  value={value.dob}
                  onChange={(e) => setValue({ ...value, dob: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  value={user.result?.email}
                  disabled
                  className="mt-1 block w-full bg-gray-100 cursor-not-allowed rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department:
                </label>
                <Select
                  displayEmpty
                  value={value.department}
                  onChange={(e) =>
                    setValue({ ...value, department: e.target.value })
                  }
                  sx={{
                    mt: 1,
                    width: "100%",
                    borderRadius: "6px",
                    borderColor: "#ccc",
                    fontSize: "0.9rem",
                  }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">None</MenuItem>
                  {departments?.map((dp, idx) => (
                    <MenuItem key={idx} value={dp.department}>
                      {dp.department}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number:
                </label>
                <input
                  type="text"
                  placeholder={user.result?.contactNumber}
                  value={value.contactNumber}
                  onChange={(e) =>
                    setValue({ ...value, contactNumber: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Avatar:
                </label>
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) =>
                    setValue({ ...value, avatar: base64 })
                  }
                />
                {value.avatar && (
                  <img
                    src={value.avatar}
                    alt="Preview"
                    className="mt-2 h-20 w-20 object-cover rounded-full border"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/profile")}
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>

          {/* Loading & Errors */}
          <div className="pt-4">
            {loading && (
              <Spinner
                message="Updating..."
                height={30}
                width={150}
                color="#111111"
                messageColor="blue"
              />
            )}
            {error.backendError && (
              <p className="text-red-500 mt-2">{error.backendError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Body;
