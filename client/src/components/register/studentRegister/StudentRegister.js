import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../../utils/Spinner";
import { Link } from "react-router-dom";

const StudentRegister = () => {
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [avatar, setAvatar] = useState("");
  const [dob, setDob] = useState(new Date());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(undefined);
  const [department, setDepartment] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [section, setSection] = useState(undefined);
  const [translate, setTranslate] = useState(false);
  const [subjects, setSubjects] = useState(undefined);
  const [fatherContact, setFatherContact] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [joiningYear, setJoiningYear] = useState(new Date());

  const store = useSelector((state) => state);

  useEffect(() => {
    setTimeout(() => {
      setTranslate(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (store.errors) {
      setError(store.errors);
    }
  }, [store.errors]);

  const register = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  useEffect(() => {
    if (store.errors) {
      setName("");
      setEmail("");
      setBatch("");
      setAvatar("");
      setGender("");
      setUsername("");
      setPassword("");
      setFatherName("");
      setLoading(false);
      setDepartment("");
      setDob(new Date());
      setContactNumber("");
      setSubjects(undefined);
      setJoiningYear(new Date().getFullYear());
    }
  }, [store.errors]);

  return (
    <div
      className="flex flex-col md:flex-row h-screen"
      style={{
        backgroundImage: "url('/asset/top.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link to="/login/studentlogin" className="">
                <button className="absolute top-4 left-4 cursor-pointer text-white" >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                </Link>
      {/* Left Side Content */}
      <div
        className="hidden md:flex w-1/2 flex-col justify-center items-center bg-white p-8"
        style={{ backgroundColor: "inherit" }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2"></h1>
        <p className="text-lg text-gray-600"></p>
      </div>

      {/* Right Side Form */}
      <div
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8"
        style={{ backgroundColor: "inherit" }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Student Register</h1>
        <form onSubmit={register} className="w-full max-w-md grid grid-cols-2 gap-4">
          {[
            {
              label: "Name",
              name: "name",
              placeholder: "Name",
              type: "text",
            },
            {
              label: "Batch",
              name: "batch",
              placeholder: "Batch",
              type: "text",
            },
            {
              label: "Email",
              name: "email",
              placeholder: "Email",
              type: "email",
            },
            {
              label: "Username",
              name: "username",
              placeholder: "Username",
              type: "text",
            },
            {
              label: "Gender",
              name: "gender",
              placeholder: "Gender",
              type: "text",
            },
            {
              label: "Department",
              name: "department",
              placeholder: "Department",
              type: "text",
            },
            {
              label: "Father's Name",
              name: "fatherName",
              placeholder: "Father's Name",
              type: "text",
            },
            {
              label: "Father's Contact",
              name: "fatherContact",
              placeholder: "Contact Number",
              type: "text",
            },
            {
              label: "Subjects",
              name: "subjects",
              placeholder: "Subjects",
              type: "text",
            },
            {
              label: "Contact Number",
              name: "contactNumber",
              placeholder: "Contact Number",
              type: "text",
            },
            {
              label: "Avatar (Image File)",
              name: "avatar",
              placeholder: "Choose File",
              type: "file",
            },
          ].map(({ label, name, placeholder, type }) => (
            <div key={name} className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-semibold text-gray-800">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-md outline-none bg-gray-50 text-gray-800 placeholder-gray-400"
                value={eval(name)}
                onChange={(e) =>
                  eval(`set${name.charAt(0).toUpperCase() + name.slice(1)}`)(e.target.value)
                }
              />
            </div>
          ))}

          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
