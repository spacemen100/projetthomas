// Chakra imports
import { Box} from "@chakra-ui/react";
import React from "react";

import TeamScheduleMadeMySelf from "./components/TeamScheduleMadeMySelf";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <TeamScheduleMadeMySelf />
    </Box>
  );
}
