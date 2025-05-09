import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Calendar from "react-calendar";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BoyIcon from "@mui/icons-material/Boy";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import ReplyIcon from "@mui/icons-material/Reply";

const Body = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const [value, onChange] = useState(new Date());
  const students = useSelector((state) => state.admin.allStudent);
  const faculties = useSelector((state) => state.admin.allFaculty);
  const admins = useSelector((state) => state.admin.allAdmin);
  const departments = useSelector((state) => state.admin.allDepartment);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        {/* Dashboard Header */}
        <div className="flex text-gray-500 items-center space-x-2">
          <HomeIcon />
          <h1 className="font-semibold text-lg">Dashboard</h1>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg flex items-center space-x-4 p-5">
            <EngineeringIcon
              className="rounded-full p-2 bg-orange-300 text-white"
              sx={{ fontSize: 40 }}
            />
            <div>
              <h1 className="text-gray-600">Faculty</h1>
              <h2 className="text-2xl font-bold">{faculties?.length}</h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg flex items-center space-x-4 p-5">
            <BoyIcon
              className="rounded-full p-2 bg-blue-300 text-white"
              sx={{ fontSize: 40 }}
            />
            <div>
              <h1 className="text-gray-600">Students</h1>
              <h2 className="text-2xl font-bold">{students?.length}</h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg flex items-center space-x-4 p-5">
            <SupervisorAccountIcon
              className="rounded-full p-2 bg-green-300 text-white"
              sx={{ fontSize: 40 }}
            />
            <div>
              <h1 className="text-gray-600">Admins</h1>
              <h2 className="text-2xl font-bold">{admins?.length}</h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg flex items-center space-x-4 p-5">
            <MenuBookIcon
              className="rounded-full p-2 bg-purple-300 text-white"
              sx={{ fontSize: 40 }}
            />
            <div>
              <h1 className="text-gray-600">Departments</h1>
              <h2 className="text-2xl font-bold">{departments?.length}</h2>
            </div>
          </div>
        </div>

        {/* Calendar and Notices Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-lg p-5 w-full lg:w-1/3">
            <h1 className="font-semibold text-lg mb-4">Calendar</h1>
            <Calendar onChange={onChange} value={value} />
          </div>

          {/* Notices */}
          <div className="bg-white rounded-xl shadow-lg p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              {open && (
                <ReplyIcon
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                />
              )}
              <h1 className="font-semibold text-lg text-center flex-1">
                Notices
              </h1>
            </div>
            <div className="space-y-3 overflow-y-auto h-[12rem] scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              {!open ? (
                notices?.map((notice, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setOpen(true);
                      setOpenNotice(notice);
                    }}
                    className="cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition"
                  >
                    <Notice idx={idx} notice={notice} notFor="" />
                  </div>
                ))
              ) : (
                <ShowNotice notice={openNotice} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
