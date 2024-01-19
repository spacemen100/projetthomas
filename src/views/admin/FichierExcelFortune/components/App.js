// App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

const App = () => {
  return (
    <Workbook data={[{ name: "Sheet1" }]} />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));