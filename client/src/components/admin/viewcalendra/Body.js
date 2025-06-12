import React from 'react';
import {
  Container, Typography, Paper, Grid, Box, Divider
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import EventIcon from '@mui/icons-material/Event'; 

// 🔹 Static JSON Data
const eventData = [
  {
    id: "1",
    title: "Annual Sports Day",
    description: "A full-day event with sports competitions.",
    startDate: "2024-12-01T08:00:00.000Z",
    endDate: "2024-12-01T17:00:00.000Z",
    eventType: "event",
    academicYear: { name: "2024-2025" },
    forClass: { name: "Grade 6" },
    forSection: { name: "A" },
    isImportant: true,
    createdBy: { name: "Admin John" },
    location: "Main Ground",
    organizer: "Sports Dept",
    additionalNotes: "Wear house uniforms."
  },
  
];

const Body = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <EventIcon color="primary" sx={{ mr: 1 }} />
  <Typography variant="h5" >
    Academic Calendar Events
  </Typography>
</Box>
      {eventData.map((event) => (
        <Paper key={event.id} elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {event.title}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {format(parseISO(event.startDate), 'MMMM d, yyyy')} - {format(parseISO(event.endDate), 'MMMM d, yyyy')}
          </Typography>
          <Typography variant="body1" paragraph>{event.description}</Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Event Type:</strong> {event.eventType}</Typography>
              <Typography><strong>Class:</strong> {event.forClass?.name}</Typography>
              <Typography><strong>Section:</strong> {event.forSection?.name}</Typography>
              <Typography><strong>Academic Year:</strong> {event.academicYear?.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Location:</strong> {event.location || 'N/A'}</Typography>
              <Typography><strong>Organizer:</strong> {event.organizer || 'N/A'}</Typography>
              <Typography><strong>Created By:</strong> {event.createdBy?.name}</Typography>
              <Typography><strong>Important:</strong> {event.isImportant ? 'Yes' : 'No'}</Typography>
            </Grid>
          </Grid>

          {event.additionalNotes && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1"><strong>Notes:</strong></Typography>
              <Typography variant="body2">{event.additionalNotes}</Typography>
            </>
          )}
        </Paper>
      ))}
    </Container>
  );
};

export default Body;
