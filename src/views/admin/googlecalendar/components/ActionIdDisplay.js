import React from "react";
import { Box, Text } from "@chakra-ui/react";

const ActionIdDisplay = ({ actionId }) => {
    return (
      <Box mt={2}>
        <Text fontWeight="bold">UUID ID of the clicked action:</Text>
        <Text>{actionId}</Text>
      </Box>
    );
  };
  
  export default ActionIdDisplay;
  