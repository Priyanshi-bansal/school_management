import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllDepartment } from "../../../redux/actions/adminActions"; // Fixed path
import Header from "../Header"; // Adjust as per actual structure
import Sidebar from "../Sidebar"; // Adjust as per actual structure
import Body from "./Body";

const FeesStructure = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDepartment());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <Body />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesStructure;
