import React from "react";
import {
  Box,
  ChakraProvider,
  extendTheme,
  CSSReset,
} from "@chakra-ui/react";
import Spreadsheet from "react-spreadsheet";

// Define a Chakra UI theme with styles for the spreadsheet
const theme = extendTheme({
  styles: {
    global: {
      ".rs-data": {
        fontFamily: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        backgroundColor: "transparent",
      },
      ".rs-cell": {
        border: "1px solid #ccc",
        padding: "4px",
      },
    },
  },
});

const SpreadsheetComponent = () => {
  // Example data for the spreadsheet
  const data = [
    [{ value: "A1" }, { value: "B1" }, { value: "C1" }],
    [{ value: "A2" }, { value: "B2" }, { value: "C2" }],
    [{ value: "A3" }, { value: "B3" }, { value: "C3" }],
  ];

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Box p={4}>
        <Spreadsheet data={data} />
      </Box>
    </ChakraProvider>
  );
};

export default SpreadsheetComponent;
