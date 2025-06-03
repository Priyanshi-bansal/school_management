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
  AccessTime,
  Person,
  Book,
  CalendarToday,
} from '@mui/icons-material';

const Spinner = ({ message }) => <span>{message}</span>;

const Body = () => {
  const [value, setValue] = useState({
    day: '',
    slot: '',
    subject: '',
    teacher: '',
  });

  const [error, setError] = useState({ backendError: '' });
  const [loading, setLoading] = useState(false);

  const subjects = ['Math', 'Science', 'English'];
  const teachers = ['Dr. John', 'Ms. Smith', 'Mr. Lee'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const dayWiseSlots = {
    Monday: ['08:00 - 09:00', '09:00 - 10:00'],
    Tuesday: ['10:00 - 11:00', '11:00 - 12:00'],
    Wednesday: ['01:00 - 02:00'],
    Thursday: ['02:00 - 03:00', '03:00 - 04:00'],
    Friday: ['08:00 - 09:00', '11:00 - 12:00'],
  };

  const resetForm = () => {
    setValue({ day: '', slot: '', subject: '', teacher: '' });
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

  const handleChange = (field, val) => {
    // If day changes, reset slot
    if (field === 'day') {
      setValue({ ...value, day: val, slot: '' });
    } else {
      setValue({ ...value, [field]: val });
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Add Timetable Slot</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CalendarToday className="text-gray-500 mr-2" fontSize="small" />
                  Day
                </label>
                <FormControl fullWidth size="small">
                  <Select
                    required
                    displayEmpty
                    value={value.day}
                    onChange={(e) => handleChange('day', e.target.value)}
                  >
                    <MenuItem value=""><em>Select day</em></MenuItem>
                    {days.map((d, idx) => (
                      <MenuItem key={idx} value={d}>{d}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <AccessTime className="text-gray-500 mr-2" fontSize="small" />
                  Slot
                </label>
                <FormControl fullWidth size="small" disabled={!value.day}>
                  <Select
                    required
                    displayEmpty
                    value={value.slot}
                    onChange={(e) => handleChange('slot', e.target.value)}
                  >
                    <MenuItem value=""><em>Select slot</em></MenuItem>
                    {(dayWiseSlots[value.day] || []).map((slot, idx) => (
                      <MenuItem key={idx} value={slot}>{slot}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Subject */}
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
                    onChange={(e) => handleChange('subject', e.target.value)}
                  >
                    <MenuItem value=""><em>Select subject</em></MenuItem>
                    {subjects.map((subj, idx) => (
                      <MenuItem key={idx} value={subj}>{subj}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Person className="text-gray-500 mr-2" fontSize="small" />
                  Teacher
                </label>
                <FormControl fullWidth size="small">
                  <Select
                    required
                    displayEmpty
                    value={value.teacher}
                    onChange={(e) => handleChange('teacher', e.target.value)}
                  >
                    <MenuItem value=""><em>Select teacher</em></MenuItem>
                    {teachers.map((t, idx) => (
                      <MenuItem key={idx} value={t}>{t}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={resetForm}
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
                {loading ? <Spinner message="Adding Slot..." /> : 'Add Slot'}
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
