import React, { useState } from 'react';
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// Initialize Supabase client
const supabaseUrl ='https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Example user data (you can replace this with actual user data)
const users = ["User1", "User2", "User3"]; // and so on...

// Function to generate cell data for the sheet
const generateCellData = () => {
  const celldata = [];

  // Create header row with week days
  weekDays.forEach((day, index) => {
    celldata.push({ "r": 0, "c": index + 1, "v": { "v": day } });
  });

  // Add user rows
  users.forEach((user, rowIndex) => {
    // User name in the first column
    celldata.push({ "r": rowIndex + 1, "c": 0, "v": { "v": user } });

    // Fill the rest of the row with empty cells (or specific data if needed)
    for (let colIndex = 1; colIndex <= weekDays.length; colIndex++) {
      celldata.push({ "r": rowIndex + 1, "c": colIndex, "v": { "v": "" } });
    }
  });

  return celldata;
};

// Initialize the worksheet data
const initialData = [
  {
    "name": "Week Agenda",
    "color": "",
    "id": 0,
    "status": 1,
    "order": 0,
    "hide": 0,
    "row": users.length + 1, // Number of users plus one header row
    "column": weekDays.length + 1, // 7 days plus one column for user names
    "defaultRowHeight": 19,
    "defaultColWidth": 73,
    "celldata": generateCellData(),
    // Add more config as needed
  },
  // Add more sheets as needed
];

const App = () => {
  const [workbookData, setWorkbookData] = useState([{ name: "Sheet1" }]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Upload file to Supabase
    const filePath = `path/to/save/${file.name}`;
    const { error: uploadError } = await supabase.storage.from('excelbucket').upload(filePath, file);
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return;
    }
  
    // Wait a moment to ensure the file is available for download
    await new Promise(resolve => setTimeout(resolve, 5000));
  
    // Download file from Supabase
    const { data: downloadData, error: downloadError } = await supabase.storage.from('excelbucket').download(filePath);
    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      return;
    }
  
    // Parse and set workbook data
    const workbook = XLSX.read(await downloadData.arrayBuffer(), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
    console.log(jsonData); // Debug: Log the parsed data
  
    // Example transformation (modify this according to the required format)
    const transformedData = jsonData.map(row => ({ values: row }));
  
    setWorkbookData([{ name: sheetName, data: transformedData }]);
  };

  
  
  return (
    <>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <Workbook data={initialData} />
    </>
  );
};

export default App;