import React from "react";
import { Box, Typography } from "@mui/material";

const Data = ({ icon, label, value }) => {
  return (
    <Box className="flex items-start space-x-3">
      <Box className="mt-1 text-gray-500">
        {icon}
      </Box>
      <Box className="flex-1">
        <Typography 
          variant="caption" 
          className="block text-gray-500 font-medium mb-1"
        >
          {label}
        </Typography>
        <Typography 
          variant="body1" 
          className="w-full p-2 bg-gray-50 rounded text-gray-800 border border-gray-200"
        >
          {value || "Not specified"}
        </Typography>
      </Box>
    </Box>
  );
};

export default Data;