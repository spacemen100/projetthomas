import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Card, ChakraProvider, useToast, Tooltip, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Input, Stack, Icon, Text, Menu, MenuButton, MenuList, MenuItem, useColorModeValue, 
} from '@chakra-ui/react';
import { FcPlus, FcBusinessman, FcAbout, FcBusinesswoman  } from "react-icons/fc";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale
import './CalendarStyles.css';
import AddActionForm from './AddActionForm';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set moment to French locale
moment.locale('fr');
const localizer = momentLocalizer(moment);

function TeamScheduleByMySelf({ onTeamSelect, ...rest }) {
  const [allTeams, setAllTeams] = useState([]);
  const [ setSelectedTeamDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onClose = () => setIsAlertOpen(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const [updatedEventName, setUpdatedEventName] = useState('');
  const [updatedEventStart, setUpdatedEventStart] = useState('');
  const [updatedEventEnd, setUpdatedEventEnd] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [resourceTitleAccessor, setResourceTitleAccessor] = useState('titel');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const deleteEvent = async () => {
    console.log('Selected event on delete:', selectedEvent); // Log the event when attempting to delete

    if (!selectedEvent || typeof selectedEvent.id === 'undefined') {
      toast({
        title: "Error",
        description: "No event selected or event ID is missing.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { error } = await supabase
      .from('vianney_actions')
      .update({
        action_name: updatedEventName,
        starting_date: updatedEventStart,
        ending_date: updatedEventEnd,
        last_updated: new Date() // update the last updated time
      })
      .match({ id: selectedEvent.id });


    if (error) {
      console.log(messages.errorEventDelete); // Log the error message
      toast({
        title: "Erreur lors de la suppression de l'événement",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log(messages.successEventDelete); // Log the success message
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      toast({
        title: "Événement supprimé",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleAddActionClick = () => {
    toast({
      title: "Ajouter une disponibilité",
      description: <AddActionForm />,
      status: "info",
      duration: null, // The toast will stay until manually closed
      isClosable: true,
      position: "top", // Center the toast at the top of the screen
    });
  };


  const updateEvent = async () => {
    // Validation can be added here for updated event details
    const { error } = await supabase
      .from('vianney_actions')
      .update({
        action_name: updatedEventName,
        starting_date: updatedEventStart,
        ending_date: updatedEventEnd,
        last_updated: new Date() // update the last updated time
      })
      .match({ id: selectedEvent.id });

    if (error) {
      console.log(messages.errorEventUpdate); // Log the error message
      toast({
        title: "Erreur lors de la mise à jour de l'événement",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log(messages.successEventUpdate); // Log the success message
      setEvents(events.map(event =>
        event.id === selectedEvent.id ? { ...event, titel: updatedEventName, start: new Date(updatedEventStart), end: new Date(updatedEventEnd) } : event
      ));
      toast({
        title: "Événement mis à jour",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from('vianney_teams').select('*');
      if (error) {
        console.error('Error fetching teams:', error);
        return [];
      }
      return data.map(team => ({
        id: team.id,
        titel: team.nom + ' ' + team.prenom, // Combining nom and prenom
        color: team.color
      }));
    } catch (error) {
      console.error('An error occurred while fetching teams:', error);
      return [];
    }
  };
  


  useEffect(() => {
    const fetchData = async () => {
      const teamsData = await fetchTeams();
      if (teamsData.length > 0) {
        setTeams(teamsData);
        setAllTeams(teamsData);
        setFilteredTeams(teamsData); // Display all teams initially
        setResourceTitleAccessor('titel'); // Set accessor for all teams view
      }

      const { data: eventsData, error } = await supabase
        .from('team_action_view_rendering')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        const formattedEvents = eventsData.map(action => ({
          id: action.action_id,
          titel: action.action_name,
          start: new Date(action.starting_date),
          end: new Date(action.ending_date),
          resourceId: action.team_id,
          color: teamsData.find(t => t.id === action.team_id)?.color || 'lightgrey'
        }));
        setEvents(formattedEvents);
      }
    };

    fetchData();
  }, [teams]);


  function adjustBrightness(col, amount) {
    let usePound = false;

    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amount;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amount;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  const eventStyleGetter = (event) => {
    const baseColor = event.color || 'lightgrey';
    const gradientColor = adjustBrightness(baseColor, -35); // Darken the base color by 30
    return {
      style: {
        backgroundImage: `linear-gradient(to right, ${baseColor}, ${gradientColor})`,
        color: 'white', // Set text color to white for better readability
        textAlign: 'center', // Center align the text
        display: 'flex', // Use flexbox for alignment
        alignItems: 'center', // Align items vertically center
        justifyContent: 'center', // Align items horizontally center
      },
    };
  };
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  const [teamNames, setTeamNames] = useState([]);

  useEffect(() => {
    // Fetch both "nom" and "prenom" from the "vianney_teams" table
    const fetchTeamNames = async () => {
      const { data, error } = await supabase
        .from('vianney_teams')
        .select('nom, prenom, id');
      if (error) {
        console.error('Error fetching team names:', error);
      } else {
        setTeamNames(data.map(team => ({ id: team.id, nom: team.nom, prenom: team.prenom })));
      }
    };

    fetchTeamNames();
  }, []);

  const handleTeamSelect = async (team) => {
    if (!team) {
      setFilteredTeams(allTeams);
      setResourceTitleAccessor('titel'); // Use 'titel' for all teams
      setSelectedTeamId(null);
    } else if (!team.id) {
      console.error('Selected team ID is undefined or team object is invalid', team);
      return;
    } else {
      const selectedTeamData = allTeams.find(t => t.id === team.id);
      if (selectedTeamData) {
        setSelectedTeamId(team.id);
        setSelectedTeamDetails(team);
        setFilteredTeams([selectedTeamData]); // Use the correct team data with 'titel'
        setResourceTitleAccessor('titel'); // Continue using 'titel'
      }
    }
  };
  

  const messages = {
    allDay: 'Toute la journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: 'Aujourd hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement pour cette période',
    errorEventSelect: 'Erreur lors de la sélection de l\'événement',
    errorEventUpdate: 'Erreur lors de la mise à jour de l\'événement',
    errorEventDelete: 'Erreur lors de la suppression de l\'événement',
    errorMissingEventId: 'Aucun événement sélectionné ou identifiant de l\'événement manquant',
    successEventDelete: 'Événement supprimé avec succès',
    successEventUpdate: 'Événement mis à jour avec succès',
    selectEventToModify: 'Sélectionnez un événement à modifier ou à supprimer.',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action ne peut pas être annulée.',
    updateEvent: 'Mettre à jour l\'événement',
    deleteEvent: 'Supprimer l\'événement',
    successMessage: 'Action réalisée avec succès',

  };


  const formats = {
    dayFormat: 'DD/MM', // Format for day view
    weekdayFormat: 'dddd', // Format for week view
    monthHeaderFormat: 'MMMM YYYY', // Format for month header
    dayHeaderFormat: 'dddd, MMMM DD', // Format for day header
    agendaDateFormat: 'dddd, MMMM DD', // Format for agenda view date
    agendaTimeFormat: 'HH:mm', // Format for agenda view time
    // ... (add more formats as needed)
  };

  // Logging for debugging
  console.log("All Events:", events);
  console.log("Selected Team ID:", selectedTeamId);

  const filteredEvents = selectedTeamId
    ? events.filter((event) => event.resourceId === selectedTeamId)
    : events;

  console.log("Filtered Events:", filteredEvents);
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the state
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Box p={4}>
        <ChakraProvider>
          <Box p={4}>
            <Flex px="25px" justify="space-between" mb="20px" align="center">
              <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <MenuButton
                  align="center"
                  justifyContent="center"
                  bg={bgButton}
                  _hover={bgHover}
                  _focus={bgFocus}
                  _active={bgFocus}
                  w="auto"
                  h="37px"
                  lineHeight="100%"
                  onClick={handleMenuToggle} // Updated click handler
                  borderRadius="10px"
                  {...rest}
                >
                  <Flex
                    align="center"
                    borderRadius="10px" // Add border radius
                    bgGradient="linear(to-r, blue.400, blue.500)" // Gradient background from blue.400 to blue.500
                    p="2" // Padding, adjust as needed
                    color="white" // Text color
                  >
                    <Icon as={FcAbout} color={iconColor} w="24px" h="24px" />
                    <Text ml="4px">Sélectionner un partner</Text>
                  </Flex>

                </MenuButton>
                <MenuList
                  minW="unset"
                  maxW="150px !important"
                  border="transparent"
                  borderRadius="20px"
                  p="15px"
                  zIndex="1000"
                >
                  {/* Option for all teams */}
                  <MenuItem onClick={() => handleTeamSelect(null)}>
                  <Icon as={FcBusinessman} h="16px" w="16px" me="8px" />
                  <Icon as={FcBusinesswoman} h="16px" w="16px" me="8px" />
                    Tous les partners
                  </MenuItem>
                  {/* Existing team options */}
                  {teamNames.map((team, index) => (
                    <MenuItem
                      key={index}
                      transition="0.2s linear"
                      p="0px"
                      borderRadius="8px"
                      _hover={{ bg: "blue.100", color: "blue.600" }}
                      onClick={() => handleTeamSelect(team)}
                    >
                      <Flex align="center">
                        <Icon as={FcBusinessman} h="16px" w="16px" me="8px" />
                        <Text fontSize="sm" fontWeight="400">
                          {team.nom} {team.prenom}
                        </Text>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Tooltip label="Cliquer pour ajouter une disponibilité" hasArrow>
                <Box position="absolute" top="15px" right="15px" cursor="pointer">
                  <FcPlus size="24px" onClick={handleAddActionClick} />
                </Box>
              </Tooltip>
            </Flex>
            <Calendar
              key={selectedTeamId || 'all-teams'} // To force re-render on team selection
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              messages={messages}
              resources={filteredTeams}
              resourceIdAccessor="id"
              resourceTitleAccessor={resourceTitleAccessor} // Use the updated accessor
              formats={formats}
              defaultView={Views.DAY}
              views={['day', 'week', 'month', 'agenda']}





            // ... (other props)
            />
          </Box>
          <AlertDialog
            isOpen={isAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Options de l'événement
                </AlertDialogHeader>
                <AlertDialogBody>
                  {selectedEvent ? (
                    <Stack spacing={3}>
                      <Input
                        value={updatedEventName}
                        onChange={(e) => setUpdatedEventName(e.target.value)}
                        placeholder="Nom de l'événement"
                      />
                      <Input
                        type="datetime-local"
                        value={updatedEventStart}
                        onChange={(e) => setUpdatedEventStart(e.target.value)}
                      />
                      <Input
                        type="datetime-local"
                        value={updatedEventEnd}
                        onChange={(e) => setUpdatedEventEnd(e.target.value)}
                      />
                    </Stack>
                  ) : (
                    'Sélectionnez un événement à modifier ou à supprimer.'
                  )}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Annuler
                  </Button>
                  <Button colorScheme="blue" onClick={updateEvent} ml={3}>
                    Mettre à jour
                  </Button>
                  <Button colorScheme="red" onClick={deleteEvent} ml={3}>
                    Supprimer
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </ChakraProvider>
      </Box>
    </Card>
  );
}

export default TeamScheduleByMySelf;
