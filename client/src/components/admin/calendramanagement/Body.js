import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import AddIcon from "@mui/icons-material/Add";

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
    <Box sx={{ flex: { xs: 1, md: 0.8 }, mt: { xs: 2, md: 3 }, p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EngineeringIcon color="primary" sx={{ mr: 1, fontSize: { xs: 24, md: 30 } }} />
            <Typography
              variant="h5"
              color="textPrimary"
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              Academic Calendar Management
            </Typography>
          </Box>
          <Chip
            label={`Total Events: ${calendarEvents.length}`}
            color="primary"
            variant="outlined"
            sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/createcalendra")}
            sx={{
              ml: { xs: 0, sm: "auto" },
              mt: { xs: 1, sm: 0 },
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              fontWeight: "bold",
              fontSize: { xs: "14px", md: "16px" },
              borderRadius: "8px",
              boxShadow: 2,
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Create Calendar Event
          </Button>
        </Box>

        {/* Search & Clear Filters */}
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
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
              sx={{ width: { xs: "100%", sm: "auto" } }}
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

          {/* Desktop: Table View */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer component={Paper} sx={{ mb: 3, overflowX: "auto" }}>
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
                                state: { event },
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
          </Box>

          {/* Mobile: Card View */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {searchedEvents.length > 0 ? (
              <Grid container spacing={2}>
                {searchedEvents.map((event, idx) => (
                  <Grid item xs={12} key={event._id}>
                    <Card elevation={2}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Checkbox
                            checked={selectedEvents.includes(event._id)}
                            onChange={() => handleCheckboxChange(event._id)}
                            inputProps={{ "aria-label": `select event ${event.title}` }}
                          />
                          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            {idx + 1}. {event.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Start Date:</strong> {event.startDate}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>End Date:</strong> {event.endDate}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Class:</strong> {event.forClass}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Section:</strong> {event.forSection}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Important:</strong>{" "}
                          {event.isImportant ? (
                            <Chip label="Yes" color="error" size="small" />
                          ) : (
                            <Chip label="No" color="default" size="small" />
                          )}
                        </Typography>
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate(`/admin/viewcalendra/${event._id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() =>
                              navigate("/admin/editcalendra", {
                                state: { event },
                              })
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteSingle(event._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ textAlign: "center", py: 4 }}>
                No calendar events found
              </Typography>
            )}
          </Box>

          {/* Bulk Delete Actions */}
          {selectedEvents.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                p: 1,
                mt: 2,
                backgroundColor: "action.selected",
                borderRadius: 1,
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                {selectedEvents.length} event(s) selected
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
                sx={{ width: { xs: "100%", sm: "auto" } }}
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