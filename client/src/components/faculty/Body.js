import React, { useState } from "react";
import { 
  Home as HomeIcon,
  Class,
  Groups,
  MenuBook,
  Assignment,
  Event,
  Notifications,
  BarChart,
  Timeline
} from "@mui/icons-material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Body = () => {
  const [value, onChange] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);

  // Sample data for charts
  const attendanceData = {
    labels: ['Class A', 'Class B', 'Class C', 'Class D'],
    datasets: [
      {
        label: 'Attendance %',
        data: [85, 92, 78, 88],
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const testPerformanceData = {
    labels: ['Test 1', 'Test 2', 'Test 3'],
    datasets: [
      {
        label: 'Average Score',
        data: [72, 85, 68],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(79, 70, 229, 0.7)',
          'rgba(67, 56, 202, 0.7)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(67, 56, 202, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const stats = [
    {
      icon: <Class sx={{ fontSize: 30 }} />,
      title: "Classes",
      value: 4,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: <Groups sx={{ fontSize: 30 }} />,
      title: "Students",
      value: 120,
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <MenuBook sx={{ fontSize: 30 }} />,
      title: "Subjects",
      value: 3,
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Assignment sx={{ fontSize: 30 }} />,
      title: "Tests",
      value: 5,
      color: "bg-green-100 text-green-600"
    }
  ];

  const quickActions = [
    { icon: <Assignment />, label: "Create Test", color: "bg-indigo-100 text-indigo-600", link: "/faculty/createtest" },
    { icon: <Event />, label: "Mark Attendance", color: "bg-blue-100 text-blue-600", link: "#" },
    { icon: <MenuBook />, label: "Upload Marks", color: "bg-purple-100 text-purple-600", link: "/faculty/uploadmarks" },
    { icon: <Notifications />, label: "Send Notice", color: "bg-green-100 text-green-600", link: "#" }
  ];

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center space-x-2">
          <HomeIcon className="text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-800">Faculty Dashboard</h1>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Professor!</h2>
          <p>You have 3 classes scheduled for today.</p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-xl p-5 shadow-md flex items-center`}>
              <div className="p-3 rounded-full bg-white/50 mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <a 
                key={index} 
                href={action.link}
                className={`${action.color} p-4 rounded-lg flex flex-col items-center hover:shadow-md transition`}
              >
                <div className="p-2 rounded-full bg-white mb-2">
                  {action.icon}
                </div>
                <span className="font-medium text-center">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Performance Chart */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Timeline className="text-indigo-600 mr-2" /> Class Attendance
              </h3>
              <div className="h-64">
                <Bar 
                  data={attendanceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Test Performance */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <BarChart className="text-blue-600 mr-2" /> Test Performance
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={testPerformanceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Event className="text-purple-600 mr-2" /> Teaching Schedule
              </h3>
              <Calendar 
                onChange={onChange} 
                value={value}
                className="border-0 w-full"
                tileClassName={({ date, view }) => 
                  view === 'month' && date.getDate() === new Date().getDate() 
                    ? 'bg-indigo-100 text-indigo-600 rounded-full font-bold' 
                    : null
                }
              />
              <div className="mt-4">
                <h4 className="font-medium mb-2">Today's Classes</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-600 rounded-lg px-2 py-1 text-xs font-bold mr-3">10:00</div>
                    <div>
                      <div className="font-medium">Mathematics - Class 9A</div>
                      <div className="text-xs text-gray-500">Room 201</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-600 rounded-lg px-2 py-1 text-xs font-bold mr-3">13:30</div>
                    <div>
                      <div className="font-medium">Physics - Class 10B</div>
                      <div className="text-xs text-gray-500">Lab 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notices */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Notifications className="text-green-600 mr-2" /> School Notices
                </h3>
                {open && (
                  <button 
                    onClick={() => setOpen(false)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  >
                    Back to list
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {!open ? (
                  notices?.length > 0 ? (
                    notices.slice(0, 3).map((notice, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setOpen(true);
                          setOpenNotice(notice);
                        }}
                        className="cursor-pointer p-3 hover:bg-indigo-50 rounded-lg mb-2 transition"
                      >
                        <Notice idx={idx} notice={notice} notFor="faculty" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No notices available
                    </div>
                  )
                ) : (
                  <ShowNotice notice={openNotice} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;