import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Checkbox,
} from '@chakra-ui/react';
import supabase from './../../../../../supabaseClient';

const AddActionFormPleinEcran = ({ selectedActionId, selectedEvent }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState(null);
  const [action, setAction] = useState({
    teamId: '',
    actionName: '',
    startingDateTime: '',
    endingDateTime: '',
    comment: '',
  });
  const [alert, setAlert] = useState({ status: '', message: '', isVisible: false });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase.from('vianney_teams').select('*');
        if (error) {
          console.error('Error fetching teams:', error);
        } else {
          setTeams(data);
        }
      } catch (error) {
        console.error('An error occurred while fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const fetchTeamDetails = async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('vianney_teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) {
        console.error('Error fetching team details:', error);
      } else {
        setSelectedTeamDetails(data);
        console.log("Fetched team details: ", data); // Debugging line
      }
    } catch (error) {
      console.error('An error occurred while fetching team details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeamDetails) {
      console.error('Team details are not available');
      setAlert({
        status: 'error',
        message: 'Les détails de l\'équipe ne sont pas disponibles. Veuillez réessayer.',
        isVisible: true
      });
      return;
    }

    // Associate team data with the action
    const actionToSave = {
      id: selectedEvent ? selectedEvent.id : uuidv4(),
      team_to_which_its_attached: action.teamId,
      action_name: action.actionName,
      starting_date: action.startingDateTime,
      ending_date: action.endingDateTime,
      action_comment: action.comment,
      discounted: action.discounted || false, // Include discounted field
      percentage_of_discount: action.percentage_of_discount || 0, // Include percentage_of_discount field
      last_updated: new Date().toISOString(),
      color: selectedTeamDetails?.color,
      latitude: selectedTeamDetails?.latitude,
      longitude: selectedTeamDetails?.longitude,
      photo_profile_url: selectedTeamDetails?.photo_profile_url,
      last_active: selectedTeamDetails?.last_active,
      statut_dans_la_boite: selectedTeamDetails?.statut_dans_la_boite,
      resume_cv: selectedTeamDetails?.resume_cv,
      nom: selectedTeamDetails?.nom,
      prenom: selectedTeamDetails?.prenom,
      user_id: selectedTeamDetails?.user_id,
      v_card: selectedTeamDetails?.v_card,
    };

    let result;
    if (selectedEvent) {
      result = await supabase
        .from('vianney_actions')
        .update(actionToSave)
        .match({ id: selectedEvent.id });
    } else {
      result = await supabase
        .from('vianney_actions')
        .insert([actionToSave]);
    }

    if (result.error) {
      console.error('Error:', result.error);
      setAlert({
        status: 'error',
        message: 'Un problème est survenu lors de la sauvegarde de l\'action.',
        isVisible: true
      });
    } else {
      setAlert({
        status: 'success',
        message: 'L action a été sauvegardée avec succès.',
        isVisible: true
      });
      // You can add any necessary logic for handling success here
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, isVisible: false });
  };

  return (
    <Box>
      {alert.isVisible && (
        <Alert status={alert.status} mb={4}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>{alert.status === 'error' ? 'Erreur!' : 'Succès!'}</AlertTitle>
            <AlertDescription display="block">{alert.message}</AlertDescription>
          </Box>
          <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert} />
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Équipe</FormLabel>
          <Select
            placeholder="Sélectionner une équipe"
            onChange={(e) => {
              setAction({ ...action, teamId: e.target.value });
              // Fetch team details when a team is selected
              fetchTeamDetails(e.target.value);
            }}
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.nom}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Nom de l'action</FormLabel>
          <Input placeholder="Nom de l'action" onChange={(e) => setAction({ ...action, actionName: e.target.value })} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Date de début</FormLabel>
          <Input type="datetime-local" onChange={(e) => setAction({ ...action, startingDateTime: e.target.value })} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Date de fin</FormLabel>
          <Input type="datetime-local" onChange={(e) => setAction({ ...action, endingDateTime: e.target.value })} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Commentaire</FormLabel>
          <Input placeholder="Commentaire" onChange={(e) => setAction({ ...action, comment: e.target.value })} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Discounted</FormLabel>
          <Checkbox
            isChecked={action.discounted || false}
            onChange={(e) => setAction({ ...action, discounted: e.target.checked })}
          >
            Is Discounted
          </Checkbox>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Percentage of Discount</FormLabel>
          <Input
            type="number"
            placeholder="Percentage of Discount"
            value={action.percentage_of_discount || ''}
            onChange={(e) => setAction({ ...action, percentage_of_discount: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="blue" mt={4} type="submit">
          Ajouter l'action
        </Button>
      </form>
    </Box>
  );
};

export default AddActionFormPleinEcran;
