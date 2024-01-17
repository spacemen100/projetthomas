import React from 'react';
import {
  Box,

} from "@chakra-ui/react";
import SpreadsheetComponent from './components/SpreadsheetComponent';

export default function Partner() {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <SpreadsheetComponent/>
    </Box>
  );
}

