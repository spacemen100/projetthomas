import { useState, useEffect } from "react";
import supabase from './../../../../supabaseClient';
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import { Scheduler } from "@spacemen1000/react-scheduler";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, IconButton, Tooltip } from "@chakra-ui/react";
import { FcLock, FcUnlock } from "react-icons/fc";
dayjs.extend(isBetween);

export default function Component() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ nom: "", prenom: "" }); // Initialize with empty values
  const [isUserLocked, setIsUserLocked] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let { data: vianneyActions, error } = await supabase
        .from('vianney_actions')
        .select('*');

      if (error) {
        console.log("error", error);
      } else {
        const groupedData = vianneyActions.reduce((acc, action) => {
          if (!acc[action.team_to_which_its_attached]) {
            acc[action.team_to_which_its_attached] = {
              id: action.team_to_which_its_attached,
              label: {
                icon: action.photo_profile_url,
                title: action.nom,
                subtitle: action.statut_dans_la_boite
              },
              data: []
            };
          }

          acc[action.team_to_which_its_attached].data.push({
            id: action.id,
            startDate: new Date(action.starting_date),
            endDate: new Date(action.ending_date),
            title: action.action_name,
            description: action.action_comment,
            subtitle: action.name_of_the_client_that_reserved_it,
            bgColor: action.color
          });

          return acc;
        }, {});

        const transformedData = Object.values(groupedData);
        setData(transformedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  dayjs.locale("fr");

  const handleItemClick = (item) => {
    console.log('Clicked item:', item);

    if (item.label && item.label.title) {
      // This is a user click, open the user modal
      openUserModal(item);
    } else if (item.title && item.subtitle) {
      // This is a regular item click (action)
    } else {
      console.log('Unknown item structure:', item);
    }
  };

  const handleActionItemClick = (action) => {
    console.log('Action clicked:', action);
    setSelectedAction(action);
    openActionModal();
  };

  const openActionModal = () => {
    setIsActionModalOpen(true);
  };

  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedAction(null);
  };

  const handleFilterData = () => {
    alert(`Filtered button was clicked`);
  };

  const saveActionChanges = async () => {
    if (selectedAction) {
      try {
        const { data: updatedAction, error } = await supabase
          .from('vianney_actions')
          .update({
            action_name: selectedAction.title,
          })
          .eq('id', selectedAction.id)
          .single();

        if (error) {
          console.error("Error updating action:", error);
        } else {
          console.log("Action updated successfully:", updatedAction);
          closeActionModal();
        }
      } catch (error) {
        console.error("Error updating action:", error);
      }
    }
  };

  const toggleUserLock = () => {
    setIsUserLocked(!isUserLocked);
  };

  const openUserModal = (user) => {
    // Set selectedAction based on the user's team_to_which_its_attached
    const actionForUser = data.find((item) => item.id === user.team_to_which_its_attached);
  
    if (actionForUser) {
      setSelectedAction(actionForUser.data[0]); // Assuming the user is associated with one action
    } else {
      console.error("No action found for the selected user.");
    }
  
    setSelectedUser({
      id: user.id || "", // Assuming you have the user's ID
      nom: user.label.title || "",
      prenom: user.label.subtitle || ""
    });
  
    setIsUserModalOpen(true);
  };
  
  const closeUserModal = () => {
    setSelectedUser({ nom: "", prenom: "" }); // Reset the selectedUser state
    setIsUserModalOpen(false);
  };
  
  const saveUserChanges = async () => {
    if (selectedAction && selectedUser) {
      try {
        // Step 1: Identify the team associated with the action
        const teamUUID = selectedAction.id;
  
        // Step 2: Identify the actions associated with the team
        const actionsInTeam = data.find((item) => item.id === teamUUID);
  
        if (!actionsInTeam) {
          console.error("No actions found for the selected team.");
          return;
        }
  
        const actionUUIDs = actionsInTeam.data.map((action) => action.id);
  
        // Step 3: Update the users
        const { data: updatedUsers, error: updateUsersError } = await supabase
          .from('users')
          .update({
            nom: selectedUser.nom,
            prenom: selectedUser.prenom,
          })
          .in('id', actionUUIDs);
  
        if (updateUsersError) {
          console.error("Error updating users:", updateUsersError);
        } else {
          console.log("Users updated successfully:", updatedUsers);
          closeUserModal();
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      console.error("selectedAction or selectedUser is null.");
    }
  };
  
  const updateUserNomInActions = async (userDetails, newNom) => {
    if (userDetails) {
      try {
        // Step 1: Get the user's team ID
        const teamID = userDetails.team_to_which_its_attached;
  
        // Step 2: Find all actions associated with the team
        const actionsInTeam = data.find((item) => item.id === teamID);
  
        if (!actionsInTeam) {
          console.error("No actions found for the selected team.");
          return;
        }
  
        // Step 3: Extract the action IDs
        const actionIDs = actionsInTeam.data.map((action) => action.id);
  
        // Step 4: Update the "nom" field in all actions
        const { data: updatedActions, error: updateActionsError } = await supabase
          .from('vianney_actions')
          .update({
            nom: newNom,
          })
          .in('id', actionIDs);
  
        if (updateActionsError) {
          console.error("Error updating actions:", updateActionsError);
        } else {
          console.log("Actions updated successfully:", updatedActions);
        }
      } catch (error) {
        console.error("Error updating actions:", error);
      }
    } else {
      console.error("User details are missing.");
    }
  };
  
  return (
    <section>
      <Scheduler
        data={data}
        isLoading={isLoading}
        onItemClick={handleItemClick}
        onTileClick={handleActionItemClick}
        onRangeChange={(newRange) => console.log(newRange)}
        onFilterData={handleFilterData}
        onClearFilterData={() => {
          setFilterButtonState(0);
        }}
        config={{
          zoom: 1,
          maxRecordsPerPage: 5,
          filterButtonState: -1,
          includeTakenHoursOnWeekendsInDayView: false,
          lang: 'fr',
        }}
      />

      <Modal isOpen={isActionModalOpen} onClose={closeActionModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Action Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAction && (
              <FormControl>
                <FormLabel>Action Title</FormLabel>
                <Input value={selectedAction.title} onChange={(e) => setSelectedAction({ ...selectedAction, title: e.target.value })} />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeActionModal}>
              Close
            </Button>
            <Button colorScheme="green" onClick={saveActionChanges}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input value={selectedUser.nom} onChange={(e) => setSelectedUser({ ...selectedUser, nom: e.target.value })} />
                <FormLabel>Prenom</FormLabel>
                <Input value={selectedUser.prenom} onChange={(e) => setSelectedUser({ ...selectedUser, prenom: e.target.value })} />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Tooltip label={isUserLocked ? "Unlock User" : "Lock User"}>
              <IconButton
                icon={isUserLocked ? <FcUnlock /> : <FcLock />}
                onClick={toggleUserLock}
                variant="ghost"
              />
            </Tooltip>
            <Button colorScheme="blue" mr={3} onClick={closeUserModal}>
              Close
            </Button>
            <Button colorScheme="green" onClick={saveUserChanges}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
}
