import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Grid,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CalendarToday,
  FilterList,
  Search,
  Add,
  Edit,
  Delete,
  Event,
  School,
  BeachAccess,
  Assignment,
  People,
  StarBorder,
  Star,
} from '@mui/icons-material';

const Body = () => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    eventType: 'all',
    class: 'all',
    section: 'all',
    importantOnly: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockData = [
          {
            _id: '1',
            title: 'Midterm Exams',
            description: 'Midterm examinations for all classes',
            startDate: '2024-03-15',
            endDate: '2024-03-20',
            eventType: 'exam',
            isImportant: true,
            forClass: { _id: 'class1', name: 'Class 10' },
            forSection: { _id: 'section1', name: 'A' },
          },
          {
            _id: '2',
            title: 'Summer Vacation',
            description: 'School closed for summer break',
            startDate: '2024-05-01',
            endDate: '2024-06-15',
            eventType: 'holiday',
            isImportant: true,
          },
          {
            _id: '3',
            title: 'PTA Meeting',
            description: 'Quarterly parent-teacher meeting',
            startDate: '2024-04-10',
            endDate: '2024-04-10',
            eventType: 'meeting',
            forClass: { _id: 'class2', name: 'Class 12' },
          },
          {
            _id: '4',
            title: 'Science Fair',
            description: 'Annual school science fair competition',
            startDate: '2024-04-25',
            endDate: '2024-04-26',
            eventType: 'event',
            isImportant: true,
          },
        ];
        setEvents(mockData);
        setFilteredEvents(mockData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;

    if (filters.eventType !== 'all') {
      result = result.filter((event) => event.eventType === filters.eventType);
    }

    if (filters.class !== 'all') {
      result = result.filter(
        (event) => event.forClass && event.forClass._id === filters.class
      );
    }

    if (filters.section !== 'all') {
      result = result.filter(
        (event) => event.forSection && event.forSection._id === filters.section
      );
    }

    if (filters.importantOnly) {
      result = result.filter((event) => event.isImportant);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.description &&
            event.description.toLowerCase().includes(query))
      );
    }

    setFilteredEvents(result);
  }, [events, filters, searchQuery]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'holiday':
        return <BeachAccess color="warning" />;
      case 'exam':
        return <Assignment color="error" />;
      case 'event':
        return <Event color="primary" />;
      case 'meeting':
        return <People color="info" />;
      default:
        return <Event color="action" />;
    }
  };

  const formatDateRange = (start, end) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const startDate = new Date(start).toLocaleDateString(undefined, options);
    const endDate = new Date(end).toLocaleDateString(undefined, options);
    return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <CalendarToday color="primary" fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          Academic Calendar
        </Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ ml: 'auto' }}>
          Add Event
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={filters.eventType}
                  onChange={(e) =>
                    setFilters({ ...filters, eventType: e.target.value })
                  }
                  label="Event Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="holiday">Holiday</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Class</InputLabel>
                <Select
                  value={filters.class}
                  onChange={(e) =>
                    setFilters({ ...filters, class: e.target.value })
                  }
                  label="Class"
                >
                  <MenuItem value="all">All Classes</MenuItem>
                  <MenuItem value="class1">Class 10</MenuItem>
                  <MenuItem value="class2">Class 12</MenuItem>
                </Select>
              </FormControl>

              <IconButton
                color={filters.importantOnly ? 'primary' : 'default'}
                onClick={() =>
                  setFilters({
                    ...filters,
                    importantOnly: !filters.importantOnly,
                  })
                }
              >
                {filters.importantOnly ? (
                  <Star color="warning" />
                ) : (
                  <StarBorder />
                )}
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events ({filteredEvents.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {filteredEvents.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                No events found matching your criteria
              </Typography>
            ) : (
              <Stack spacing={2}>
                {filteredEvents.map((event) => (
                  <Paper
                    key={event._id}
                    elevation={2}
                    sx={{
                      p: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => handleEventClick(event)}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      {getEventIcon(event.eventType)}
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6">{event.title}</Typography>
                          {event.isImportant && (
                            <Star color="warning" fontSize="small" />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateRange(event.startDate, event.endDate)}
                        </Typography>
                        {event.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {event.description}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {event.forClass && (
                            <Chip
                              label={event.forClass.name}
                              size="small"
                              icon={<School fontSize="small" />}
                            />
                          )}
                          {event.forSection && (
                            <Chip
                              label={`Section ${event.forSection.name}`}
                              size="small"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {selectedEvent && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={1}>
                {getEventIcon(selectedEvent.eventType)}
                <Typography variant="h6">{selectedEvent.title}</Typography>
                {selectedEvent.isImportant && <Star color="warning" />}
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Typography>
                  <strong>Date:</strong>{' '}
                  {formatDateRange(
                    selectedEvent.startDate,
                    selectedEvent.endDate
                  )}
                </Typography>
                {selectedEvent.description && (
                  <Typography>
                    <strong>Description:</strong>{' '}
                    {selectedEvent.description}
                  </Typography>
                )}
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={selectedEvent.eventType}
                    color="primary"
                    variant="outlined"
                  />
                  {selectedEvent.forClass && (
                    <Chip
                      label={`Class: ${selectedEvent.forClass.name}`}
                      size="small"
                    />
                  )}
                  {selectedEvent.forSection && (
                    <Chip
                      label={`Section: ${selectedEvent.forSection.name}`}
                      size="small"
                    />
                  )}
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<Edit />}
                onClick={() => {
                  setOpenDialog(false);
                  // Navigate to edit page
                }}
              >
                Edit
              </Button>
              <Button
                startIcon={<Delete />}
                color="error"
                onClick={() => {
                  setOpenDialog(false);
                  // Handle delete
                }}
              >
                Delete
              </Button>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Body;
