import React, { useState } from "react";
import { 
  Home as HomeIcon,
  Class,
  Assignment,
  Event,
  Notifications,
  BarChart,
  PieChart,
  Timeline,
  School,
  CheckCircle,
  EmojiEvents,
  LibraryBooks,
  Schedule,
  Grade
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
  const testResult = useSelector((state) => state.student.testResult.result);
  const attendance = useSelector((state) => state.student.attendance.result);
  const user = JSON.parse(localStorage.getItem("user"));
  const subjects = useSelector((state) => state.admin.subjects.result);

  // Calculate attendance percentage
  let totalClasses = 0;
  let attendedClasses = 0;
  attendance?.forEach(att => {
    totalClasses += att.total;
    attendedClasses += att.attended;
  });
  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  // Prepare data for charts
  const performanceData = {
    labels: testResult?.map(test => test.testName) || ['Math Quiz', 'Science Test', 'History Exam'],
    datasets: [
      {
        label: 'Your Score',
        data: testResult?.map(test => test.marks) || [85, 72, 90],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const subjectDistribution = {
    labels: subjects?.map(sub => sub.subjectName) || ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
    datasets: [
      {
        data: subjects?.map(() => Math.floor(Math.random() * 50) + 50) || [35, 42, 28, 45, 30],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const stats = [
    {
      icon: <Class sx={{ fontSize: 30 }} className="text-purple-500" />,
      title: "Subjects",
      value: subjects?.length || 0,
      color: "bg-purple-50 border-l-4 border-purple-500",
      trend: "text-green-500"
    },
    {
      icon: <Assignment sx={{ fontSize: 30 }} className="text-blue-500" />,
      title: "Tests Taken",
      value: testResult?.length || 0,
      color: "bg-blue-50 border-l-4 border-blue-500",
      trend: "text-green-500"
    },
    {
      icon: <CheckCircle sx={{ fontSize: 30 }} className="text-green-500" />,
      title: "Attendance",
      value: `${attendancePercentage}%`,
      color: "bg-green-50 border-l-4 border-green-500",
      trend: attendancePercentage > 75 ? "text-green-500" : "text-red-500"
    },
    {
      icon: <School sx={{ fontSize: 30 }} className="text-orange-500" />,
      title: "Year",
      value: user.result.year,
      color: "bg-orange-50 border-l-4 border-orange-500",
      trend: "text-blue-500"
    }
  ];

  const quickLinks = [
    { 
      icon: <Grade sx={{ fontSize: 30 }} className="text-red-500" />, 
      label: "View Results", 
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-200",
      link: "/student/testresult" 
    },
    { 
      icon: <LibraryBooks sx={{ fontSize: 30 }} className="text-indigo-500" />, 
      label: "Subjects", 
      bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      border: "border-indigo-200",
      link: "/student/subjectlist" 
    },
    { 
      icon: <Schedule sx={{ fontSize: 30 }} className="text-green-500" />, 
      label: "Timetable", 
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      link: "#" 
    },
    { 
      icon: <EmojiEvents sx={{ fontSize: 30 }} className="text-yellow-500" />, 
      label: "Achievements", 
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      link: "#" 
    }
  ];

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50">
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center space-x-2">
          <HomeIcon className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Student Dashboard
          </h1>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg animate-gradient-x">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.result.name.split(' ')[0]}!</h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {user.result.department}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Year {user.result.year}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Section {user.result.section}
            </span>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}>
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-white shadow-sm mr-4">
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-gray-700">Quick Access</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.link}
                className={`${link.bg} border ${link.border} p-4 rounded-xl flex flex-col items-center hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                <div className="p-3 rounded-full bg-white shadow-sm mb-3">
                  {link.icon}
                </div>
                <span className="font-semibold text-gray-700 text-center">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Performance Chart */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center text-gray-700">
                  <BarChart className="text-red-500 mr-2" /> Test Performance
                </h3>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  Current Term
                </span>
              </div>
              <div className="h-64">
                <Bar 
                  data={performanceData} 
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
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Subject Distribution */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center text-gray-700">
                <PieChart className="text-blue-500 mr-2" /> Weekly Subject Hours
              </h3>
              <div className="h-64 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-full">
                  <Doughnut 
                    data={subjectDistribution} 
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
                <div className="w-full md:w-1/2 pl-4">
                  <div className="space-y-3">
                    {subjectDistribution.labels.map((label, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ 
                            backgroundColor: subjectDistribution.datasets[0].backgroundColor[index],
                            borderColor: subjectDistribution.datasets[0].borderColor[index]
                          }}
                        ></div>
                        <span className="text-sm font-medium">{label}</span>
                        <span className="ml-auto text-sm font-bold">
                          {subjectDistribution.datasets[0].data[index]} hrs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center text-gray-700">
                <Event className="text-purple-500 mr-2" /> Academic Calendar
              </h3>
              <Calendar 
                onChange={onChange} 
                value={value}
                className="border-0 w-full"
                tileClassName={({ date, view }) => 
                  view === 'month' && date.getDate() === new Date().getDate() 
                    ? 'bg-purple-100 text-purple-600 rounded-full font-bold' 
                    : null
                }
              />
              <div className="mt-4">
                <h4 className="font-bold text-gray-700 mb-3">Upcoming Events</h4>
                <div className="space-y-3">
                  <div className="flex items-start p-2 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 text-white rounded-lg px-2 py-1 text-xs font-bold mr-3">MON</div>
                    <div>
                      <div className="font-medium text-gray-800">Math Midterm</div>
                      <div className="text-xs text-gray-500">10:00 AM - Room 204</div>
                    </div>
                  </div>
                  <div className="flex items-start p-2 bg-green-50 rounded-lg">
                    <div className="bg-green-500 text-white rounded-lg px-2 py-1 text-xs font-bold mr-3">WED</div>
                    <div>
                      <div className="font-medium text-gray-800">Science Fair</div>
                      <div className="text-xs text-gray-500">All Day - School Gym</div>
                    </div>
                  </div>
                  <div className="flex items-start p-2 bg-yellow-50 rounded-lg">
                    <div className="bg-yellow-500 text-white rounded-lg px-2 py-1 text-xs font-bold mr-3">FRI</div>
                    <div>
                      <div className="font-medium text-gray-800">History Project Due</div>
                      <div className="text-xs text-gray-500">Before 3:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notices */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center text-gray-700">
                  <Notifications className="text-red-500 mr-2" /> School Notices
                </h3>
                {open && (
                  <button 
                    onClick={() => setOpen(false)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center font-medium"
                  >
                    Back to list
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {!open ? (
                  notices?.length > 0 ? (
                    <div className="space-y-3">
                      {notices.slice(0, 3).map((notice, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setOpen(true);
                            setOpenNotice(notice);
                          }}
                          className="cursor-pointer p-3 hover:bg-indigo-50 rounded-lg border border-gray-100 transition-all hover:border-indigo-200"
                        >
                          <Notice idx={idx} notice={notice} notFor="student" />
                        </div>
                      ))}
                      <a href="#" className="block text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2">
                        View all notices →
                      </a>
                    </div>
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