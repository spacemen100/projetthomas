import { useState, useEffect } from "react";
import supabase from './../../../../supabaseClient';
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import { Scheduler } from "@spacemen1000/react-scheduler";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input } from "@chakra-ui/react"; // Import Chakra UI components
dayjs.extend(isBetween);

export default function Component() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false); // State to control modal visibility
  const [selectedAction, setSelectedAction] = useState(null); // State to store the selected action

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let { data: vianneyActions, error } = await supabase
        .from('vianney_actions')
        .select('*');

      if (error) {
        console.log("error", error);
      } else {
        // Group actions by team
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

        // Convert grouped data into array format
        const transformedData = Object.values(groupedData);
        setData(transformedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Set the locale to French
  dayjs.locale("fr");

  const handleItemClick = (item) => {
    console.log('Clicked item:', item); // Debug: Log the clicked item

    // Assuming the structure of item for team/user has 'label' and 'title' properties
    if (item.label && item.label.title) {
      // This is a title click (team/user)
      alert(`Title ${item.label.title} was clicked`);
    } else if (item.title && item.subtitle) {
      // This is a regular item click (action)
      setSelectedAction(item); // Store the selected action
      openActionModal(); // Open the action modal
    } else {
      console.log('Unknown item structure:', item); // Handle unknown item structure
    }
  };

  const openActionModal = () => {
    setIsActionModalOpen(true);
  };

  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedAction(null); // Reset selected action
  };

  const handleActionItemClick = (action) => {
    alert(`Action ${action.title}-${action.subtitle} was clicked`);
  };

  const handleFilterData = () => {
    alert(`Filtered button was clicked`);
  };

  const saveActionChanges = async () => {
    // Assuming you have an API endpoint or method to update the action data
    // Here, I'll demonstrate using Supabase to update the action
    if (selectedAction) {
      try {
        const { data: updatedAction, error } = await supabase
          .from('vianney_actions')
          .update({
            // Update the action attributes based on your form controls
            action_name: selectedAction.title,
            // Add more fields as needed
          })
          .eq('id', selectedAction.id)
          .single();
  
        if (error) {
          console.error("Error updating action:", error);
          // Handle the error as needed
        } else {
          console.log("Action updated successfully:", updatedAction);
          closeActionModal(); // Close the modal after successful update
        }
      } catch (error) {
        console.error("Error updating action:", error);
        // Handle the error as needed
      }
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
          // Some clearing filters logic...
          setFilterButtonState(0)
        }}
        config={{
          zoom: 1,
          maxRecordsPerPage: 5,
          filterButtonState: -1,
          includeTakenHoursOnWeekendsInDayView: false,
          lang: 'fr',
        }}
      />
      
      {/* Action Details Modal */}
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
                {/* Add more form controls for other action attributes */}
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
    </section>
  );
}
