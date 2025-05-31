import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Person,
  Work,
  Edit as EditIcon,
  Add as AddIcon,
  Clear,
  Today,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';

const Spinner = ({ message }) => <span>{message}</span>;

const Body = () => {
  const location = useLocation();
  const sectionToEdit = location.state?.section || null;

  const [value, setValue] = useState({
    name: '',
    academicYear: '',
    class: '',
    capacity: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [error, setError] = useState({ backendError: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sectionToEdit) {
      setValue({
        name: sectionToEdit.name || '',
        academicYear: sectionToEdit.academicYear || '',
        class: sectionToEdit.class || '',
        capacity: sectionToEdit.capacity || '',
        startDate: sectionToEdit.startDate || '',
        endDate: sectionToEdit.endDate || '',
        description: sectionToEdit.description || '',
      });
    }
  }, [sectionToEdit]);

  const resetForm = () => {
    setValue({
      name: '',
      academicYear: '',
      class: '',
      capacity: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setError({ backendError: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log(sectionToEdit ? 'Updated Data:' : 'Submitted Data:', value);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <EditIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">
            {sectionToEdit ? 'Edit Academic' : 'Add Academic'}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Person className="text-gray-500 mr-2" fontSize="small" />
                    Student Name
                  </label>
                  <input
                    placeholder="Enter session name"
                    required
                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.name}
                    onChange={(e) => setValue({ ...value, name: e.target.value })}
                  />
                </div>

                {/* Is Current */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Work className="text-gray-500 mr-2" fontSize="small" />
                    Is Current
                  </label>
                  <input
                    placeholder="yes or no"
                    required
                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    value={value.academicYear}
                    onChange={(e) =>
                      setValue({ ...value, academicYear: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Today className="text-gray-500 mr-2" fontSize="small" />
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={value.startDate}
                    onChange={(e) =>
                      setValue({ ...value, startDate: e.target.value })
                    }
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Today className="text-gray-500 mr-2" fontSize="small" />
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={value.endDate}
                    onChange={(e) =>
                      setValue({ ...value, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Description Full Width */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Work className="text-gray-500 mr-2" fontSize="small" />
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                  value={value.description}
                  onChange={(e) => setValue({ ...value, description: e.target.value })}
                />
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
                  <Spinner message={sectionToEdit ? 'Updating...' : 'Adding...'} />
                ) : sectionToEdit ? (
                  'Update Academic'
                ) : (
                  'Add Academic'
                )}
              </Button>
            </div>

            {/* Error Message */}
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
