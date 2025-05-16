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
  const testResult = useSelector((state) => state.student.testResult.result);
  console.log("test rest is",testResult);

  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  const [search, setSearch] = useState("");

  console.log(error);
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
          <h1>TestResult</h1>
        </div>
        <div className="mr-10 bg-white rounded-xl pt-6 pl-6 h-[29.5rem]">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-4 mr-6">
            <input
              type="text"
              placeholder="Search by subject name, code, or test..."
              className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 md:mb-0"
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-span-3 mr-6 overflow-x-auto">
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
                <div className="bg-white rounded-xl overflow-x-auto shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input type="checkbox" className="form-checkbox" />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testResult
                        ?.filter((res) => {
                          if (!search) return true;
                          const s = search.toLowerCase();
                          return (
                            res.subjectName?.toLowerCase().includes(s) ||
                            res.subjectCode?.toLowerCase().includes(s) ||
                            res.test?.toLowerCase().includes(s)
                          );
                        })
                        .map((res, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <input type="checkbox" className="form-checkbox" />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{res.subjectCode}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{res.subjectName}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{res.test}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{res.marks}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{res.totalMarks}</td>
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
  );
};

export default Body;
