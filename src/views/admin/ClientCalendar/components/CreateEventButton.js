import React, { useState} from "react";
import { FcPlus } from "react-icons/fc";
import { Button, Icon, Text } from "@chakra-ui/react";
import EventModal from "./EventModal";

export default function CreateEventButton() {
  const [isAddActionModalOpen, setAddActionModalOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setAddActionModalOpen(true)}
        p={1}
        borderRadius="full"
        display="flex"
        alignItems="center"
        boxShadow="md"
        _hover={{ boxShadow: "2xl" }}
      >
        <Icon as={FcPlus} w={7} h={7} />
        <Text pl={3} pr={7}>Créer</Text>
      </Button>
      <EventModal
        isOpen={isAddActionModalOpen}
        onClose={() => setAddActionModalOpen(false)}
      />
    </div>
  );
}
