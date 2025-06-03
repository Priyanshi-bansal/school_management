import React, { useEffect, useState } from "react";
import {
  Subject as SubjectIcon,
  Class as ClassIcon,
  CalendarToday as CalendarIcon,
  Grade as GradeIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuItem,
  Button,
  Typography,
  Select,
  InputAdornment,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { addAdmin } from "../../../redux/actions/adminActions";
import { SET_ERRORS, ADD_ADMIN } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    section: "",
    year: "",
    test: "",
    totalMarks: "",
    date: "",
  });

  const subjects = [
    "Mathematics", "Science", "English", "History", "Geography", "Computer Science"
  ];
  const sections = ["A", "B", "C", "D"];

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setErrors(store.errors);
    }
  }, [store.errors]);

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.year || formData.year < 2000 || formData.year > new Date().getFullYear() + 5) {
      newErrors.year = "Enter a valid year";
    }
    if (!formData.test) newErrors.test = "Test name is required";
    if (!formData.totalMarks || formData.totalMarks <= 0) {
      newErrors.totalMarks = "Enter valid marks";
    }
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    dispatch(addAdmin(formData));
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      section: "",
      year: "",
      test: "",
      totalMarks: "",
      date: "",
    });
    setErrors({});
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <DescriptionIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Test</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <SubjectIcon fontSize="small" className="text-gray-500 mr-2" /> Subject
                </label>
                <Select
                  value={formData.subject}
                  name="subject"
                  onChange={handleChange}
                  displayEmpty
                  className="w-full"
                >
                  <MenuItem value=""><em>Select subject</em></MenuItem>
                  {subjects.map((subj) => (
                    <MenuItem key={subj} value={subj}>{subj}</MenuItem>
                  ))}
                </Select>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <ClassIcon fontSize="small" className="text-gray-500 mr-2" /> Section
                </label>
                <Select
                  value={formData.section}
                  name="section"
                  onChange={handleChange}
                  displayEmpty
                  className="w-full"
                >
                  <MenuItem value=""><em>Select section</em></MenuItem>
                  {sections.map((sec) => (
                    <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                  ))}
                </Select>
                {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CalendarIcon fontSize="small" className="text-gray-500 mr-2" /> Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. 2023"
                />
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <DescriptionIcon fontSize="small" className="text-gray-500 mr-2" /> Test Name
                </label>
                <input
                  type="text"
                  name="test"
                  value={formData.test}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter test name"
                />
                {errors.test && <p className="text-red-500 text-xs mt-1">{errors.test}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <GradeIcon fontSize="small" className="text-gray-500 mr-2" /> Total Marks
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. 100"
                />
                {errors.totalMarks && <p className="text-red-500 text-xs mt-1">{errors.totalMarks}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <DateRangeIcon fontSize="small" className="text-gray-500 mr-2" /> Test Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <Button variant="outlined" onClick={resetForm}>Clear Form</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? (
                  <Spinner message="Creating Test..." height={24} width={140} color="#fff" />
                ) : (
                  "Edit Test"
                )}
              </Button>
            </div>

            {/* Alerts */}
            {submitSuccess && (
              <Box mt={4}>
                <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                  Test created successfully!
                </Alert>
              </Box>
            )}
            {errors.backendError && (
              <Box mt={4}>
                <Alert severity="error" onClose={() => setErrors(prev => ({ ...prev, backendError: "" }))}>
                  {errors.backendError}
                </Alert>
              </Box>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
