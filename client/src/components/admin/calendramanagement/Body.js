import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import AddIcon from "@mui/icons-material/Add";

import {
  Button,
  Box,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  TextField,
  IconButton,
} from "@mui/material";

const Body = () => {
  const navigate = useNavigate();

  // Initial calendar events
  const [calendarEvents, setCalendarEvents] = useState([
    {
      _id: "1",
      title: "Annual Sports Day",
      startDate: "2025-01-15",
      endDate: "2025-01-17",
      forClass: "10A",
      forSection: "A",
      isImportant: true,
    },
    {
      _id: "2",
      title: "Mid Term Exams",
      startDate: "2025-03-01",
      endDate: "2025-03-10",
      forClass: "All",
      forSection: "All",
      isImportant: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedEvents, setSearchedEvents] = useState(calendarEvents);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync searchedEvents when calendarEvents change
  useEffect(() => {
    setSearchedEvents(calendarEvents);
  }, [calendarEvents]);

  // Search handler
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = calendarEvents.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchedEvents(filtered);
    } else {
      setSearchedEvents(calendarEvents);
    }
  };

  // Checkbox selection handler
  const handleCheckboxChange = (id) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  // Delete selected events
  const handleDelete = () => {
    const updated = calendarEvents.filter((e) => !selectedEvents.includes(e._id));
    setCalendarEvents(updated);
    setSelectedEvents([]);
  };

  // Delete single event
  const handleDeleteSingle = (id) => {
    const updated = calendarEvents.filter((e) => e._id !== id);
    setCalendarEvents(updated);
    setSelectedEvents((prev) => prev.filter((eid) => eid !== id));
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSearchedEvents(calendarEvents);
  };

  return (
    <Box sx={{ flex: 0.8, mt: 3, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <EngineeringIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" color="textPrimary">
            Academic Calendar Management
          </Typography>
          <Chip
            label={`Total Events: ${calendarEvents.length}`}
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/createcalendra")}
            sx={{
              ml: "auto",
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
            }}
          >
            Create Calendar Event
          </Button>
        </Box>

        {/* Search & Clear Filters */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search Event"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<ClearAllIcon />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Box>

          {/* Loading Spinner */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Events Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedEvents.length > 0 &&
                        selectedEvents.length < searchedEvents.length
                      }
                      checked={
                        searchedEvents.length > 0 &&
                        selectedEvents.length === searchedEvents.length
                      }
                      onChange={() => {
                        if (selectedEvents.length === searchedEvents.length) {
                          setSelectedEvents([]);
                        } else {
                          setSelectedEvents(searchedEvents.map((e) => e._id));
                        }
                      }}
                      inputProps={{ "aria-label": "select all events" }}
                    />
                  </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Important</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedEvents.length > 0 ? (
                  searchedEvents.map((event, idx) => (
                    <TableRow key={event._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEvents.includes(event._id)}
                          onChange={() => handleCheckboxChange(event._id)}
                          inputProps={{ "aria-label": `select event ${event.title}` }}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.startDate}</TableCell>
                      <TableCell>{event.endDate}</TableCell>
                      <TableCell>{event.forClass}</TableCell>
                      <TableCell>{event.forSection}</TableCell>
                      <TableCell>
                        {event.isImportant ? (
                          <Chip label="Yes" color="error" size="small" />
                        ) : (
                          <Chip label="No" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/admin/viewcalendra/${event._id}`)}
                          sx={{ mr: 1 }}
                          aria-label="view"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate("/admin/editcalendra", {
                              state: { event }, // pass event as state for edit page
                            })
                          }
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSingle(event._id)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                      No calendar events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Bulk Delete Actions */}
          {selectedEvents.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                backgroundColor: "action.selected",
                borderRadius: 1,
              }}
            >
              <Typography>{selectedEvents.length} event(s) selected</Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;
