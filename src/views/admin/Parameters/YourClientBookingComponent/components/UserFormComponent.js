import React from 'react';
import {
  Box,
} from "@chakra-ui/react";
import UserForm from './UserForm';

export default function UserFormComponent() {
  return (
    <Box pt={{ base: "20px", md: "10px", xl: "10px" }}>
      <UserForm /> 
    </Box>
  );
}
