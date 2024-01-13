import React, { useState, useContext, useEffect } from "react";
import SmallCalendar from "./components/SmallCalendar";
import { getMonth } from "./util";
import { ChakraProvider, Flex, Box, Text, VStack, Tooltip, Grid, Badge, Checkbox } from "@chakra-ui/react";
import CalendarHeader from "./components/CalendarHeader";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";
import dayjs from 'dayjs';
import isBetween from "dayjs/plugin/isBetween";
import 'dayjs/locale/fr';
import CreateEventButton from "./components/CreateEventButton";
import ModifyAction from "./components/ModifyAction";
import ActionIdDisplay from "./components/ActionIdDisplay"; // Import the ActionIdDisplay component
import { createClient } from '@supabase/supabase-js';
import ModifyActionBis from "./components/ModifyActionBis";

dayjs.locale('fr');
dayjs.extend(isBetween);
const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
}

const formatTooltipContent = (event) => {
  return (
    <VStack align="left" spacing={1}>
      <Text>Intervenant: {event.nom || 'N/A'} {event.prenom || 'N/A'}</Text>
      <Text>Disponible pour: {event.action_name}</Text>
      <Text>Du: {formatDate(event.starting_date)} au {formatDate(event.ending_date)}</Text>
      <Text>Commentaire: {event.action_comment || 'N/A'}</Text>
      <Text>Dernière mise à jour: {formatDate(event.last_updated)}</Text>
    </VStack>
  );
};

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  const [showModifyForm] = useState(false);
  const [selectedActionData, setSelectedActionData] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const { setDaySelected, setShowEventModal, setSelectedEvent } = useContext(GlobalContext);
  const [ModifyActionModalOpen, setModifyActionModalOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const handleCheckboxChange = (index) => {
    const updatedSelectedTeams = [...selectedTeams];
    updatedSelectedTeams[index] = !updatedSelectedTeams[index];
    setSelectedTeams(updatedSelectedTeams);
    console.log('Updated Selected Teams:', updatedSelectedTeams); // Debugging line
  };


  const modifyActionButtonStyle = {
    display: 'none', // This style will hide the button
  };
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);
  useEffect(() => {
    if (selectedAction) {
      setSelectedActionData(selectedAction);
      setModifyActionModalOpen(true);
    }
  }, [selectedAction, ModifyActionModalOpen]);

  useEffect(() => {
    // Fetch data from Supabase when the component mounts
    async function fetchTeamMembers() {
      const { data, error } = await supabase.from("vianney_teams").select("*");
  
      if (error) {
        console.error("Error fetching team members:", error.message);
        return;
      }
  
      // Store the team members in state
      setTeamMembers(data);
  
      // Initialize the selectedTeams array with true values for each team
      setSelectedTeams(Array(data.length).fill(true));
    }
  
    fetchTeamMembers();
  }, []);
  

  const DayComponent = ({ day, rowIdx, teamMembers }) => {
    const [dayEvents, setDayEvents] = useState([]);
    const isTeamSelected = (event) => {
      const teamIndex = teamMembers.findIndex(member => member.id === event.team_id);
      return teamIndex !== -1 && selectedTeams[teamIndex];
    };

    useEffect(() => {
      const fetchActions = async () => {
        try {
          const { data, error } = await supabase
            .from('team_action_view_rendering')
            .select('*');
          if (error) {
            console.error('Error fetching actions:', error);
          } else {
            const actionsForDay = data.filter(action =>
              dayjs(day).isBetween(
                dayjs(action.starting_date).subtract(1, 'day'),
                dayjs(action.ending_date),
                null,
                '[]'
              )
            );
            setDayEvents(actionsForDay); // Set actions for the specific day
          }
        } catch (error) {
          console.error('Error fetching actions:', error);
        }
      };

      fetchActions();
    }, [day]); // Dependency only on day

    function getCurrentDayClass() {
      return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
        ? { bg: "blue.600", color: "white", borderRadius: "full", w: "7" }
        : {};
    }

    return (
      <Box border="1px" borderColor="gray.200" flexDir="column" display="flex">
        <Flex flexDir="column" alignItems="center">
          {rowIdx === 0 && (
            <Text fontSize="sm" mt={1}>
              {day.format("ddd").toUpperCase()}
            </Text>
          )}
          <Text
            fontSize="sm"
            p={1}
            my={1}
            textAlign="center"
            {...getCurrentDayClass()}
          >
            {day.format("DD")}
          </Text>
        </Flex>
        <Flex
          flexDir="column"
          flex={1}
          cursor="pointer"
          onClick={() => {
            setDaySelected(day);
            setShowEventModal(true);
          }}
        >
          {dayEvents.map((event, idx) => (
            <Tooltip
              key={idx}
              label={formatTooltipContent(event)}
              fontSize="sm"
              placement="right"
              hasArrow
              color={isTeamSelected(event) ? "white" : "transparent"}
              bg={isTeamSelected(event) ? event.color || 'gray.200' : 'transparent'}
            >
              <Badge
                onClick={(e) => {
                  e.stopPropagation();
                  setDaySelected(day);
                  setSelectedEvent(event.id);
                  setSelectedAction(event);
                }}
                bg={isTeamSelected(event) ? event.color || 'gray.200' : 'transparent'} // Background color based on team selection
                p={1}
                color={isTeamSelected(event) ? "gray.600" : "transparent"} // Text color based on team selection
                fontSize="sm"
                borderRadius="md"
                mb={1}
                width="100%"
                textAlign="center" // Align text to the center
                isTruncated
              >
                {event.action_name}
              </Badge>
            </Tooltip>
          ))}
        </Flex>
      </Box>
    );
  };


  return (
    <ChakraProvider>
      {showEventModal && !showModifyForm && <EventModal />}
      <Flex direction="column" height="100vh">
        <CalendarHeader />
        <Flex
          className="main-container"
          flex={1}
          direction={["column", "row"]}
        >
          <Box
            className="sidebar"
            width={["full", "350px"]}
          >
            <Flex alignItems="center">
              <Box mr="20px">
                <CreateEventButton />
              </Box>
              <div style={modifyActionButtonStyle}>
                <ModifyAction initialActionData={selectedActionData} />
                <ActionIdDisplay actionId={selectedActionData?.action_id} />
              </div>
              <ModifyActionBis />
            </Flex>
            <Box display={["none", "block"]}>
              <SmallCalendar />
              <Text fontSize="xl" fontWeight="bold">Trier par consultant:</Text>
              <ul>
                {teamMembers.map((member, index) => (
                  <li key={index}>
                    <Flex alignItems="center">
                      <Checkbox
                        onChange={() => handleCheckboxChange(index)}
                        isChecked={selectedTeams[index]}
                      />
                      <Badge marginLeft="2" color={member.color || "blue"}>{`${member.nom} ${member.prenom}`}</Badge>
                    </Flex>
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
          <Grid flex="1" templateColumns="repeat(7, 1fr)" templateRows="repeat(5, 1fr)" p={1}>
            {currentMonth.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <DayComponent
                    day={day}
                    rowIdx={i}
                    key={idx}
                    setSelectedAction={setSelectedAction}
                    selectedTeams={selectedTeams} // Add this line
                    teamMembers={teamMembers} // Add this line
                  />
                ))}
              </React.Fragment>
            ))}
          </Grid>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
