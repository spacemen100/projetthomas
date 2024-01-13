import { Text, Checkbox, Box, Flex, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabase from './../../../../supabaseClient';
const Labels = () => {
  const [teamMembers, setTeamMembers] = useState([]);

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
    }

    fetchTeamMembers();
  }, []);

  const handleCheckboxChange = (index) => {
    // Handle checkbox state changes if needed
    // You can manage the checkbox state here
    // For simplicity, this example doesn't include checkbox state management
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">Team Members:</Text>
      <ul>
        {teamMembers.map((member, index) => (
          <li key={index}>
            <Flex alignItems="center">
              <Checkbox
                onChange={() => handleCheckboxChange(index)}
                isChecked={true} 
              />
              <Badge marginLeft="2" color={member.color || "blue"}>{`${member.nom} ${member.prenom}`}</Badge>
            </Flex>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default Labels;
