import React, { useState } from "react";
import { 
  Home as HomeIcon,
  Engineering,
  Groups,
  AdminPanelSettings,
  MenuBook,
  School,
  Notifications,
  Event,
  BarChart,
  PieChart,
  Timeline,
  Class,
  LibraryBooks,
  PeopleAlt,
  Assignment,
  CalendarToday,
  Reply,
  ArrowForward
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
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const [value, onChange] = useState(new Date());
  const students = useSelector((state) => state.admin.allStudent);
  const faculties = useSelector((state) => state.admin.allFaculty);
  const admins = useSelector((state) => state.admin.allAdmin);
  const departments = useSelector((state) => state.admin.allDepartment);

  // Sample data for charts
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance %',
        data: [85, 79, 92, 87, 94],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const departmentDistribution = {
    labels: departments?.map(dept => dept.departmentName) || ['Science', 'Arts', 'Commerce'],
    datasets: [
      {
        label: 'Students',
        data: departments?.map(dept => Math.floor(Math.random() * 200) + 100) || [150, 120, 180],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const stats = [
    {
      icon: <Engineering sx={{ fontSize: 30 }} />,
      title: "Faculty",
      value: faculties?.length || 0,
      change: "+5%",
      color: "from-orange-400 to-orange-600",
      link: "/admin/allfaculty"
    },
    {
      icon: <Groups sx={{ fontSize: 30 }} />,
      title: "Students",
      value: students?.length || 0,
      change: "+12%",
      color: "from-blue-400 to-blue-600",
      link: "/admin/allstudent"
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 30 }} />,
      title: "Admins",
      value: admins?.length || 0,
      change: "+2%",
      color: "from-green-400 to-green-600",
      link: "/admin/addadmin"
    },
    {
      icon: <School sx={{ fontSize: 30 }} />,
      title: "Departments",
      value: departments?.length || 0,
      change: "0%",
      color: "from-purple-400 to-purple-600",
      link: "/admin/adddepartment"
    },
    {
      icon: <Class sx={{ fontSize: 30 }} />,
      title: "Classes",
      value: 24,
      change: "+3%",
      color: "from-red-400 to-red-600",
      link: "#"
    },
    {
      icon: <LibraryBooks sx={{ fontSize: 30 }} />,
      title: "Subjects",
      value: 48,
      change: "+8%",
      color: "from-indigo-400 to-indigo-600",
      link: "/admin/allsubject"
    }
  ];

  const quickActions = [
    { icon: <PeopleAlt />, label: "Add Student", color: "bg-blue-100 text-blue-600", link: "/admin/addstudent" },
    { icon: <Engineering />, label: "Add Faculty", color: "bg-orange-100 text-orange-600", link: "/admin/addfaculty" },
    { icon: <Assignment />, label: "Create Notice", color: "bg-green-100 text-green-600", link: "/admin/createNotice" },
    { icon: <CalendarToday />, label: "Add Event", color: "bg-purple-100 text-purple-600", link: "#" }
  ];

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50">
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HomeIcon className="text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">School Dashboard</h1>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Principal!</h2>
              <p className="opacity-90">Here's what's happening with your school today.</p>
            </div>
            <div className="mt-4 md:mt-0 bg-white/20 rounded-lg px-4 py-2">
              <div className="text-xs font-semibold">SCHOOL DAY</div>
              <div className="text-xl font-bold">Day 128</div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`bg-gradient-to-r ${stat.color} p-4 text-white`}>
                <div className="flex justify-between items-center">
                  <div className="p-2 bg-white/20 rounded-full">
                    {stat.icon}
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <h3 className="text-sm mt-2 opacity-90">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <a href={stat.link} className="block px-4 py-2 text-xs text-center text-gray-600 hover:bg-gray-50 transition">
                View all <ArrowForward fontSize="small" className="ml-1" />
              </a>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <Event className="text-indigo-600 mr-2" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <a 
                key={index} 
                href={action.link}
                className={`flex flex-col items-center justify-center p-4 rounded-lg ${action.color} hover:shadow-md transition-all`}
              >
                <div className="p-3 rounded-full bg-white mb-2">
                  {action.icon}
                </div>
                <span className="font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Chart */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Timeline className="text-green-600 mr-2" /> Weekly Attendance Trend
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

            {/* Department Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <PieChart className="text-purple-600 mr-2" /> Department Distribution
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={departmentDistribution} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600">
                <h3 className="font-semibold text-lg text-white flex items-center">
                  <CalendarToday className="mr-2" /> School Calendar
                </h3>
              </div>
              <div className="p-4">
                <Calendar 
                  onChange={onChange} 
                  value={value}
                  className="border-0 w-full"
                  tileClassName={({ date, view }) => 
                    view === 'month' && date.getDate() === new Date().getDate() 
                      ? 'bg-blue-100 text-blue-600 rounded-full font-bold' 
                      : null
                  }
                />
              </div>
              <div className="px-4 pb-4">
                <div className="text-sm font-medium mb-2">Upcoming Events</div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="bg-red-100 text-red-600 rounded-lg px-2 py-1 text-xs font-bold mr-3">Today</div>
                    <div>
                      <div className="font-medium">Staff Meeting</div>
                      <div className="text-xs text-gray-500">3:00 PM - Conference Room</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-lg px-2 py-1 text-xs font-bold mr-3">Tomorrow</div>
                    <div>
                      <div className="font-medium">Parent-Teacher Meeting</div>
                      <div className="text-xs text-gray-500">10:00 AM - School Hall</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notices */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-white flex items-center">
                    <Notifications className="mr-2" /> Recent Notices
                  </h3>
                  {open && (
                    <button 
                      onClick={() => setOpen(false)}
                      className="text-white/80 hover:text-white text-sm flex items-center"
                    >
                      <Reply className="mr-1" fontSize="small" />
                      Back
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {!open ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                    {notices?.length > 0 ? (
                      notices.slice(0, 4).map((notice, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setOpen(true);
                            setOpenNotice(notice);
                          }}
                          className="cursor-pointer p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-gray-100"
                        >
                          <Notice idx={idx} notice={notice} notFor="" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No notices available
                      </div>
                    )}
                    {notices?.length > 4 && (
                      <a 
                        href="/admin/createNotice" 
                        className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                      >
                        View all notices
                      </a>
                    )}
                  </div>
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