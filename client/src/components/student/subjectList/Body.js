import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [value, setValue] = useState({
    department: "",
    year: "",
  });
  const [search, setSearch] = useState(false);
  const subjects = useSelector((state) => state.admin.subjects.result);
  console.log(subjects);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getSubject(value));
  };

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex items-center space-x-2 text-gray-400">
          <MenuBookIcon />
          <h1 className="text-2xl font-semibold">Subject Management</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* Filter/Search Bar */}
          <div className="bg-white border border-gray-200 rounded-xl shadow flex flex-col md:flex-row md:items-center md:space-x-4 p-4 mb-6">
            <div className="w-full md:w-60 mb-4 md:mb-0 md:flex-shrink-0 md:items-center">
              <label className="block text-gray-500 text-sm mb-1 md:mb-0 md:mr-2 font-bold " htmlFor="department-select">Department</label>
              <select
                id="department-select"
                className="w-full bg-white border-2 border-gray-300 rounded-lg px-5 py-4 text-lg shadow-sm focus:outline-none focus:ring-0"
                disabled
                value={value.department}
                onChange={e => setValue({ ...value, department: e.target.value })}
              >
                <option value="">All Departments</option>
              </select>
            </div>
            <div className="relative w-full md:w-96 md:ml-10 flex items-center justify-center mt-0">
              <input
                type="text"
                placeholder="Subject Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 pr-10"
                // Add search logic if needed
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
            </div>
            <button className="border border-blue-400 text-blue-600 font-semibold rounded-lg px-6 py-2 w-full md:w-auto mt-4 md:mt-0 hover:bg-blue-50 transition flex items-center justify-center md:ml-4" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" /></svg>
              CLEAR FILTERS
            </button>
          </div>
          {/* Table */}
          <div className="bg-white rounded-xl shadow p-2 md:p-4">
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 text-base">
                    <th className="px-4 py-3 text-left w-12">
                      <input type="checkbox" className="accent-blue-500 w-5 h-5" />
                    </th>
                    <th className="px-4 py-3 text-left w-12">#</th>
                    <th className="px-4 py-3 text-left">Subject Code</th>
                    <th className="px-4 py-3 text-left">Subject Name</th>
                    <th className="px-4 py-3 text-left">Total Lectures</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects && subjects.length > 0 ? (
                    subjects.map((sub, idx) => (
                      <tr key={idx} className="bg-white border-b last:border-b-0">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="accent-blue-500 w-5 h-5" />
                        </td>
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3">{sub.subjectCode}</td>
                        <td className="px-4 py-3">{sub.subjectName}</td>
                        <td className="px-4 py-3">{sub.totalLectures}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-8">No subjects found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
