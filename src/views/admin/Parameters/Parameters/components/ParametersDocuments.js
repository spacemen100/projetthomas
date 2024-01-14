import React from 'react';
import { Box,  Button, useColorModeValue } from '@chakra-ui/react';
import { FcBusinessman, FcOvertime } from "react-icons/fc"; 

const ParametersDocuments = ({ onEventAndCharacteristicsClick, onAddActionClick }) => {
  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonTextColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box >
      <Button
        leftIcon={<FcBusinessman size='32px' color={brandColor} />} 
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={onEventAndCharacteristicsClick}
      >
        Ajouter un collaborateur
      </Button>
      <Button
        leftIcon={<FcOvertime size='32px' color={brandColor} />} 
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={onAddActionClick}
      >
        Ajouter une disponibilité
      </Button>
    </Box>
  );
};

export default ParametersDocuments;
