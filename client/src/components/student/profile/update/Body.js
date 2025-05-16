import React, { useEffect, useState } from "react";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { updateStudent } from "../../../../redux/actions/studentActions";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../../utils/Spinner";
import { SET_ERRORS } from "../../../../redux/actionTypes";
import BadgeIcon from '@mui/icons-material/Badge';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CakeIcon from '@mui/icons-material/Cake';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TagIcon from '@mui/icons-material/Tag';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

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
    batch: "",
    year: "",
    motherName: "",
    fatherName: "",
    fatherContactNumber: "",
    section: "",
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
      value.avatar === "" &&
      value.batch === "" &&
      value.year === "" &&
      value.motherName === "" &&
      value.fatherName === "" &&
      value.fatherContactNumber === "" &&
      value.section === ""
    ) {
      alert("Enter atleast one value");
      setLoading(false);
    } else {
      dispatch(updateStudent(value));
      alert("Kindly login again to see updates");
    }
  };

  useEffect(() => {
    if (store.errors || store.student.updatedStudent) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [store.errors, store.student.updatedStudent]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex items-center justify-between mr-8">
          <div className="flex space-x-2 text-gray-400">
            <SecurityUpdateIcon />
            <h1>Update</h1>
          </div>
          <div
            onClick={() => navigate("/student/update/password")}
            className="flex space-x-2 cursor-pointer">
            <VisibilityOffIcon />
            <h1 className="font-bold">Password</h1>
          </div>
        </div>
        <div className="mr-10 bg-white rounded-xl overflow-y-scroll h-[34rem] p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Left Column */}
              <div className="space-y-0">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><BadgeIcon className="mr-2" fontSize="small"/>Name</label>
                  <input
                    placeholder={user.result?.name}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    type="text"
                    value={value.name}
                    onChange={e => setValue({ ...value, name: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><BadgeIcon className="mr-2" fontSize="small"/>Username</label>
                  <input
                    placeholder={user.result?.username}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    type="text"
                    disabled
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><FamilyRestroomIcon className="mr-2" fontSize="small"/>Father's Name</label>
                  <input
                    placeholder={user.result?.fatherName}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    value={value.fatherName}
                    onChange={e => setValue({ ...value, fatherName: e.target.value })}
                    type="text"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><FamilyRestroomIcon className="mr-2" fontSize="small"/>Mother's Name</label>
                  <input
                    placeholder={user.result?.motherName}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    value={value.motherName}
                    onChange={e => setValue({ ...value, motherName: e.target.value })}
                    type="text"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><CakeIcon className="mr-2" fontSize="small"/>DOB</label>
                  <input
                    placeholder={user.result?.dob}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    type="text"
                    value={value.dob}
                    onChange={e => setValue({ ...value, dob: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><SchoolIcon className="mr-2" fontSize="small"/>Batch</label>
                  <input
                    placeholder={user.result?.batch}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    value={value.batch}
                    onChange={e => setValue({ ...value, batch: e.target.value })}
                    type="text"
                  />
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-0">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><EmailIcon className="mr-2" fontSize="small"/>Email</label>
                  <input
                    placeholder={user.result?.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    type="text"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><SchoolIcon className="mr-2" fontSize="small"/>Department</label>
                  <Select
                    displayEmpty
                    sx={{ height: 44, width: '100%' }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.department}
                    onChange={e => setValue({ ...value, department: e.target.value })}
                  >
                    <MenuItem value="">None</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>{dp.department}</MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><CallIcon className="mr-2" fontSize="small"/>Contact Number</label>
                  <input
                    placeholder={user.result?.contactNumber}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    type="text"
                    value={value.contactNumber}
                    onChange={e => setValue({ ...value, contactNumber: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><CalendarTodayIcon className="mr-2" fontSize="small"/>Year</label>
                  <input
                    placeholder={user.result?.year}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    type="text"
                    value={value.year}
                    onChange={e => setValue({ ...value, year: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><TagIcon className="mr-2" fontSize="small"/>Section</label>
                  <input
                    placeholder={user.result?.section}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    type="text"
                    value={value.section}
                    onChange={e => setValue({ ...value, section: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><CallIcon className="mr-2" fontSize="small"/>Father's Contact Number</label>
                  <input
                    placeholder={user.result?.fatherContactNumber}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800"
                    value={value.fatherContactNumber}
                    onChange={e => setValue({ ...value, fatherContactNumber: e.target.value })}
                    type="text"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-center text-gray-500 font-semibold mb-1"><PhotoCameraIcon className="mr-2" fontSize="small"/>Avatar</label>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setValue({ ...value, avatar: base64 })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" type="submit">
                Submit
              </button>
              <button
                onClick={() => navigate("/admin/profile")}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                type="button">
                Cancel
              </button>
            </div>
            {loading && (
              <div className="flex justify-center mt-4">
                <Spinner
                  message="Updating"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
