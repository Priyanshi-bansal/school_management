import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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

// Spinner Component
const Spinner = ({ message }) => (
  <span className="text-sm text-gray-600">{message}</span>
);

const EditPage = ({ initialData, onSubmit, loading, error }) => {
  const eventTypes = ["holiday", "exam", "event", "meeting", "other"];
  const classes = ["Class 10", "Class 9", "Class 8"];

  const getInitialValue = (data) => ({
    title: data?.title || '',
    description: data?.description || '',
    startDate: data?.startDate || '',
    endDate: data?.endDate || '',
    academicYear: data?.academicYear || '',
    eventType: data?.eventType && eventTypes.includes(data.eventType)
      ? data.eventType
      : data?.eventType ? 'other' : '',
    eventTypeOther: data?.eventType && !eventTypes.includes(data.eventType)
      ? data.eventType
      : '',
    forClass: data?.forClass || '',
    forSection: data?.forSection || '',
    isImportant: !!data?.isImportant,
  });

  const [value, setValue] = useState(getInitialValue(initialData));

  useEffect(() => {
    setValue(getInitialValue(initialData));
  }, [initialData]);

  const resetForm = () => {
    setValue(getInitialValue(initialData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      alert('End Date must be after Start Date.');
      return;
    }

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

    onSubmit(submittedData);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Academic Calendar Event</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Title */}
                <TextField
                  label={<span className="flex items-center"><Description fontSize="small" className="mr-2 text-gray-500" />Title</span>}
                  placeholder="Enter event title"
                  required
                  fullWidth
                  size="small"
                  value={value.title}
                  onChange={(e) => setValue({ ...value, title: e.target.value })}
                />

                {/* Description */}
                <TextField
                  label={<span className="flex items-center"><Description fontSize="small" className="mr-2 text-gray-500" />Description</span>}
                  placeholder="Enter event description"
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  value={value.description}
                  onChange={(e) => setValue({ ...value, description: e.target.value })}
                />

                {/* Academic Year */}
                <TextField
                  label={<span className="flex items-center"><Category fontSize="small" className="mr-2 text-gray-500" />Academic Year</span>}
                  placeholder="e.g. 2024-2025"
                  required
                  fullWidth
                  size="small"
                  value={value.academicYear}
                  onChange={(e) => setValue({ ...value, academicYear: e.target.value })}
                />

                {/* Section */}
                <TextField
                  label={<span className="flex items-center"><Category fontSize="small" className="mr-2 text-gray-500" />Section</span>}
                  placeholder="Enter section"
                  fullWidth
                  size="small"
                  value={value.forSection}
                  onChange={(e) => setValue({ ...value, forSection: e.target.value })}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Start Date */}
                <TextField
                  label={<span className="flex items-center"><Event fontSize="small" className="mr-2 text-gray-500" />Start Date</span>}
                  type="date"
                  required
                  fullWidth
                  size="small"
                  value={value.startDate}
                  onChange={(e) => setValue({ ...value, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />

                {/* End Date */}
                <TextField
                  label={<span className="flex items-center"><EventNote fontSize="small" className="mr-2 text-gray-500" />End Date</span>}
                  type="date"
                  required
                  fullWidth
                  size="small"
                  value={value.endDate}
                  onChange={(e) => setValue({ ...value, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />

                {/* Event Type */}
                <FormControl fullWidth size="small">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Category className="text-gray-500 mr-2" fontSize="small" />
                    Event Type
                  </label>
                  <Select
                    value={value.eventType}
                    required
                    displayEmpty
                    onChange={(e) => setValue({ ...value, eventType: e.target.value, eventTypeOther: '' })}
                    sx={{
                      height: '40px',
                      '& .MuiSelect-select': {
                        paddingTop: '8px',
                        paddingBottom: '8px',
                      },
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value=""><em>Select event type</em></MenuItem>
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Specify Other Type */}
                {value.eventType === 'other' && (
                  <TextField
                    label="Specify Event Type"
                    required
                    fullWidth
                    size="small"
                    placeholder="Specify other event type"
                    value={value.eventTypeOther}
                    onChange={(e) => setValue({ ...value, eventTypeOther: e.target.value })}
                  />
                )}

                {/* Class */}
                <FormControl fullWidth size="small">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Category className="text-gray-500 mr-2" fontSize="small" />
                    Class
                  </label>
                  <Select
                    value={value.forClass}
                    required
                    displayEmpty
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
                    <MenuItem value=""><em>Select class</em></MenuItem>
                    {classes.map((cls, idx) => (
                      <MenuItem key={idx} value={cls}>{cls}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Is Important */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value.isImportant}
                      onChange={(e) => setValue({ ...value, isImportant: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Mark as Important"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={resetForm}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={!loading && <AddIcon />}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? <Spinner message="Updating Event..." /> : 'Update Event'}
              </Button>
            </div>

            {/* Error */}
            {error?.backendError && (
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

export default EditPage;
