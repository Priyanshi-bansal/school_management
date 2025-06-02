import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Sample timetable JSON data
const timetableData = {
  '9:00-10:00': {
    Monday: { subject: 'Math', teacher: 'Mr. Sharma' },
    Tuesday: { subject: 'English', teacher: 'Ms. Verma' },
    Wednesday: { subject: 'Physics', teacher: 'Mr. Gupta' },
    Thursday: { subject: 'Biology', teacher: 'Ms. Iyer' },
    Friday: { subject: 'Computer Science', teacher: 'Mr. Khan' },
    Saturday: null,
    Sunday: null,
  },
  '10:00-11:00': {
    Monday: { subject: 'Science', teacher: 'Ms. Singh' },
    Tuesday: { subject: 'History', teacher: 'Mr. Das' },
    Wednesday: { subject: 'Chemistry', teacher: 'Ms. Roy' },
    Thursday: { subject: 'Geography', teacher: 'Mr. Patel' },
    Friday: { subject: 'Physical Education', teacher: 'Coach Reddy' },
    Saturday: null,
    Sunday: null,
  },
  // Add more slots as needed
};

const Body = () => {
  return (
    <Box className="flex-1 p-6 bg-gray-50 min-h-screen">
      <Box maxWidth="5xl" marginX="auto">
        <Box className="flex items-center justify-center mb-8 space-x-2">
          <ScheduleIcon sx={{ color: '#4f46e5', fontSize: 32 }} />
          <Typography
            variant="h4"
            component="h1"
            className="font-extrabold text-gray-800"
          >
            Weekly Class Timetable
          </Typography>
        </Box>

        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.300',
            overflowX: 'auto',
          }}
        >
          <Box
            component="table"
            className="w-full border-collapse"
            sx={{ tableLayout: 'fixed', minWidth: 700 }}
          >
            <Box component="thead" className="bg-indigo-100">
              <Box component="tr">
                <Box
                  component="th"
                  className="border border-gray-300 px-4 py-3 font-bold text-left w-28 text-indigo-700"
                >
                  Time
                </Box>
                {daysOfWeek.map((day) => (
                  <Box
                    key={day}
                    component="th"
                    className="border border-gray-300 px-4 py-3 font-bold text-center text-indigo-700"
                  >
                    {day}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box component="tbody">
              {Object.entries(timetableData).map(([timeSlot, dayData], idx) => (
                <Box
                  component="tr"
                  key={timeSlot}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <Box
                    component="td"
                    className="border border-gray-300 px-4 py-3 font-semibold text-indigo-700"
                  >
                    {timeSlot}
                  </Box>

                  {daysOfWeek.map((day) => {
                    const entry = dayData[day];
                    return (
                      <Box
                        component="td"
                        key={day}
                        className="border border-gray-300 px-3 py-3 align-top text-left min-w-[140px]"
                      >
                        {entry ? (
                          <>
                            <Typography
                              variant="subtitle1"
                              className="font-bold text-indigo-700"
                            >
                              {entry.subject}
                            </Typography>
                            <Typography variant="body2" className="text-gray-700 font-medium">
                              Teacher: {entry.teacher}
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            variant="body2"
                            className="text-gray-400 text-center font-medium"
                          >
                            -
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;
