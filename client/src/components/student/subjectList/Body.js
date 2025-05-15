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
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Subject"
                className="w-50 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50"
                // Add search logic if needed
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-2 -mx-6">
            <table className=" bg-white shadow border-separate border-spacing-y-3">
              <thead>
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
  );
};

export default Body;
