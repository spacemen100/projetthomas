import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import GlobalContext from "../context/GlobalContext";
import { createClient } from '@supabase/supabase-js';
import { Grid, Box, Text, Flex, Tooltip, VStack } from "@chakra-ui/react";

dayjs.extend(isBetween);

const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Month({ month, setShowModifyForm, setSelectedAction }) {
  const { setDaySelected, setShowEventModal, setSelectedEvent } = useContext(GlobalContext);

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

  const DayComponent = ({ day, rowIdx }) => {
    const [dayEvents, setDayEvents] = useState([]);

    useEffect(() => {
      const fetchActions = async () => {
        const { data, error } = await supabase
          .from('team_action_view_rendering')
          .select('*');

        if (error) {
          console.error('Error fetching actions:', error);
        } else {
          const events = data.filter(action =>
            dayjs(day).isBetween(dayjs(action.starting_date).subtract(1, 'day'), dayjs(action.ending_date), null, '[]')
          );
          setDayEvents(events);
        }
      };

      fetchActions();
    }, [day]);

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
            >
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  setDaySelected(day);
                  setSelectedEvent(event.id);
                  setSelectedAction(event); // Pass action data to ModifyActionButton
                }}
                bg={event.color || 'gray.200'}
                p={1}
                color="gray.600"
                fontSize="sm"
                borderRadius="md"
                mb={1}
                width="100%"
                isTruncated
              >
                {event.action_name}
              </Box>
            </Tooltip>
          ))}
        </Flex>
      </Box>
    );
  };

  return (
    <Grid flex="1" templateColumns="repeat(7, 1fr)" templateRows="repeat(5, 1fr)" p={1}>
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <DayComponent
              day={day}
              rowIdx={i}
              key={idx}
            />
          ))}
        </React.Fragment>
      ))}
    </Grid>
  );
}
