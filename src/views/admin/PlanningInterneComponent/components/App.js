import { useState, useEffect } from "react";
import supabase from './../../../../supabaseClient';
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import { Scheduler } from "@spacemen1000/react-scheduler";
dayjs.extend(isBetween);

export default function Component() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filterButtonState, setFilterButtonState] = useState(0);

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
      // Assuming the structure of item for an action has 'title' and 'subtitle'
      // This is a regular item click (action)
      alert(`Action ${item.title}-${item.subtitle} was clicked`);
    } else {
      console.log('Unknown item structure:', item); // Handle unknown item structure
    }
  };
  

  const handleFilterData = () => {
    alert(`Filtered button was clicked`);
  };

  return (
    <section>
      <Scheduler
        data={data}
        isLoading={isLoading}        
        onItemClick={handleItemClick}
        onRangeChange={(newRange) => console.log(newRange)}
        onTileClick={(clickedResource) => console.log(clickedResource)}
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
    </section>
  );
}
