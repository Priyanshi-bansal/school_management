import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";

const AddSection = () => {
  return (
    <div>
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
    </div>
  );
};

export default AddSection;
