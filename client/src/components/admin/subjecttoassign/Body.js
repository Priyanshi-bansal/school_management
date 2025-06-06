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
    name: '',
    academicYear: '',
    electiveGroup: '',
    class: '',
    isElective: '',
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

  const electiveGroups = [
    'Science',
    'Commerce',
    'Arts',
    'Technology',
  ];

  const resetForm = () => {
    setValue({
      name: '',
      academicYear: '',
      electiveGroup: '',
      class: '',
      isElective: '',
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
          <h1 className="text-2xl font-bold text-gray-800">Assign Subject To Class</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Person className="text-gray-500 mr-2" fontSize="small" />
                    Subject Name
                  </label>
                  <input
                    placeholder="Enter subject name"
                    required
                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.name}
                    onChange={(e) => setValue({ ...value, name: e.target.value })}
                  />
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

                {/* Elective Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Work className="text-gray-500 mr-2" fontSize="small" />
                    Elective Group
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.electiveGroup}
                      onChange={(e) => setValue({ ...value, electiveGroup: e.target.value })}
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
                        <em>Select elective group</em>
                      </MenuItem>
                      {electiveGroups.map((group, idx) => (
                        <MenuItem key={idx} value={group}>
                          {group}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Right Column */}
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

                {/* Is Elective */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Work className="text-gray-500 mr-2" fontSize="small" />
                    Is Elective
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.isElective}
                      onChange={(e) => setValue({ ...value, isElective: e.target.value })}
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
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
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
                {loading ? (
                  <Spinner message="Adding Section..." />
                ) : (
                  'Assign Subject'
                )}
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
