import React from "react";
import "./index.css";
import App from "./App";
import ContextWrapper from "./context/ContextWrapper";
import { Box } from "@chakra-ui/react";

function RootComponent() {
  return (
    <React.StrictMode>
      <ContextWrapper>
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
          <App />
        </Box>
      </ContextWrapper>
    </React.StrictMode >
  );
}

export default RootComponent;
