import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Clear,
  Description,
  Event,
  EventNote,
  Category,
} from '@mui/icons-material';

const Spinner = ({ message }) => <span>{message}</span>;

const Body = () => {
  const [value, setValue] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    academicYear: '',
    eventType: '',
    eventTypeOther: '',
    forClass: '',
    forSection: '',
    isImportant: false,
  });

  const [error, setError] = useState({
    backendError: '',
  });

  const [loading, setLoading] = useState(false);

  const classes = [
    "Class 10A",
    "Class 9B",
    "Class 8C",
  ];

  const eventTypes = ["holiday", "exam", "event", "meeting", "other"];

  const resetForm = () => {
    setValue({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      academicYear: '',
      eventType: '',
      eventTypeOther: '',
      forClass: '',
      forSection: '',
      isImportant: false,
    });
    setError({ backendError: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation example: startDate <= endDate
    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      setError({ backendError: "Start date cannot be after end date" });
      return;
    }

    setLoading(true);

    // Prepare final eventType value (handle "Other")
    const eventTypeFinal = value.eventType === 'other' ? value.eventTypeOther : value.eventType;

    const submittedData = {
      title: value.title,
      description: value.description,
      startDate: value.startDate,
      endDate: value.endDate,
      academicYear: value.academicYear,
      eventType: eventTypeFinal,
      forClass: value.forClass,
      forSection: value.forSection,
      isImportant: value.isImportant,
    };

    // Simulated API call
    setTimeout(() => {
      console.log('Submitted Data:', submittedData);
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
          <h1 className="text-2xl font-bold text-gray-800">Create Academic Calendar Event</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Description className="text-gray-500 mr-2" fontSize="small" />
                    Title
                  </label>
                  <TextField
                    placeholder="Enter event title"
                    required
                    fullWidth
                    size="small"
                    value={value.title}
                    onChange={(e) => setValue({ ...value, title: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Description className="text-gray-500 mr-2" fontSize="small" />
                    Description
                  </label>
                  <TextField
                    placeholder="Enter event description"
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    value={value.description}
                    onChange={(e) => setValue({ ...value, description: e.target.value })}
                  />
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Category className="text-gray-500 mr-2" fontSize="small" />
                    Academic Year
                  </label>
                  <TextField
                    placeholder="e.g. 2024-2025"
                    required
                    fullWidth
                    size="small"
                    value={value.academicYear}
                    onChange={(e) => setValue({ ...value, academicYear: e.target.value })}
                  />
                </div>

                {/* For Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Category className="text-gray-500 mr-2" fontSize="small" />
                    Section
                  </label>
                  <TextField
                    placeholder="Enter section"
                    fullWidth
                    size="small"
                    value={value.forSection}
                    onChange={(e) => setValue({ ...value, forSection: e.target.value })}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Event className="text-gray-500 mr-2" fontSize="small" />
                    Start Date
                  </label>
                  <TextField
                    type="date"
                    required
                    fullWidth
                    size="small"
                    value={value.startDate}
                    onChange={(e) => setValue({ ...value, startDate: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <EventNote className="text-gray-500 mr-2" fontSize="small" />
                    End Date
                  </label>
                  <TextField
                    type="date"
                    required
                    fullWidth
                    size="small"
                    value={value.endDate}
                    onChange={(e) => setValue({ ...value, endDate: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Category className="text-gray-500 mr-2" fontSize="small" />
                    Event Type
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      value={value.eventType}
                      required
                      displayEmpty
                      onChange={(e) => {
                        setValue({ ...value, eventType: e.target.value, eventTypeOther: '' });
                      }}
                      sx={{
                        height: '40px',
                        '& .MuiSelect-select': {
                          paddingTop: '8px',
                          paddingBottom: '8px',
                        },
                        borderRadius: '8px',
                      }}
                    >
                      <MenuItem value="">
                        <em>Select event type</em>
                      </MenuItem>
                      {eventTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Show textbox if eventType === 'other' */}
                {value.eventType === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Category className="text-gray-500 mr-2" fontSize="small" />
                      Specify Event Type
                    </label>
                    <TextField
                      placeholder="Specify other event type"
                      required
                      fullWidth
                      size="small"
                      value={value.eventTypeOther}
                      onChange={(e) =>
                        setValue({ ...value, eventTypeOther: e.target.value })
                      }
                    />
                  </div>
                )}

                {/* For Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Category className="text-gray-500 mr-2" fontSize="small" />
                    Class
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      required
                      displayEmpty
                      value={value.forClass}
                      onChange={(e) => setValue({ ...value, forClass: e.target.value })}
                      sx={{
                        height: '40px',
                        '& .MuiSelect-select': {
                          paddingTop: '8px',
                          paddingBottom: '8px',
                        },
                        borderRadius: '8px',
                      }}
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

                {/* Is Important */}
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.isImportant}
                        onChange={(e) =>
                          setValue({ ...value, isImportant: e.target.checked })
                        }
                        color="primary"
                      />
                    }
                    label="Mark as Important"
                  />
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
                {loading ? <Spinner message="Adding Event..." /> : 'Add Event'}
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
