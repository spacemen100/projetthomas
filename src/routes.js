import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  FcPieChart, 
  FcLink,     
  FcBusinessman,
  FcCalendar,
  FcSettings,
  FcGrid,
} from "react-icons/fc";
import VideoChatRoom from "views/admin/videoChatRoom";
import Company from "views/admin/default";
import Partner from "views/admin/partner";
import Parameters from "views/admin/Parameters";
import ConsultantBooking from "views/admin/ConsultantBooking";
import ClientCalendar from 'views/admin/ClientCalendar';
import YourExcelPlanningComponent from 'views/admin/YourExcelPlanningComponent';
import TelechargerUnFichierExcel from 'views/admin/TelechargerUnFichierExcel'; 
import FichierExcelFortune from 'views/admin/FichierExcelFortune';

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
    name: "Paramètres administrateur",
    layout: "/admin",
    path: "/parameters",
    icon: <Icon as={FcSettings} width='20px' height='20px' color='inherit' />,
    component: Parameters,
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
    name: "Salle de chat vidéo",
    layout: "/admin",
    path: "/video-chat",
    icon: <Icon as={FcBusinessman} width='20px' height='20px' color='inherit' />,
    component: VideoChatRoom,
  },
  {
    name: "Planning format excel",
    layout: "/admin",
    path: "/planning-excel", // Choose an appropriate path
    icon: <Icon as={FcGrid} width='20px' height='20px' color='inherit' />, // Use FcGrid icon
    component: YourExcelPlanningComponent, // Reference your new component
    // Add any additional properties if needed
  },
  {
    name: "Telecharger un fichier excel",
    layout: "/admin",
    path: "/upload-and-view-excel", // Choose an appropriate path
    icon: <Icon as={FcGrid} width='20px' height='20px' color='inherit' />,
    component: TelechargerUnFichierExcel, // Reference your new component
    // Add any additional properties if needed
  },  
  {
    name: "Excel plannning",
    layout: "/admin",
    path: "/upload-and-view-excel-fortune", // Choose an appropriate path
    icon: <Icon as={FcGrid} width='20px' height='20px' color='inherit' />,
    component: FichierExcelFortune, // Reference your new component
    // Add any additional properties if needed
  },
];

export default routes;
