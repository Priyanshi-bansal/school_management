import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Clear,
  Person,
  School,
  Work,
} from '@mui/icons-material';

const Spinner = ({ message }) => <span>{message}</span>;

const Body = () => {
  const [value, setValue] = useState({
    class: '',
    academicYear: '',
    classSubject: '',
    teacherName: '',
  });

  const [error, setError] = useState({
    backendError: '',
  });

  const [loading, setLoading] = useState(false);

  const departments = [
    { department: 'Class 10' },
    { department: 'Class 9' },
    { department: 'Class 8' },
  ];

  const teachers = [
    'Mr. John Doe',
    'Ms. Jane Smith',
    'Mrs. Emily Johnson',
  ];

  const classSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
  ];

  const resetForm = () => {
    setValue({
      class: '',
      academicYear: '',
      classSubject: '',
      teacherName: '',
    });
    setError({ backendError: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulated API call
    setTimeout(() => {
      console.log('Submitted Data:', value);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Assign Teacher To classSubject</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <School className="text-gray-500 mr-2" fontSize="small" />
                    Class
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.class}
                      onChange={(e) => setValue({ ...value, class: e.target.value })}
                      sx={{
                        height: '40px',
                        '& .MuiSelect-select': {
                          paddingTop: '8px',
                          paddingBottom: '8px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                        borderRadius: '8px',
                      }}
                    >
                      <MenuItem value="">
                        <em>Select class</em>
                      </MenuItem>
                      {departments.map((dp, idx) => (
                        <MenuItem key={idx} value={dp.department}>
                          {dp.department}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Work className="text-gray-500 mr-2" fontSize="small" />
                    Academic Year
                  </label>
                  <input
                    placeholder="2024-2025"
                    required
                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.academicYear}
                    onChange={(e) => setValue({ ...value, academicYear: e.target.value })}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Class Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Work className="text-gray-500 mr-2" fontSize="small" />
                    Class Subject
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.classSubject}
                      onChange={(e) => setValue({ ...value, classSubject: e.target.value })}
                      sx={{
                        height: '40px',
                        '& .MuiSelect-select': {
                          paddingTop: '8px',
                          paddingBottom: '8px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                        borderRadius: '8px',
                      }}
                    >
                      <MenuItem value="">
                        <em>Select class subject</em>
                      </MenuItem>
                      {classSubjects.map((subject, idx) => (
                        <MenuItem key={idx} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Teacher Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Person className="text-gray-500 mr-2" fontSize="small" />
                    Teacher Name
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.teacherName}
                      onChange={(e) => setValue({ ...value, teacherName: e.target.value })}
                      sx={{
                        height: '40px',
                        '& .MuiSelect-select': {
                          paddingTop: '8px',
                          paddingBottom: '8px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                        borderRadius: '8px',
                      }}
                    >
                      <MenuItem value="">
                        <em>Select teacher</em>
                      </MenuItem>
                      {teachers.map((teacher, idx) => (
                        <MenuItem key={idx} value={teacher}>
                          {teacher}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={resetForm}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? <Spinner message="Adding Section..." /> : 'Assign Subject'}
              </Button>
            </div>

            {/* Error Display */}
            {error.backendError && (
              <Box className="mt-4 p-3 bg-red-50 rounded-lg">
                <Typography className="text-red-600 text-sm">
                  {error.backendError}
                </Typography>
              </Box>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
