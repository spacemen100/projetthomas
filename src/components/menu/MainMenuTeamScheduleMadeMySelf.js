// Banner.js

import React, { useState, useEffect } from "react";
import {
  Icon,
  Flex,
  Text,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { FcAbout } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';// Replace with your Supabase API key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Banner(props) {
  const { onAllowScrollingToggle, onTeamSelect, selectedTeam, ...rest } = props;
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [teamNames, setTeamNames] = useState([]);

  useEffect(() => {
    // Fetch both "nom" and "prenom" from the "vianney_teams" table
    const fetchTeamNames = async () => {
      const { data, error } = await supabase
        .from('vianney_teams')
        .select('nom, prenom');
      if (error) {
        console.error('Error fetching team names:', error);
      } else {
        setTeamNames(data.map(team => ({ nom: team.nom, prenom: team.prenom })));
      }
    };

    fetchTeamNames();
  }, []);

  const handleTeamSelect = (team) => {
    onTeamSelect(team); // Call the callback function with the selected team
    onClose();
  };

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
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
        onClick={onOpen}
        borderRadius="10px"
        {...rest}
      >
        <Flex align="center">
          <Icon as={FcAbout} color={iconColor} w="24px" h="24px" />
          <Text ml="4px">Sélectionner</Text>
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
        {teamNames.map((team, index) => (
          <MenuItem
            key={index}
            transition="0.2s linear"
            p="0px"
            borderRadius="8px"
            _hover={{ bg: "blue.100", color: "blue.600" }}
            onClick={() => handleTeamSelect(team)} // Handle team selection
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
  );
}
