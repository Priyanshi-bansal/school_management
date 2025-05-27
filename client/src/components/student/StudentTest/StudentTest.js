import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { getTestResult } from "../../../redux/actions/studentActions";

import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";



function StudentTest() {
    const user = JSON.parse(localStorage.getItem("user"));
      const dispatch = useDispatch();
      useEffect(() => {
        dispatch(
          getTestResult(
            user.result.department,
            user.result.year,
            user.result.section
          )
        );
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

export default StudentTest