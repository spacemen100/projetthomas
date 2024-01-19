import React from 'react';
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

const App = () => {
  return (
    <Workbook data={[{ name: "Sheet1" }]} />
  );
};

export default App;
