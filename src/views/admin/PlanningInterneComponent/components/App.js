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

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let { data: vianneyActions, error } = await supabase
        .from('vianney_actions')
        .select('*');

      if (error) console.log("error", error);
      else {
        // Transform the data to fit the SchedulerData structure
        const transformedData = vianneyActions.map(action => ({
          id: action.id,
          label: {
            icon: action.photo_profile_url,
            title: action.nom,
            subtitle: action.statut_dans_la_boite
          },
          data: [
            {
              id: action.id,
              startDate: new Date(action.starting_date),
              endDate: new Date(action.ending_date),
              title: action.action_name,
              description: action.action_comment,
              subtitle: action.name_of_the_client_that_reserved_it,
              bgColor: action.color
            }
          ]
        }));

        setData(transformedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Set the locale to French
  dayjs.locale("fr");

  const handleItemClick = (item) => {
    if (item.label && item.label.title) {
      // This is a title click
      alert(`Title ${item.label.title} was clicked`);
    } else {
      // This is a regular item click
      alert(`Item ${item.title}-${item.subtitle} was clicked`);
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
        onFilterData={handleFilterData}
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
