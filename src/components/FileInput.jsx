// FileInput.jsx
import React from 'react';

const FileInput = ({ onChange }) => {
  return (
    <input
      type="file"
      accept=".xlsx"
      multiple // Allow multiple file selection
      onChange={(e) => onChange(e.target.files)} // Pass an array of files
    />
  );
};

export default FileInput;
