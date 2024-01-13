import React, { useState, useEffect } from "react";
import { Button, Icon, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa"; // You can use the edit icon from Font Awesome or any other icon library
import ModifyActionComponent from "./ModifyActionComponent";

export default function ModifyActionButton({ initialActionData, isModalOpen, setModalOpen }) {
  const [isModifyActionModalOpen, setModifyActionModalOpen] = useState(false);
  const [selectedActionData, setSelectedActionData] = useState(null); // Store the selected action data

  const handleOpenModal = (actionData) => {
    setSelectedActionData(actionData); // Set the selected action data
    setModifyActionModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedActionData(null); // Clear the selected action data when closing the modal
    setModifyActionModalOpen(false);
  };

  useEffect(() => {
    if (initialActionData) {
      handleOpenModal(initialActionData);
    }
  }, [initialActionData]);

  return (
    <div>
      {selectedActionData && (
        <Modal isOpen={isModifyActionModalOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modifier l'action</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ModifyActionComponent actionData={selectedActionData} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      <Button
        onClick={() => handleOpenModal(selectedActionData)}
        p={1}
        borderRadius="full"
        display="flex"
        alignItems="center"
        boxShadow="md"
        _hover={{ boxShadow: "2xl" }}
      >
        <Icon as={FaEdit} w={7} h={7} /> {/* Replace with your desired edit icon */}
        <Text pl={3} pr={7}>Modifier</Text>
      </Button>
    </div>
  );
}
