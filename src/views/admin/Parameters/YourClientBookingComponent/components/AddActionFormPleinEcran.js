import React, { useEffect, useState } from 'react';
import { ChakraProvider, Alert, AlertIcon, Text, Badge, Flex, VStack, Icon, Grid } from "@chakra-ui/react";
import { createClient } from '@supabase/supabase-js';
import { FcCalendar, FcVoicePresentation, FcApproval, FcAdvertising, FcCableRelease } from "react-icons/fc";

const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function DisplayVianneyActions() {
  const [reservedActions, setReservedActions] = useState([]);
  const [nonReservedActions, setNonReservedActions] = useState([]);

  useEffect(() => {
    async function fetchActions() {
      const { data: actionsData, error: actionsError } = await supabase.from("vianney_actions").select();
      const { data: teamsData, error: teamsError } = await supabase.from("vianney_teams").select();

      if (actionsError || teamsError) {
        console.error("Error fetching data:", actionsError || teamsError);
        return;
      }

      // Map teams data to an object for easy lookup
      const teamsMap = teamsData.reduce((acc, team) => {
        acc[team.id] = team;
        return acc;
      }, {});

      // Merge team information into actions data
      const actionsWithTeamInfo = actionsData.map(action => ({
        ...action,
        team: teamsMap[action.team_to_which_its_attached],
      }));

      // Filter actions based on reserved_action
      const reservedActions = actionsWithTeamInfo.filter(action => action.reserved_action === "true");
      const nonReservedActions = actionsWithTeamInfo.filter(action => action.reserved_action !== "true");

      // Format the date to French locale
      const formatActions = actions => actions.map(action => ({
        ...action,
        starting_date: new Date(action.starting_date).toLocaleDateString('fr-FR'),
        ending_date: new Date(action.ending_date).toLocaleDateString('fr-FR'),
      }));

      setReservedActions(formatActions(reservedActions));
      setNonReservedActions(formatActions(nonReservedActions));
    }

    fetchActions();
  }, []);

  return (
    <ChakraProvider>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <ColumnActions actions={reservedActions} title="Mission de conseils bookée" badgeColor="teal" icon={<FcCableRelease />} />
        <ColumnActions actions={nonReservedActions} title="Mission on sale" badgeColor="purple" icon={<FcAdvertising />} />
      </Grid>
    </ChakraProvider>
  );
}

function ColumnActions({ actions, title, badgeColor, icon }) {
  return (
    <div>
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center"> {/* Center the title */}
        <Flex alignItems="center" justifyContent="center"> {/* Center the content horizontally */}
          <Badge colorScheme={badgeColor} borderRadius="full" px="2" fontSize="xl" mr={2}>
            {icon}
          </Badge>
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
        </Flex>
      </Text>
      {actions.map((action) => (
        <Alert
          key={action.id}
          status="info"
          borderRadius="md"
          mb={2}
          bgColor="gray.100" // Background color
          color="gray.900" // Text color
        >
          <AlertIcon />
          <VStack align="start">
            <Flex alignItems="center">
              <Badge colorScheme={badgeColor} fontSize="0.8em" mr={2}>
                {action.action_name}
              </Badge>
            </Flex>
            <Flex alignItems="center">
              <Badge style={{ backgroundColor: action.team.color || "#b52f59" }} mr={2}>
                <Text fontWeight="bold" color="white">{/* Use team color or default to "#b52f59" */}
                  {action.team.nom} {action.team.prenom}
                </Text>
              </Badge>
            </Flex>
            <Flex alignItems="center">
              <Icon as={FcCalendar} boxSize={6} mr={2} />
              <Text margin="2">
                Date de début:
              </Text>
              <Text fontWeight="bold">{action.starting_date}</Text>
            </Flex>
            <Flex alignItems="center">
              <Icon as={FcCalendar} boxSize={6} mr={2} />
              <Text margin="2">
                Date de fin:
              </Text>
              <Text fontWeight="bold">{action.ending_date}</Text>
            </Flex>
            <Flex alignItems="center">
              <Icon as={FcVoicePresentation} boxSize={6} mr={2} />
              <Text margin="2">
                Commentaires:
              </Text>
              <Text fontWeight="bold">{action.action_comment}</Text>
            </Flex>
            {action.reserved_action === "true" && (
              <Flex alignItems="center">
                <Icon as={FcApproval} boxSize={6} mr={2} />
                <Text margin="2">
                  Nom de la société qui a réservé:
                </Text>
                <Text fontWeight="bold">{action.name_of_the_client_that_reserved_it}</Text>
              </Flex>
            )}
          </VStack>
        </Alert>
      ))}
    </div>
  );
}

export default DisplayVianneyActions;
