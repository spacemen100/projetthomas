import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  Heading,
  Container,
  Button,
  Box,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FcOrgUnit, FcLineChart, FcProcess, FcDecision, FcCollaboration } from "react-icons/fc";
import {   ArrowBackIcon } from "@chakra-ui/icons";
const gradientTextStyle = {
  bgGradient: "linear(to-r, blue.400, blue.600)",
  bgClip: "text"
};

const accordionData = [
  {
    title: "Focus Transformation",
    description: "Optimisation des résultats opérationnels et financiers dans les contextes de transformation. Soutien analytique et structuration de projets en croissance ou tension.",
    icon: FcOrgUnit
  },
  {
    title: "Reporting et Structuration de la Fonction Financière",
    description: "Mise en place d’outils de reporting, fiabilisation des données, optimisation des délais, et revue de l’organisation financière.",
    icon: FcLineChart
  },
  {
    title: "Plan de Performance Opérationnelle",
    description: "Diagnostic opérationnel et financier, quantification des enjeux, accompagnement à la mise en œuvre en mode projet.",
    icon: FcProcess
  },
  {
    title: "Support à l’Intégration",
    description: "Revue de BP, analyse des risques, sécurisation des synergies, et définition de plans à 100 jours.",
    icon: FcDecision
  },
  {
    title: "Aide à la Décision en Situation de Crise",
    description: "Support analytique pour la prise de décision en crise, identification des leviers de retournement, et accompagnement à la mise en œuvre du retournement.",
    icon: FcCollaboration
  },
  // Other existing items can be included here as well
  // ...
];

const FocusTransformation = ({ onBack }) => (
  <Container maxW="container.xl" p={6}>
    <Button leftIcon={<ArrowBackIcon />} colorScheme="blue" variant="solid" onClick={onBack} mb={6}>
      Retour
    </Button>

    <Box bg="gray.100" p={5} borderRadius="md" shadow="md">
      <Heading as="h2" size="xl" sx={gradientTextStyle} mb={4}>Focus Restructuring</Heading>
      <Text fontSize="lg" mb={5}>
      Nous accompagnons nos clients dans leurs contextes de transformation avec pour objectif d’optimiser de façon pérenne les résultats opérationnels et financiers. Notre équipe intervient en soutien analytique à la décision et en structuration de projets dans des contextes de croissance ou de tension.
      </Text>

      <Accordion allowMultiple>
        {accordionData.map((item, index) => (
          <AccordionItem key={index} mb={4}>
            <AccordionButton bg="blue.100" borderRadius="md">
              <Flex alignItems="center">
                <Icon as={item.icon} color="blue.500" w={6} h="100%" mr={4} />
                <Heading as="h4" size="md" sx={gradientTextStyle}>{item.title}</Heading>
              </Flex>
            </AccordionButton>
            <AccordionPanel pb={4} bg="gray.200" borderRadius="md">
              <Text>{item.description}</Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Heading as="h3" size="lg" sx={gradientTextStyle} mt={6} mb={4}>À chaque problème nous avons la solution</Heading>
    </Box>
  </Container>
);

export default FocusTransformation;
