import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getNotice,
} from "../../redux/actions/adminActions";
import Body from "./Body";
import Header from "./Header";
import Sidebar from "./Sidebar";


const AdminHome = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllStudent());
    dispatch(getAllFaculty());
    dispatch(getAllAdmin());
    dispatch(getAllDepartment());
    dispatch(getNotice());
  }, [dispatch]);

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden max-w-7xl mx-auto h-[calc(100vh-2rem)]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Mobile sidebar toggle would go here */}
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <Body />
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;