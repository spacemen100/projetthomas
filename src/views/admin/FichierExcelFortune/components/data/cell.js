const cell = {
  name: "Week Scheduler",
  color: "",
  id: 0,
  status: 1,
  order: 0,
  hide: 0,
  row: 24, // for 24 hours in a day
  column: 7, // for 7 days in a week
  defaultRowHeight: 19,
  defaultColWidth: 100,
  celldata: [], // Fill this with your scheduled data
  config: {
    rowlen: {}, // Custom row heights (if needed)
    borderInfo: [], // Custom borders (if needed)
    merge: {}, // Cell merging (if needed)
  },
};

// Define the days of the week as column headers and set background to green
for (let c = 0; c < 7; c++) {
  cell.celldata.push({
    r: 0, // First row for headers
    c: c,
    v: {
      ct: { fa: "General", t: "g" },
      v: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][c]
    },
    bg: "#00FF00" // Background color set to green
  });
}

// Optionally, define time slots as row headers
for (let r = 1; r <= 24; r++) {
  cell.celldata.push({
    r: r,
    c: 0, // First column for time slots
    v: {
      ct: { fa: "General", t: "g" },
      v: `${r-1}:00`
    }
  });
}

// Now you can use this cell in your App component
