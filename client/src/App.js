import React from "react";
import { Routes, Route } from "react-router-dom";
import AddAdmin from "./components/admin/addAdmin/AddAdmin";
import AddDepartment from "./components/admin/addDepartment/AddDepartment";
import AddFaculty from "./components/admin/addFaculty/AddFaculty";
import AddStudent from "./components/admin/addStudent/AddStudent";
import AddSubject from "./components/admin/addSubject/AddSubject";
import AdminHome from "./components/admin/AdminHome";

import GetFaculty from "./components/admin/getFaculty/GetFaculty";
import GetStudent from "./components/admin/getStudent/GetStudent";
import GetSubject from "./components/admin/getSubject/GetSubject";
import AdminProfile from "./components/admin/profile/Profile";
import AdminFirstTimePassword from "./components/admin/profile/update/firstTimePassword/FirstTimePassword";
import AdminPassword from "./components/admin/profile/update/password/Password";

import AdminUpdate from "./components/admin/profile/update/Update";
import CreateTest from "./components/faculty/createTest/CreateTest";
import FacultyHome from "./components/faculty/FacultyHome";
import MarkAttendance from "./components/faculty/markAttendance/MarkAttendance";
import FacultyProfile from "./components/faculty/profile/Profile";
import FacultyFirstTimePassword from "./components/faculty/profile/update/firstTimePassword/FirstTimePassword";
import FacultyPassword from "./components/faculty/profile/update/password/Password";
import FacultyUpdate from "./components/faculty/profile/update/Update";
import UploadMarks from "./components/faculty/uploadMarks/UploadMarks";
import AdminLogin from "./components/login/adminLogin/AdminLogin";
import AdminRegister from "./components/register/adminRegister/AdminRegister";
import FacultyLogin from "./components/login/facultyLogin/FacultyLogin";
import FacultyRegister from "./components/register/facultyRegister/FacultyRegister";
import Login from "./components/login/Login";
import Register from "./components/register/Register";

import StudentLogin from "./components/login/studentLogin/StudentLogin";
import StudentRegister from "./components/register/studentRegister/StudentRegister";
import StudentFirstTimePassword from "./components/student/profile/update/firstTimePassword/FirstTimePassword";
import StudentHome from "./components/student/StudentHome";
import StudentProfile from "./components/student/profile/Profile";
import StudentUpdate from "./components/student/profile/update/Update";
import StudentPassword from "./components/student/profile/update/password/Password";
import SubjectList from "./components/student/subjectList/SubjectList";
import TestResult from "./components/student/testResult/TestResult";
import Attendance from "./components/student/attendance/Attendance";
import DeleteAdmin from "./components/admin/deleteAdmin/DeleteAdmin";
import DeleteDepartment from "./components/admin/deleteDepartment/DeleteDepartment";
import DeleteFaculty from "./components/admin/deleteFaculty/DeleteFaculty";
import DeleteStudent from "./components/admin/deleteStudent/DeleteStudent";
import DeleteSubject from "./components/admin/deleteSubject/DeleteSubject";
import CreateNotice from "./components/admin/createNotice/CreateNotice";
import Result from "./components/faculty/result/Result";
import ClassPerformance from "./components/faculty/classPerformance/classPerformance";
import GetTest from "./components/faculty/getTest/GetTest";
import Marks from "./components/faculty/Marks/Marks";
import StudentTest from "./components/student/StudentTest/StudentTest";
import DailyAttendance from "./components/student/DailyAttendance/DailyAttendance";
import StudentAttendance from "./components/faculty/StudentAttendance/StudentAttendance";

import FacultyAttendance from "./components/admin/FacultyAttendance/FacultyAttendance";
import StuAttendance from "./components/admin/StuAttendance/StuAttendance";

import ManageSection from "./components/admin/managesection/ManageSection";
import GetClass from "./components/admin/GetClass/GetClass";
import AddClass from "./components/admin/addclass/AddClass";
import AddSection from "./components/admin/addsection/AddSection";
import ViewSection from "./components/admin/viewsectiondetail/ViewSection";
import EditSection from "./components/admin/editsection/EditSection";
import GetAcademic from "./components/admin/getacademic/GetAcademic";
import AddAcedmicYear from "./components/admin/addacedmicyear/AddAcedmicYear";
import EditAcademic from "./components/admin/editacademic/EditAcademic";
import EditSubject from "./components/admin/editsubject/EditSubject";
import ViewSubject from "./components/admin/viewsubject/ViewSubject";
import SubjectToAssign from "./components/admin/subjecttoassign/SubjectToAssign";
import TeacherToSubject from "./components/admin/teachertosubject/TeacherToSubject";
import CreateCalendra from "./components/admin/createcalendra/CreateCalendra";
import EditCalendra from "./components/admin/editcalendra/EditCalendra";
import CalendraManagement from "./components/admin/calendramanagement/CalendraManagement";
import SyllabusManagemant from "./components/admin/syllabusmanagement/SyllabusManagemant";
import GetSyllabus from "./components/admin/getsyllabus/GetSyllabus";
import EditSyllabus from "./components/admin/editsyllabus/EditSyllabus";
import ViewChapter from "./components/admin/viewchapter/ViewChapter";
import EditChapter from "./components/admin/editchapter/EditChapter";
import TimeTableManagement from "./components/admin/timetablemanagement/TimeTableManagement";

import EditClass from "./components/admin/EditClass/EditClass";
import ViewClass from "./components/admin/viewclass/ViewClass";
import AssignClassTeacher from "./components/admin/AssignTeacher/AssignTeacher";
import AssignTeacher from "./components/admin/AssignTeacher/AssignTeacher";
import AddStudentsection from "./components/admin/AddStudentsection/AddStudentsection";
import UpdateFaculty from "./components/admin/updateFaculty/UpdateFaculty";
import UpdateStudent from "./components/admin/updateStudent/UpdateStudent";
import GettestAdmin from "./components/admin/gettestAdmin/GettestAdmin";
import AddgetTest from "./components/admin/addgetTest/AddgetTest";







const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/register" element={<Register />} />

      {/* Admin  */}

      <Route path="/login/adminlogin" element={<AdminLogin />} />
      <Route path="/register/admin-register" element={<AdminRegister />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/update" element={<AdminUpdate />} />
      <Route path="/admin/update/password" element={<AdminPassword />} />
      <Route
        path="/admin/updatepassword"
        element={<AdminFirstTimePassword />}
      />
      <Route path="/admin/createnotice" element={<CreateNotice />} />
      <Route path="/admin/addadmin" element={<AddAdmin />} />
      <Route path="/admin/manageadmin" element={<DeleteAdmin />} />
      <Route path="/admin/adddepartment" element={<AddDepartment />} />
      <Route path="/admin/managedepartment" element={<DeleteDepartment />} />
      <Route path="/admin/addfaculty" element={<AddFaculty />} />
      <Route path="/admin/deletefaculty" element={<DeleteFaculty />} />
      <Route path="/admin/deletestudent" element={<DeleteStudent />} />
      <Route path="/admin/deletesubject" element={<DeleteSubject />} />
      <Route path="/admin/allfaculty" element={<GetFaculty />} />
      <Route path="/admin/addstudent" element={<AddStudent />} />
      <Route path="/admin/addsubject" element={<AddSubject />} />
      <Route path="/admin/allsubject" element={<GetSubject />} />
      <Route path="/admin/allstudent" element={<GetStudent />} />
      <Route path="/admin/facultyattendance" element={<FacultyAttendance />} />
      <Route path="/admin/stuattendance" element={<StuAttendance />} />
      <Route path="/admin/managesection" element={<ManageSection />} />
      <Route path="/admin/getclass" element={<GetClass />} />
      <Route path="/admin/addclass" element={<AddClass />} />
      <Route path="/admin/addsection" element={<AddSection />} />
      <Route path="/admin/viewsectiondetail" element={<ViewSection />} />
      <Route path="/admin/editsection" element={<EditSection />} />
      <Route path="/admin/editclass" element={<EditClass />} />
      <Route path="/admin/viewclass" element={<ViewClass />} />
      <Route path="/admin/AssignTeacher" element={<AssignTeacher />} />
      <Route path="/admin/AddStudentsection" element={<AddStudentsection />} />
      <Route path="admin/updatefaculty" element={<UpdateFaculty />} />
      <Route path="admin/updatestudent" element={<UpdateStudent />} />
      <Route path="admin/updatestudent" element={<UpdateStudent />} />
      <Route path="admin/gettestadmin" element={<GettestAdmin />} />
           <Route path="admin/addgettest" element={<AddgetTest />} />
     



      <Route path="/admin/getacademic" element={<GetAcademic />} />
      <Route path="/admin/addacedmicyear" element={<AddAcedmicYear />} />
      <Route path="/admin/editacadamic" element={<EditAcademic />} />
      <Route path="/admin/editsubject" element={<EditSubject />} />
      <Route path="/admin/viewsubject" element={<ViewSubject />} />
      <Route path="/admin/subjecttoclass" element={<SubjectToAssign />} />
      <Route path="/admin/teachertosubject" element={<TeacherToSubject />} />
       <Route path="/admin/createcalendra" element={<CreateCalendra />} />
      <Route path="/admin/editcalendra" element={<EditCalendra />} />
      <Route path="/admin/calendramanagement" element={< CalendraManagement/>} />
        <Route path="/admin/syllabusmanagement" element={< SyllabusManagemant/>} />
          <Route path="/admin/getsyllabus" element={< GetSyllabus/>} />
            <Route path="/admin/editsyllabus" element={< EditSyllabus/>} />
             <Route path="/admin/viewchapter" element={<ViewChapter/>} />
             <Route path="/admin/editchapter" element={<EditChapter/>} />
              <Route path="/admin/timetablemanagement" element={<TimeTableManagement/>} />
             




      {/* Faculty  */}

      <Route path="/login/facultylogin" element={<FacultyLogin />} />
      <Route path="/register/faculty-register" element={<FacultyRegister />} />
      <Route path="/faculty/home" element={<FacultyHome />} />
      <Route path="/faculty/password" element={<FacultyFirstTimePassword />} />
      <Route path="/faculty/profile" element={<FacultyProfile />} />
      <Route path="/faculty/update" element={<FacultyUpdate />} />
      <Route path="/faculty/update/password" element={<FacultyPassword />} />
      <Route path="/faculty/createtest" element={<CreateTest />} />
      <Route path="/faculty/gettest" element={<GetTest />} />
      <Route path="/faculty/uploadmarks" element={<UploadMarks />} />
      <Route path="/faculty/markattendance" element={<MarkAttendance />} />
      <Route path="/faculty/result" element={<Result />} />
      <Route path="/faculty/classperformance" element={<ClassPerformance />} />
      <Route path="/faculty/Marks" element={<Marks />} />
      <Route path="/faculty/StudentAttendance" element={<StudentAttendance />} />
      <Route path="/faculty/gettestadmin" element={<GettestAdmin />} />

      {/* Student  */}

      <Route path="/login/studentlogin" element={<StudentLogin />} />
      <Route path="/register/student-register" element={<StudentRegister />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/student/password" element={<StudentFirstTimePassword />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/student/update" element={<StudentUpdate />} />
      <Route path="/student/update/password" element={<StudentPassword />} />
      <Route path="/student/subjectlist" element={<SubjectList />} />
      <Route path="/student/testresult" element={<TestResult />} />
      <Route path="/student/attendance" element={<Attendance />} />
      <Route path="/student/StudentTest" element={<StudentTest />} />
      <Route path="/student/DailyAttendance" element={<DailyAttendance />} />

    </Routes>
  );
};

export default App;
