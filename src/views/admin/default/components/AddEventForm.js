import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import supabase from './../../../../supabaseClient';

export default function AddEventForm() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const eventId = uuidv4(); // Generate a new UUID
  
    const { error } = await supabase.from('vianney_event').insert([
      {
        id: eventId, // Use the generated UUID here
        event_name: eventName,
        date: new Date(eventDate).toISOString(),
      },
    ]);

    if (error) {
      toast({
        title: 'Erreur lors de l\'ajout de l\'événement',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Événement ajouté avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Clear the form fields
      setEventName('');
      setEventDate('');
    }
  };

  return (
    <Box p={5}>
      <form onSubmit={handleSubmit}>
        <FormControl id='event-name' isRequired>
          <FormLabel>Nom de l'événement</FormLabel>
          <Input
            type='text'
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </FormControl>
        <FormControl id='event-date' mt={4} isRequired>
          <FormLabel>Date de l'événement</FormLabel>
          <Input
            type='datetime-local'
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </FormControl>
        <Button
          mt={4}
          colorScheme='blue'
          type='submit'
          isDisabled={!eventName || !eventDate}>
          Ajouter l'événement
        </Button>
      </form>
    </Box>
  );
}
