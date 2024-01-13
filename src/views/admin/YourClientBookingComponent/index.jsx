import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { IoIosArrowBack } from "react-icons/io";
import ParametersDocuments from './components/ParametersDocuments';
import UserFormComponent from './components/UserFormComponent';
import AddActionFormPleinEcran from './components/AddActionFormPleinEcran';

const Parameters = () => {
  const [showEventAndCharacteristics, setShowEventAndCharacteristics] = useState(false);
  const [showDocuments, setShowDocuments] = useState(true);
  const [showAddActionForm, setShowAddActionForm] = useState(false);

  const handleEventAndCharacteristicsClick = () => {
    setShowEventAndCharacteristics(true);
    setShowDocuments(false);
    setShowAddActionForm(false); // Ensure the AddActionForm is hidden
  };

  const handleBackClick = () => {
    setShowEventAndCharacteristics(false);
    setShowDocuments(true);
    setShowAddActionForm(false); // Hide the AddActionForm when going back
  };

  const handleAddActionClick = () => {
    setShowEventAndCharacteristics(false);
    setShowDocuments(false);
    setShowAddActionForm(true); // Show the AddActionForm
  };

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Box p={5}>
        {showDocuments && (
          <ParametersDocuments
            onEventAndCharacteristicsClick={handleEventAndCharacteristicsClick}
            onAddActionClick={handleAddActionClick} // Pass the click handler
          />
        )}
        {showAddActionForm && (
          <>
            <Button leftIcon={<IoIosArrowBack />} onClick={handleBackClick}>
              Retour
            </Button>     
        <AddActionFormPleinEcran />
        </>
        )}
        {showEventAndCharacteristics && (
          <>
            <Button leftIcon={<IoIosArrowBack />} onClick={handleBackClick}>
              Retour
            </Button>
            <UserFormComponent />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Parameters;
