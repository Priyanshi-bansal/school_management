import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const attendance = useSelector((state) => state.student.attendance.result);

  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const subjects = useSelector((state) => state.admin.subjects.result);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1>Attendance</h1>
        </div>
        <div className="mr-8 bg-white rounded-xl h-[29.5rem]">
          {/* Filter/Search Bar and Table in one card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow p-4 mb-6 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="w-full md:w-auto flex md:items-center md:space-x-4">
                <div className="w-full md:w-56 mb-2 md:mb-0 md:flex-shrink-0">
                  <label className="block text-gray-500 text-sm mb-1" htmlFor="department-select">Department</label>
                  <Select
                    id="department-select"
                    displayEmpty
                    value={""}
                    className="w-full bg-white border border-gray-300 rounded-lg"
                    inputProps={{ 'aria-label': 'Department' }}
                    disabled
                  >
                    <MenuItem value="">All Departments</MenuItem>
                  </Select>
                   </div>
                <div className="relative w-full md:w-[28rem] md:ml-4 mt-8 md:mt-8">
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 shadow-sm"
                    value={search || ""}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <span className="flex items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                  </span>
                </div>
              </div>
              <button className="border border-blue-400 text-blue-600 font-semibold rounded-lg px-4 py-2 w-full md:w-auto mt-8 md:mt-8 hover:bg-blue-50 transition flex items-center justify-center md:ml-4" type="button" onClick={() => setSearch("")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" /></svg>
                CLEAR FILTERS
              </button>
            </div>
            <div className="col-span-3 mr-2 mt-6 overflow-x-auto">
              <div className={classes.loadingAndError}>
                {loading && (
                  <Spinner
                    message="Loading"
                    height={50}
                    width={150}
                    color="#111111"
                    messageColor="blue"
                  />
                )}
                {error.noSubjectError && (
                  <p className="text-red-500 text-2xl font-bold">
                    {error.noSubjectError}
                  </p>
                )}
              </div>
              {!loading &&
                Object.keys(error).length === 0 &&
                subjects?.length !== 0 && (
                  <div className="bg-white rounded-xl p-0 md:p-4 mt-2" style={{boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)'}}>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input type="checkbox" className="form-checkbox" />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">#</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Subject Code</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Subject Name</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Attended</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Percentage</th>
                           </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendance
                          ?.filter((res) => {
                            if (!search) return true;
                            const s = search.toLowerCase();
                            return (
                              res.subjectName?.toLowerCase().includes(s) ||
                              res.subjectCode?.toLowerCase().includes(s)
                            );
                          })
                          .map((res, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <input type="checkbox" className="form-checkbox" />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{res.subjectCode}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{res.subjectName}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{res.attended}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{res.total}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{res.percentage}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    
                  </div>
                  
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
