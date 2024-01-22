import { useState, useEffect } from "react";
import supabase from './../../../../supabaseClient';
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import { Scheduler } from "@spacemen1000/react-scheduler";
import { Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input } from "@chakra-ui/react";
dayjs.extend(isBetween);

export default function Component() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [setFilterButtonState] = useState(0);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    nom: "",
    statut_dans_la_boite: "",
    resume_cv: "",
    prenom: "",
    user_id: "",
    v_card: "",
    photo_profile_url: ""
  });
  

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
                subtitle: action.statut_dans_la_boite,
              },
              data: [],
            };
          }

          acc[action.team_to_which_its_attached].data.push({
            id: action.id,
            startDate: new Date(action.starting_date),
            endDate: new Date(action.ending_date),
            title: action.action_name,
            description: action.action_comment,
            subtitle: action.name_of_the_client_that_reserved_it,
            bgColor: action.color,
            // Add these fields to the item data
            resume_cv: action.resume_cv,
            prenom: action.prenom,
            user_id: action.user_id,
            v_card: action.v_card,
            photo_profile_url: action.photo_profile_url,
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

  const openUserModal = async (user) => {
    // Fetch additional user details using the user id
    let { data: userDetails, error } = await supabase
      .from('vianney_actions') // Replace with your actual table name
      .select('*')
      .eq('team_to_which_its_attached', user.id);
  
    if (error) {
      console.error('Error fetching user details:', error);
      return; // Exit the function if there's an error
    }
  
    if (userDetails && userDetails.length > 0) {
      // Assuming you want the first row
      const firstUserDetail = userDetails[0];
  
      setSelectedUser({
        id: user.id || "",
        nom: user.label.title || "",
        statut_dans_la_boite: user.label.subtitle || "",
        resume_cv: firstUserDetail.resume_cv || "",
        prenom: firstUserDetail.prenom || "",
        user_id: firstUserDetail.user_id || "",
        v_card: firstUserDetail.v_card || "",
        photo_profile_url: firstUserDetail.photo_profile_url || ""
      });
    } else {
      console.log('No user details found for the given ID');
    }
  
    setIsUserModalOpen(true);
  };
  const closeUserModal = () => {
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
                <Text>Nom: {selectedUser.nom || 'N/A'}</Text>
                <Text>Statut dans la boite: {selectedUser.statut_dans_la_boite || 'N/A'}</Text>
                <Text>Resume CV: {selectedUser.resume_cv || 'N/A'}</Text>
                <Text>Prénom: {selectedUser.prenom || 'N/A'}</Text>
                <Text>User ID: {selectedUser.user_id || 'N/A'}</Text>
                <Text>V Card: {selectedUser.v_card || 'N/A'}</Text>
                <Text>Photo Profile URL: {selectedUser.photo_profile_url || 'N/A'}</Text>
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
