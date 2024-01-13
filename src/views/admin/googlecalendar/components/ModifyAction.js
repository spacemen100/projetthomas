import React, { useState, useEffect } from 'react';
import {
    Button, Icon, Text, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Textarea,
    Box, useToast, Badge
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

const ModifyAction = ({ initialActionData }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [teamData, setTeamData] = useState(null);
    const [action, setAction] = useState({
        actionId: '',
        actionName: '',
        startingDate: '',
        endingDate: '',
        actionComment: '',
        teamName: '',
    });
    const toast = useToast();
    const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    useEffect(() => {
        console.log("Initial Action Data:", initialActionData); // Log to check the structure
        if (initialActionData) {
            setAction({
                actionId: initialActionData.action_id,
                actionName: initialActionData.action_name,
                startingDate: initialActionData.starting_date,
                endingDate: initialActionData.ending_date,
                actionComment: initialActionData.action_comment,
                teamName: '',
            });
            setModalOpen(true);
        }
    }, [initialActionData]);

    useEffect(() => {
        // Fetch team data from the view
        const fetchTeamData = async () => {
            try {
                const { data, error } = await supabase
                    .from('team_action_view_rendering')
                    .select('nom, prenom')
                    .eq('action_id', action.actionId); // Filter by action ID

                if (error) {
                    console.error('Error fetching team data:', error);
                } else if (data && data.length > 0) {
                    // Store the team data in state
                    setTeamData(data[0]);
                }
            } catch (error) {
                console.error('An error occurred while fetching team data:', error);
            }
        };

        // Call the fetchTeamData function
        fetchTeamData();
    }, [action.actionId, supabase]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAction({ ...action, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Updating action with ID:', action.actionId);

        const updatedAction = {
            id: action.actionId,
            action_name: action.actionName,
            starting_date: action.startingDate,
            ending_date: action.endingDate,
            action_comment: action.actionComment,
        };

        try {
            const { error } = await supabase
                .from('vianney_actions')
                .update(updatedAction)
                .eq('id', action.actionId); // Ensure actionId is correctly set

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
            }
        } catch (error) {
            console.error('An error occurred while updating action:', error);
        }
    };


    const handleDelete = async () => {
        console.log('Deleting action with ID:', action.actionId);

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
                // Handle deletion success, e.g., close the modal or refresh the list
            }
        } catch (error) {
            console.error('An error occurred while deleting action:', error);
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

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Modifier l'action</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* Form elements here */}
                            <Box>
                                {teamData && (
                                    <Badge
                                        bgColor="lightblue"
                                        color="black"
                                        p="2"
                                        mb="2"
                                        borderRadius={5}
                                    >
                                        Consultant : {teamData.nom} {teamData.prenom}
                                    </Badge>
                                )}
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
            )}
        </div>
    );
};

export default ModifyAction;
