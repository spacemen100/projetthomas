import React, { useState } from "react";
import { Button, Icon, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa"; // You can use the edit icon from Font Awesome or any other icon library
import ModifyActionComponentBis from "./ModifyActionComponentBis";

export default function ModifyActionButton() {
  const [isModifyActionModalOpen, setModifyActionModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModifyActionModalOpen(true);
  };

  const handleCloseModal = () => {
    setModifyActionModalOpen(false);
  };

  return (
    <div>
      <Button
        onClick={handleOpenModal}
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
      <Modal isOpen={isModifyActionModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier l'action</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ModifyActionComponentBis />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}