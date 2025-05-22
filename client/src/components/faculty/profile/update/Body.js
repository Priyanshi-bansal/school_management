import React, { useEffect, useState } from "react";
import {
  SecurityUpdate as UpdateIcon,
  VisibilityOff as PasswordIcon,
  Person as NameIcon,
  Cake as DobIcon,
  Email as EmailIcon,
  School as DepartmentIcon,
  Phone as ContactIcon,
  Work as DesignationIcon
} from "@mui/icons-material";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { updateFaculty } from "../../../../redux/actions/facultyActions";
import { useNavigate } from "react-router-dom";
import { 
  MenuItem, 
  Select,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  TextField
} from "@mui/material";
import Spinner from "../../../../utils/Spinner";
import { SET_ERRORS } from "../../../../redux/actionTypes";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: user.result.email,
    department: "",
    contactNumber: "",
    avatar: "",
    designation: ""
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    if (
      value.name === "" &&
      value.dob === "" &&
      value.department === "" &&
      value.contactNumber === "" &&
      value.avatar === "" &&
      value.designation === ""
    ) {
      alert("Enter at least one value");
      setLoading(false);
    } else {
      dispatch(updateFaculty(value));
      alert("Kindly login again to see updates");
    }
  };

  useEffect(() => {
    if (store.errors || store.faculty.updatedFaculty) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [store.errors, store.faculty.updatedFaculty]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <Box sx={{ flex: 1, p: 4, bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <UpdateIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              Update Faculty Profile
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PasswordIcon />}
            onClick={() => navigate("/faculty/update/password")}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Update Password
          </Button>
        </Box>

        {/* Form */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mb: 4
            }}>
              {/* Left Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Full Name"
                  placeholder={user.result?.name}
                  value={value.name}
                  onChange={(e) => setValue({ ...value, name: e.target.value })}
                  InputProps={{
                    startAdornment: <NameIcon color="action" sx={{ mr: 1 }} />
                  }}
                  fullWidth
                />

                <TextField
                  label="Date of Birth"
                  type="date"
                  placeholder={user.result?.dob}
                  value={value.dob}
                  onChange={(e) => setValue({ ...value, dob: e.target.value })}
                  InputProps={{
                    startAdornment: <DobIcon color="action" sx={{ mr: 1 }} />
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <TextField
                  label="Email"
                  value={user.result?.email}
                  disabled
                  InputProps={{
                    startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                  }}
                  fullWidth
                />
              </Box>

              {/* Right Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Department
                  </Typography>
                  <Select
                    value={value.department}
                    onChange={(e) => 
                      setValue({ ...value, department: e.target.value })
                    }
                    displayEmpty
                    fullWidth
                    startAdornment={<DepartmentIcon color="action" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="">Select Department</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <TextField
                  label="Contact Number"
                  placeholder={user.result?.contactNumber}
                  value={value.contactNumber}
                  onChange={(e) => 
                    setValue({ ...value, contactNumber: e.target.value })
                  }
                  InputProps={{
                    startAdornment: <ContactIcon color="action" sx={{ mr: 1 }} />
                  }}
                  fullWidth
                />

                <TextField
                  label="Designation"
                  placeholder={user.result?.designation}
                  value={value.designation}
                  onChange={(e) => 
                    setValue({ ...value, designation: e.target.value })
                  }
                  InputProps={{
                    startAdornment: <DesignationIcon color="action" sx={{ mr: 1 }} />
                  }}
                  fullWidth
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Profile Picture
                  </Typography>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => 
                      setValue({ ...value, avatar: base64 })
                    }
                  />
                  {value.avatar && (
                    <Avatar
                      src={value.avatar}
                      sx={{ width: 80, height: 80, mt: 2 }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/faculty/profile")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Update Profile
              </Button>
            </Box>

            {/* Loading & Errors */}
            <Box sx={{ mt: 3 }}>
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Spinner
                    message="Updating Profile..."
                    height={30}
                    width={150}
                    color="#111111"
                    messageColor="blue"
                  />
                </Box>
              )}
              {error.backendError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error.backendError}
                </Typography>
              )}
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Body;