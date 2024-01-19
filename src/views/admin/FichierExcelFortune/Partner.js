// Partner.js
import React from 'react';
import { Box } from "@chakra-ui/react";
import App from './components/App'; // Correct the import path

export default function Partner() {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <App />
    </Box>
  );
}
