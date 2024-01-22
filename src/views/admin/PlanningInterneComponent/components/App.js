import { useState, useEffect } from "react";
import supabase from './../../../../supabaseClient';
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import { Scheduler } from "@spacemen1000/react-scheduler";
import { Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input} from "@chakra-ui/react";
dayjs.extend(isBetween);

export default function Component() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [setFilterButtonState] = useState(0);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ nom: "", statut_dans_la_boite: "" }); // Initialize with empty values

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


  const openUserModal = (user) => {
    // Set selectedAction based on the user's team_to_which_its_attached
    const actionForUser = data.find((item) => item.id === user.team_to_which_its_attached);
  
    if (actionForUser && actionForUser.data.length > 0) {
      setSelectedAction(actionForUser.data[0]); // Assuming the user is associated with one action
    } else {
      console.warn("No action found for the selected user.");
      // You can handle this case by providing a default action or displaying a message.
      // For example:
      // setSelectedAction({ title: "No Action Found" });
    }
  
    setSelectedUser({
      id: user.id || "", // Assuming you have the user's ID
      nom: user.label.title || "",
      statut_dans_la_boite: user.label.subtitle || "",
      resume_cv: user.resume_cv || "", // Add other fields here
      prenom: user.prenom || "",
      user_id: user.user_id || "",
      v_card: user.v_card || "",
      photo_profile_url: user.photo_profile_url || "",
    });
  
    setIsUserModalOpen(true);
  };
  
  
  const closeUserModal = () => {
    setSelectedUser({ nom: "", statut_dans_la_boite: "" }); // Reset the selectedUser state
    setIsUserModalOpen(false);
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
        <>
          <Text>Nom: {selectedUser.nom}</Text>
          <Text>statut_dans_la_boite: {selectedUser.statut_dans_la_boite}</Text>
          <Text>Resume CV: {selectedUser.resume_cv}</Text>
          <Text>Prenom: {selectedUser.prenom}</Text>
          <Text>User ID: {selectedUser.user_id}</Text>
          <Text>V Card: {selectedUser.v_card}</Text>
          <Text>Photo Profile URL: {selectedUser.photo_profile_url}</Text>
        </>
      )}
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={closeUserModal}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </section>
  );
}
