import React, { useEffect, useState } from "react";
import SmallCalendar from "./SmallCalendar";
import { Box, Text, Checkbox, Flex, Badge } from "@chakra-ui/react";
import supabase from './../../../../supabaseClient';
const Sidebar = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    // Fetch data from Supabase when the component mounts
    async function fetchTeamMembers() {
      const { data, error } = await supabase.from("vianney_teams").select("*");

      if (error) {
        console.error("Error fetching team members:", error.message);
        return;
      }

      // Initialize the selectedTeams array with false values for each team
      setSelectedTeams(Array(data.length).fill(false));
      // Store the team members in state
      setTeamMembers(data);
    }

    fetchTeamMembers();
  }, []);

  const handleCheckboxChange = (index) => {
    // Create a copy of the selectedTeams array
    const updatedSelectedTeams = [...selectedTeams];
    // Toggle the value at the specified index
    updatedSelectedTeams[index] = !updatedSelectedTeams[index];
    // Update the state with the new selectedTeams array
    setSelectedTeams(updatedSelectedTeams);
  };

  return (
    <Box>
      <SmallCalendar />
      <Text fontSize="xl" fontWeight="bold">Team Members:</Text>
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
  );
};

export default Sidebar;
