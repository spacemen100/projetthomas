import React from 'react';
import { Box,  Button, useColorModeValue } from '@chakra-ui/react';
import { FcAdvertising, FcBusinessman } from "react-icons/fc";

const ParametersDocuments = ({ onEventAndCharacteristicsClick, onAddActionClick }) => {
  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonTextColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box >
      <Button
        leftIcon={<FcAdvertising size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={onEventAndCharacteristicsClick}
      >
        Ajouter un collaborateur
      </Button>
      <Button
        leftIcon={<FcBusinessman size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4} 
        onClick={onAddActionClick} // Ensure this is calling the correct function
      >
        Ajouter une disponibilité
      </Button>
    </Box>
  );
};

export default ParametersDocuments;
