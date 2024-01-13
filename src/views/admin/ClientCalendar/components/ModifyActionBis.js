import React, { useState, useEffect } from 'react';
import {
    Button, Icon, Text, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Textarea,
    Box, Select, useToast, Badge
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

const ModifyActionBis = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [action, setAction] = useState({
        actionId: '',
        actionName: '',
        startingDate: '',
        endingDate: '',
        actionComment: '',
        teamName: '',
    });
    const [existingActions, setExistingActions] = useState([]);
    const toast = useToast();

    const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    useEffect(() => {
        const fetchExistingActions = async () => {
            try {
                const { data, error } = await supabase.from('vianney_actions').select('id, action_name');
                if (error) {
                    console.error('Error fetching existing actions:', error);
                } else {
                    setExistingActions(data);
                }
            } catch (error) {
                console.error('An error occurred while fetching existing actions:', error);
            }
        };
        fetchExistingActions();
    }, [supabase]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAction({
            ...action,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedAction = {
            action_name: action.actionName,
            starting_date: action.startingDate,
            ending_date: action.endingDate,
            action_comment: action.actionComment,
        };

        try {
            const { error } = await supabase
                .from('vianney_actions')
                .update(updatedAction)
                .eq('id', action.actionId);

            if (error) {
                toast({
                    title: "Erreur",
                    description: "Une erreur s'est produite lors de la mise à jour de l'action.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Succès",
                    description: "L'action a été mise à jour avec succès.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setModalOpen(false);
            }
        } catch (error) {
            console.error('An error occurred while updating action:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('vianney_actions')
                .delete()
                .eq('id', action.actionId);

            if (error) {
                toast({
                    title: "Erreur",
                    description: "Une erreur s'est produite lors de la suppression de l'action.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Succès",
                    description: "L'action a été supprimée avec succès.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setModalOpen(false);
            }
        } catch (error) {
            console.error('An error occurred while deleting action:', error);
        }
    };

    const handleActionSelect = async (selectedActionId) => {
        try {
            // Fetching action data
            const { data: actionData, error: actionError } = await supabase
                .from('team_action_view_rendering') // Using the view for easier data retrieval
                .select('*')
                .eq('action_id', selectedActionId)
                .single();

            if (actionError) {
                console.error('Error fetching action data:', actionError);
            } else {
                setAction({
                    ...action,
                    actionId: selectedActionId,
                    actionName: actionData.action_name,
                    startingDate: actionData.starting_date,
                    endingDate: actionData.ending_date,
                    actionComment: actionData.action_comment,
                    teamName: [actionData.nom, actionData.prenom].filter(Boolean).join(' '),
                });
            }
        } catch (error) {
            console.error('An error occurred while fetching action data:', error);
        }
    };


    return (
        <div>
            <Button
                onClick={() => setModalOpen(true)}
                p={1}
                borderRadius="full"
                display="flex"
                alignItems="center"
                boxShadow="md"
                _hover={{ boxShadow: "2xl" }}
            >
                <Icon as={FaEdit} w={7} h={7} />
                <Text pl={3} pr={7}>Modifier</Text>
            </Button>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modifier l'actionbis</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Select
                                placeholder="Sélectionner une action"
                                onChange={(e) => handleActionSelect(e.target.value)}
                                value={action.actionId}
                            >
                                {existingActions.map((existingAction) => (
                                    <option key={existingAction.id} value={existingAction.id}>
                                        {existingAction.action_name}
                                    </option>
                                ))}
                            </Select>
                            {action.teamName && <Badge
                                bgColor="lightblue"
                                color="black"
                                p="2"
                                m="2"
                                borderRadius={5}
                            >
                                Consultant : {action.teamName}
                                </Badge>}
                            <form onSubmit={handleSubmit}>
                                <FormControl isRequired>
                                    <FormLabel>Nom de l'action</FormLabel>
                                    <Input
                                        type="text"
                                        name="actionName"
                                        value={action.actionName}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Date de début</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        name="startingDate"
                                        value={action.startingDate}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Date de fin</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        name="endingDate"
                                        value={action.endingDate}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Commentaire</FormLabel>
                                    <Textarea
                                        name="actionComment"
                                        value={action.actionComment}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                                <Button m="10px" colorScheme="blue" type="submit">
                                    Modifier l'action
                                </Button>
                                <Button m="10px" colorScheme="red" onClick={handleDelete}>
                                    Supprimer
                                </Button>
                            </form>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ModifyActionBis;
