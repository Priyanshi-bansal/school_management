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
  School,
  Work,
  Book,
} from '@mui/icons-material';

const Spinner = ({ message }) => <span>{message}</span>;

const Body = () => {
  const [value, setValue] = useState({
    class: '',
    subject: '',
    academicYear: '',
  });

  const [error, setError] = useState({
    backendError: '',
  });

  const [loading, setLoading] = useState(false);

  const classes = ['Class 10A', 'Class 9B', 'Class 8C'];
  const subjects = ['Mathematics', 'Science', 'English'];
  const academicYears = ['2024-2025', '2023-2024', '2022-2023'];

  const resetForm = () => {
    setValue({
      class: '',
      subject: '',
      academicYear: '',
    });
    setError({ backendError: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Submitted Data:', value);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Add Syllabus</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column: Class and Subject */}
              <div className="space-y-5">
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
                    >
                      <MenuItem value="">
                        <em>Select class</em>
                      </MenuItem>
                      {classes.map((cls, idx) => (
                        <MenuItem key={idx} value={cls}>
                          {cls}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Book className="text-gray-500 mr-2" fontSize="small" />
                    Subject
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.subject}
                      onChange={(e) => setValue({ ...value, subject: e.target.value })}
                    >
                      <MenuItem value="">
                        <em>Select subject</em>
                      </MenuItem>
                      {subjects.map((subj, idx) => (
                        <MenuItem key={idx} value={subj}>
                          {subj}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Right column: Academic Year */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Work className="text-gray-500 mr-2" fontSize="small" />
                    Academic Year
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.academicYear}
                      onChange={(e) =>
                        setValue({ ...value, academicYear: e.target.value })
                      }
                    >
                      <MenuItem value="">
                        <em>Select academic year</em>
                      </MenuItem>
                      {academicYears.map((year, idx) => (
                        <MenuItem key={idx} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

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
                {loading ? (
                  <Spinner message="Adding Syllabus..." />
                ) : (
                  'Add Syllabus'
                )}
              </Button>
            </div>

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
