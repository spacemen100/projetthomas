import React, { useState } from 'react';
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import './App.css';

// Initialize Supabase client
const supabaseUrl ='https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = '...'; // Use your actual Supabase Anon Key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example user data (you can replace this with actual user data)
const users = ["User1", "User2", "User3"]; // and so on...
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const generateCellDataForCellSheet = () => {
  const celldata = [];

  // Create header row with week days
  weekDays.forEach((day, index) => {
    celldata.push({ "r": 0, "c": index + 1, "v": day });
  });

  // Add user rows
  users.forEach((user, rowIndex) => {
    // User name in the first column
    celldata.push({ "r": rowIndex + 1, "c": 0, "v": user });

    // Fill the rest of the row with empty cells
    for (let colIndex = 1; colIndex <= weekDays.length; colIndex++) {
      celldata.push({ "r": rowIndex + 1, "c": colIndex, "v": "" });
    }
  });

  return celldata;
};

const App = () => {
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
  const [workbookData, setWorkbookData] = useState([
    {
      "name": "Cell",
      "color": "",
      "id": 0,
      "status": 1,
      "order": 0,
      "hide": 0,
      "row": 36,
      "column": 18,
      "defaultRowHeight": 19,
      "defaultColWidth": 73,
      "celldata": generateCellDataForCellSheet(),
      "config": {},
      "scrollLeft": 0,
      "scrollTop": 315,
      "luckysheet_select_save": [],
      "calcChain": [],
      "isPivotTable": false,
      "pivotTable": {},
      "filter_select": {},
      "filter": null,
      "luckysheet_alternateformat_save": [],
      "luckysheet_alternateformat_save_modelCustom": [],
      "luckysheet_conditionformat_save": {},
      "frozen": {},
      "chart": [],
      "zoomRatio": 1,
      "image": [],
      "showGridLines": 1
    },
    {
      "name": "Sheet2",
      "color": "",
      "id": "1",
      "status": 0,
      "order": 1,
      "celldata": [],
      "config": {}
    },
    {
      "name": "Sheet3",
      "color": "",
      "id": "2",
      "status": 0,
      "order": 2,
      "celldata": [],
      "config": {}
    }
  ]);

  // ... rest of your component including file upload handler

  return (
    <>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <Workbook data={workbookData} />
    </>
  );
};

export default App;
