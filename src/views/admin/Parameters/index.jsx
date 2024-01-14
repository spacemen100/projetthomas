import React from 'react';
import { Box } from '@chakra-ui/react';
import YourClientBookingComponent from './YourClientBookingComponent';
import Parameters from './Parameters';

const AdminParameters = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <YourClientBookingComponent />
      <Parameters />
    </Box>
  );
};

export default AdminParameters;
