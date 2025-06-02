import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  Clear,
  CheckCircle,
  School,
  People,
} from '@mui/icons-material';

const Spinner = ({ message }) => <span>{message}</span>;

const EditTimeTable = ({ initialData, onUpdate }) => {
  const [value, setValue] = useState({
    class: '',
    section: '',
    academicYear: '',
    effectiveFrom: '',
    effectiveTill: '',
    isActive: '',
  });

  const [error, setError] = useState({ backendError: '' });
  const [loading, setLoading] = useState(false);

  const classes = ['6', '7', '8', '9', '10'];
  const sections = ['A', 'B', 'C'];
  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];

  // Initialize form with existing data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      setValue({
        class: initialData.class || '',
        section: initialData.section || '',
        academicYear: initialData.academicYear || '',
        effectiveFrom: initialData.effectiveFrom || '',
        effectiveTill: initialData.effectiveTill || '',
        isActive: typeof initialData.isActive === 'boolean' ? initialData.isActive : '',
      });
    }
  }, [initialData]);

  const resetForm = () => {
    if (initialData) {
      setValue({
        class: initialData.class || '',
        section: initialData.section || '',
        academicYear: initialData.academicYear || '',
        effectiveFrom: initialData.effectiveFrom || '',
        effectiveTill: initialData.effectiveTill || '',
        isActive: typeof initialData.isActive === 'boolean' ? initialData.isActive : '',
      });
    } else {
      setValue({
        class: '',
        section: '',
        academicYear: '',
        effectiveFrom: '',
        effectiveTill: '',
        isActive: '',
      });
    }
    setError({ backendError: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API update call
    setTimeout(() => {
      console.log('Updated Data:', value);
      setLoading(false);
      if (onUpdate) onUpdate(value); // callback after update
    }, 1000);
  };

  const handleChange = (field, val) => {
    if (field === 'isActive') {
      setValue({ ...value, [field]: val === 'true' });
    } else {
      setValue({ ...value, [field]: val });
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Typography variant="h4" component="h1" className="font-bold text-gray-800">
            Edit Class Time Table
          </Typography>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    onChange={(e) => handleChange('class', e.target.value)}
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

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <People className="text-gray-500 mr-2" fontSize="small" />
                  Section
                </label>
                <FormControl fullWidth size="small">
                  <Select
                    required
                    displayEmpty
                    value={value.section}
                    onChange={(e) => handleChange('section', e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select section</em>
                    </MenuItem>
                    {sections.map((sec, idx) => (
                      <MenuItem key={idx} value={sec}>
                        {sec}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <FormControl fullWidth size="small">
                  <Select
                    required
                    displayEmpty
                    value={value.academicYear}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
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

              {/* Effective From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective From
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  value={value.effectiveFrom}
                  onChange={(e) => handleChange('effectiveFrom', e.target.value)}
                />
              </div>

              {/* Effective Till */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Till
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  value={value.effectiveTill}
                  onChange={(e) => handleChange('effectiveTill', e.target.value)}
                />
              </div>

              {/* Is Active */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CheckCircle className="text-gray-500 mr-2" fontSize="small" />
                  Is Active
                </label>
                <FormControl fullWidth size="small">
                  <Select
                    required
                    displayEmpty
                    value={value.isActive === '' ? '' : String(value.isActive)}
                    onChange={(e) => handleChange('isActive', e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select status</em>
                    </MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <Button variant="outlined" startIcon={<Clear />} onClick={resetForm}>
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? <Spinner message="Updating..." /> : 'Update Time Table'}
              </Button>
            </div>

            {error.backendError && (
              <Box className="mt-4 p-3 bg-red-50 rounded-lg">
                <Typography className="text-red-600 text-sm">{error.backendError}</Typography>
              </Box>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTimeTable;
