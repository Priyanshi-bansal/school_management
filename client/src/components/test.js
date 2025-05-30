import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';


const Test = ({ onEdit }) => {
  // Sample data - replace with real API calls
  const classes = [
    { id: 1, name: 'Grade 10', numericValue: 10, academicYear: '2024-2025', 
      classTeacher: 'Ms. Sarah Johnson', capacity: 40, students: 35, isActive: true },
    { id: 2, name: 'Grade 9', numericValue: 9, academicYear: '2024-2025', 
      classTeacher: 'Mr. David Wilson', capacity: 40, students: 28, isActive: true },
    { id: 3, name: 'Grade 11', numericValue: 11, academicYear: '2024-2025', 
      classTeacher: 'Ms. Emily Brown', capacity: 40, students: 32, isActive: false },
  ];

  const columns = [
    { field: 'name', headerName: 'Class Name', flex: 1 },
    { field: 'numericValue', headerName: 'Grade', width: 100 },
    { field: 'academicYear', headerName: 'Academic Year', width: 150 },
    { field: 'classTeacher', headerName: 'Class Teacher', flex: 1 },
    { 
      field: 'students', 
      headerName: 'Students', 
      width: 150,
      renderCell: (params) => (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span>{params.value}/{params.row.capacity}</span>
            <span className="text-sm text-gray-500">
              {Math.round((params.value / params.row.capacity) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-main h-2 rounded-full" 
              style={{ 
                width: `${Math.min(100, (params.value / params.row.capacity) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )
    },
    { 
      field: 'isActive', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          color={params.value ? 'success' : 'error'} 
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton>
              <Delete fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={classes}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        className="bg-white"
      />
    </div>
  );
};

export default Test;