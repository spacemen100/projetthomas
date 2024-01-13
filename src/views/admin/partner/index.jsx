import React from 'react';
import {
  Box,

} from "@chakra-ui/react";
import EquipiersTable from './components/EquipiersTable';

export default function Partner() {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>

      <EquipiersTable

      />
    </Box>

  );
}
