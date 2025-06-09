import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  Box,
  Tooltip,
  IconButton,
  useTheme,
  Paper,
  Grid
} from '@mui/material';
import {
  Event as EventIcon,
  School as SchoolIcon,
  DateRange as DateRangeIcon,
  HolidayVillage as HolidayIcon,
  Assignment as ExamIcon,
  Groups as MeetingIcon,
  Star as ImportantIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const EventTypeIcon = ({ type, fontSize = 'medium' }) => {
  const iconProps = { fontSize };
  switch (type) {
    case 'holiday': return <HolidayIcon color="success" {...iconProps} />;
    case 'exam': return <ExamIcon color="error" {...iconProps} />;
    case 'meeting': return <MeetingIcon color="info" {...iconProps} />;
    case 'event': return <EventIcon color="primary" {...iconProps} />;
    default: return <EventIcon color="secondary" {...iconProps} />;
  }
};

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', minWidth: 40 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

const Body = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch the event by ID from your API
  useEffect(() => {
    // Simulate API fetch
    const dummyEvents = {
      '1': {
        id: '1',
        title: 'Midterm Examinations',
        description: 'All students must complete their midterm exams during this period. Exams will cover all material from the beginning of the semester up to this point.',
        startDate: '2023-10-15T08:00:00',
        endDate: '2023-10-20T17:00:00',
        eventType: 'exam',
        isImportant: true,
        academicYear: { name: '2023-2024' },
        forClass: { name: 'Grade 10' },
        forSection: { name: 'Science' },
        location: 'Main Campus - Building A',
        organizer: 'Academic Department',
        additionalNotes: 'Bring your student ID and required materials. No electronic devices allowed.'
      },
      '2': {
        id: '2',
        title: 'Thanksgiving Holiday',
        description: 'College will be closed for the Thanksgiving holiday weekend.',
        startDate: '2023-11-23T00:00:00',
        endDate: '2023-11-26T23:59:59',
        eventType: 'holiday',
        isImportant: false,
        academicYear: { name: '2023-2024' },
        forClass: { name: 'All' },
        forSection: { name: 'All' },
        location: 'N/A',
        organizer: 'Administration',
        additionalNotes: 'Classes resume on Monday, November 27th.'
      }
    };

    setTimeout(() => {
      setEvent(dummyEvents || null);
      setLoading(false);
    }, 500);
  }, [eventId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/academic-calendar/edit/${eventId}`);
  };

  const handleDelete = () => {
    // Delete logic would go here
    console.log('Delete event', eventId);
    navigate('/academic-calendar');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading event details...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Event not found
        </Typography>
        <IconButton onClick={handleBack} sx={{ mt: 2 }}>
          <BackIcon /> Back to calendar
        </IconButton>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Event Details
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleEdit} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 56, 
              height: 56 
            }}>
              <EventTypeIcon type={event.eventType} fontSize="large" />
            </Avatar>
          }
          action={
            event.isImportant && (
              <Tooltip title="Important Event">
                <ImportantIcon color="warning" sx={{ fontSize: 32, mr: 2 }} />
              </Tooltip>
            )
          }
          title={
            <Typography variant="h4" component="div">
              {event.title}
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" color="text.secondary">
              {format(parseISO(event.startDate), 'MMMM d, yyyy')}
              {event.endDate && 
                ` - ${format(parseISO(event.endDate), 'MMMM d, yyyy')}`}
            </Typography>
          }
          sx={{ 
            pb: 0,
            '& .MuiCardHeader-content': {
              overflow: 'hidden'
            }
          }}
        />

        <CardContent>
          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
            {event.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<DateRangeIcon color="action" />}
                label="Event Type"
                value={event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
              />
              <DetailItem
                icon={<SchoolIcon color="action" />}
                label="Academic Year"
                value={event.academicYear.name}
              />
              <DetailItem
                icon={<EventIcon color="action" />}
                label="For Class"
                value={event.forClass.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem
                icon={<EventIcon color="action" />}
                label="For Section"
                value={event.forSection.name}
              />
              <DetailItem
                icon={<EventIcon color="action" />}
                label="Location"
                value={event.location}
              />
              <DetailItem
                icon={<EventIcon color="action" />}
                label="Organizer"
                value={event.organizer}
              />
            </Grid>
          </Grid>

          {event.additionalNotes && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Additional Notes
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {event.additionalNotes}
              </Typography>
            </>
          )}
        </CardContent>
      </Paper>
    </Container>
  );
};

export default Body;