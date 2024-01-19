import React, { useState } from 'react';
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// Initialize Supabase client
const supabaseUrl ='https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App = () => {
  const [workbookData, setWorkbookData] = useState([{ name: "Sheet1" }]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Upload file to Supabase
    const { data, error } = await supabase.storage.from('excelbucket').upload(`path/to/save/${file.name}`, file);
    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    // Download file from Supabase
    const { data: downloadData, error: downloadError } = await supabase.storage.from('excelbucket').download(`path/to/save/${file.name}`);
    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      return;
    }

    // Parse and set workbook data
    const workbook = XLSX.read(await downloadData.arrayBuffer(), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    setWorkbookData([{ name: sheetName, data: jsonData }]);
  };

  return (
    <>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <Workbook data={workbookData} />
    </>
  );
};

export default App;