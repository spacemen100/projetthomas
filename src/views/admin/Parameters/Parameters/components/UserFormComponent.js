import React from 'react';
import {
  Box,
} from "@chakra-ui/react";
import UserForm from './UserForm';

export default function UserFormComponent() {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <UserForm />
    </Box>
  );
}
