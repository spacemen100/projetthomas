import React from 'react';
import './index.css';

import {
  Box,

} from "@chakra-ui/react";
import App from './components/App';

export default function Partner() {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <App/>
    </Box>

  );
}



