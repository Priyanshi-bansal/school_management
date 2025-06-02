import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Clear,
  Notes as NotesIcon,
  Title as TitleIcon,
  FormatListNumbered as NumberIcon,
} from '@mui/icons-material';

const Spinner = ({ message }) => <span>{message}</span>;

const Body = () => {
  const [value, setValue] = useState({
    chapterNumber: '',
    chapterTitle: '',
    chapterDescription: '',
  });

  const [error, setError] = useState({
    backendError: '',
  });

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setValue({
      chapterNumber: '',
      chapterTitle: '',
      chapterDescription: '',
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

  const chapterOptions = Array.from({ length: 20 }, (_, i) => i + 1); // Chapters 1 to 20

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <AddIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Chapter</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
           <div className="flex flex-col lg:flex-row gap-6">
  {/* Left Side */}
  <div className="flex-1 space-y-6">
    {/* Chapter Number Dropdown */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <NumberIcon className="text-gray-500 mr-2"  />
        Chapter Number
      </label>
      <TextField
        select
        fullWidth
        size="small"
        variant="outlined"
        required
        value={value.chapterNumber}
        onChange={(e) =>
          setValue({ ...value, chapterNumber: e.target.value })
        }
        placeholder="Select chapter number"
      >
        {chapterOptions.map((num) => (
          <MenuItem key={num} value={num}>
            Chapter {num}
          </MenuItem>
        ))}
      </TextField>
    </div>

    {/* Chapter Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <TitleIcon className="text-gray-500 mr-2"/>
        Chapter Title
      </label>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        required
        value={value.chapterTitle}
        onChange={(e) =>
          setValue({ ...value, chapterTitle: e.target.value })
        }
        placeholder="Enter chapter title"
      />
    </div>
  </div>

  {/* Right Side */}
  <div className="flex-1 space-y-6">
    {/* Chapter Description */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        <NotesIcon className="text-gray-500 mr-2" fontSize="small" />
        Chapter Description
      </label>
      <TextField
        fullWidth
        multiline
        minRows={6}
        size="small"
        variant="outlined"
        required
        value={value.chapterDescription}
        onChange={(e) =>
          setValue({ ...value, chapterDescription: e.target.value })
        }
        placeholder="Enter chapter description"
      />
    </div>
  </div>
</div>

            {/* Action Buttons */}
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
                  <Spinner message="Saving..." />
                ) : (
                  'Edit Chapter'
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
