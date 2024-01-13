import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  FcPieChart, // Suggested replacement for FcSurvey
  FcLink,     // Suggested replacement for FcMindMap
  FcBusinessman,
  FcCalendar,
  FcSettings,
  FcFaq,
} from "react-icons/fc";
import VideoChatRoom from "views/admin/videoChatRoom";
import Company from "views/admin/default";
import Partner from "views/admin/partner";
import Calendar from "views/admin/Calendar";
import Parameters from "views/admin/Parameters";
import GlobalCalendar from "views/admin/googlecalendar";
import ConsultantBooking from "views/admin/ConsultantBooking";
import ClientCalendar from 'views/admin/ClientCalendar';
import YourClientBookingComponent from 'views/admin/YourClientBookingComponent';

const routes = [
  {
    name: "Présentation de la société",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={FcPieChart} width='20px' height='20px' color='inherit' />,
    component: Company,
  },
  {
    name: "Partner",
    layout: "/admin",
    path: "/map",
    icon: <Icon as={FcLink} width='20px' height='20px' color='inherit' />,
    component: Partner,
    secondary: true,
  },
  {
    name: "Calendrier",
    layout: "/admin",
    path: "/calendar",
    icon: <Icon as={FcCalendar} width='20px' height='20px' color='inherit' />,
    component: Calendar,
  },
  {
    name: "Paramètres administrateur",
    layout: "/admin",
    path: "/parameters",
    icon: <Icon as={FcSettings} width='20px' height='20px' color='inherit' />,
    component: Parameters,
  },
  {
    name: "Salle de chat vidéo",
    layout: "/admin",
    path: "/video-chat",
    icon: <Icon as={FcBusinessman} width='20px' height='20px' color='inherit' />,
    component: VideoChatRoom,
  },
  {
    name: "Calendrier Global Vue Mensuelle",
    layout: "/admin",
    path: "/global-calendar", // Update the path as needed
    icon: <Icon as={FcCalendar} width='20px' height='20px' color='inherit' />, // Use an appropriate icon
    component: GlobalCalendar, // Replace with your new component when ready
    // Add any additional properties if needed
  },
  {
    name: "Chercher et réserver un consultant",
    layout: "/admin",
    path: "/consultant-booking", // Choose an appropriate path
    icon: <Icon as={FcBusinessman} width='20px' height='20px' color='inherit' />, // Choose an appropriate icon
    component: ConsultantBooking, // Reference your new component
    // Add any additional properties if needed
  },
  {
    name: "Calendrier côté client",
    layout: "/admin",
    path: "/client-calendar", // Choose an appropriate path
    icon: <Icon as={FcCalendar} width='20px' height='20px' color='inherit' />, // Choose an appropriate icon
    component: ClientCalendar, // Reference your new component
    // Add any additional properties if needed
  },
  {
    name: "Réservation des clients",
    layout: "/admin",
    path: "/client-booking", // Update the path as needed
    icon: <Icon as={FcFaq} width='20px' height='20px' color='inherit' />,
    component: YourClientBookingComponent, // Replace with your new component when ready
    // Add any additional properties if needed
  },
];

export default routes;
