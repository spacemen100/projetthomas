import { useState, useEffect } from "react";
import supabase from './../../../../supabaseClient';
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import { Scheduler } from "@spacemen1000/react-scheduler";
import { Button, Text, Flex, Switch, Box, Badge, Heading, Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input } from "@chakra-ui/react";
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

  const handleActionItemClick = async (action) => {
    console.log('Action clicked:', action);
    try {
      // Fetch additional action details using the action id
      let { data: additionalActionData, error } = await supabase
        .from('vianney_actions') // Replace with your actual table name
        .select('discounted, percentage_of_discount, reserved_action')
        .eq('id', action.id);

      if (error) {
        console.error('Error fetching additional action details:', error);
      } else {
        // Merge the additional data with the selected action
        const selectedActionWithAdditionalData = {
          ...action,
          ...additionalActionData[0],
        };
        setSelectedAction(selectedActionWithAdditionalData);
        openActionModal();
      }
    } catch (error) {
      console.error('Error fetching additional action details:', error);
    }
  };


  // Update your openActionModal function to fetch additional data for the selected action
  const openActionModal = async () => {
    setIsActionModalOpen(true);

    // Fetch additional action details using the action id
    if (selectedAction) {
      try {
        let { data: additionalActionData, error } = await supabase
          .from('vianney_actions') // Replace with your actual table name
          .select('discounted, percentage_of_discount, reserved_action')
          .eq('id', selectedAction.id);

        if (error) {
          console.error('Error fetching additional action details:', error);
        } else {
          // Merge the additional data with the selectedAction
          setSelectedAction({
            ...selectedAction,
            ...additionalActionData[0],
          });
        }
      } catch (error) {
        console.error('Error fetching additional action details:', error);
      }
    }
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
          <ModalHeader>Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAction && (
              <>

                <FormControl>
                  <FormLabel>Titre</FormLabel>
                  <Input
                    value={selectedAction.title}
                    onChange={(e) =>
                      setSelectedAction({ ...selectedAction, title: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Début</FormLabel>
                  <Input
                    value={dayjs(selectedAction.startDate).format("DD MMMM YYYY")}

                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Fin</FormLabel>
                  <Input
                    value={dayjs(selectedAction.endDate).format("DD MMMM YYYY")}

                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input value={selectedAction.description} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Discount🏷️</FormLabel>
                  <Switch
                    isChecked={selectedAction.discounted}

                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Pourcentage</FormLabel>
                  <Input
                    value={selectedAction.percentage_of_discount || 'N/A'}

                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Action réservée</FormLabel>
                  <Switch
                    isChecked={selectedAction.reserved_action}

                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Nom du client</FormLabel>
                  <Input value={selectedAction.subtitle} isReadOnly />
                </FormControl>
              </>
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
                <Flex alignItems="center" mb="2">
                  <Avatar
                    size="md"
                    name={selectedUser.nom + ' ' + selectedUser.prenom}
                    src={selectedUser.photo_profile_url || 'fallback-url'}
                  />
                  <Badge
                    bgColor="lightblue"
                    color="black"
                    p="2"
                    borderRadius={5}
                    ml="3"
                  >
                    Consultant : {selectedUser.nom} {selectedUser.prenom}
                  </Badge>
                </Flex>
                <Flex p="2" mb="2" alignItems="center">
                  <Box flex="1">
                    <Heading size="sm">Statut dans la boite</Heading>
                  </Box>
                  <Box flex="2" ml="2">
                    <Text>{selectedUser.statut_dans_la_boite || 'N/A'}</Text>
                  </Box>
                </Flex>
                <Flex p="2" mb="2" alignItems="center">
                  <Box flex="1">
                    <Heading size="sm">V-Card</Heading>
                  </Box>
                  <Box flex="2" ml="2">
                    {selectedUser.v_card ? (
                      <Button as="a" href={selectedUser.v_card} target="_blank" colorScheme="blue">
                        Ouvrir la V-Card
                      </Button>
                    ) : (
                      <Text>N/A</Text>
                    )}
                  </Box>
                </Flex>

                <Flex p="2" mb="2" alignItems="center">
                  <Box flex="1">
                    <Heading size="sm">Resume CV</Heading>
                  </Box>
                  <Box flex="2" ml="2">
                    <Text>{selectedUser.resume_cv || 'N/A'}</Text>
                  </Box>
                </Flex>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeUserModal}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
}
