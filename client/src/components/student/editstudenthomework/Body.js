import React, { useState, useCallback } from 'react';


const Body = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  // Validate files (e.g., size, type)
  const validateFiles = (fileList) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

    for (const file of fileList) {
      if (file.size > MAX_SIZE) {
        setError(`File too large: ${file.name} (max 10MB)`);
        return false;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Unsupported format: ${file.name}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (validateFiles(droppedFiles)) {
      setFiles(droppedFiles);
    }
  }, []);

  // Handle file selection via button
  const handleFileInput = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (validateFiles(selectedFiles)) {
      setFiles(selectedFiles);
    }
  }, []);

  // Remove a file
  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="p-5 max-w-md mx-auto">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          ${error ? 'border-red-500' : ''}`}
      >
        <div className="space-y-2">
          <svg
            className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-gray-500">or</p>
          <input
            type="file"
            onChange={handleFileInput}
            multiple
            className="hidden"
            id="file-upload"
            accept=".jpg,.jpeg,.png,.pdf"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Select Files
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 text-red-600 text-sm">
          <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          <ul className="divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span className="text-sm truncate max-w-xs">
                  <svg className="inline w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Button (Optional) */}
      {files.length > 0 && (
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          onClick={() => console.log('Uploading:', files)} // Replace with actual upload logic
        >
          Upload Files
        </button>
      )}
    </div>
  );
};

export default Body;