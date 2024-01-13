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
import { FcApproval, FcBinoculars, FcBusiness, FcCollaboration, FcConferenceCall, FcDecision, FcDonate, FcFactory } from "react-icons/fc";
import {   ArrowBackIcon } from "@chakra-ui/icons";
const gradientTextStyle = {
  bgGradient: "linear(to-r, blue.400, blue.600)",
  bgClip: "text"
};

const accordionData = [
  {
    title: "Une entreprise en tension de cash",
    description: "Vous souhaitez être accompagnés pour traiter vos difficultés.",
    icon: FcApproval
  },
  {
    title: "Une entreprise en procédure amiable",
    description: "Vous souhaitez une assistance externe pour favoriser les négociations avec vos partenaires bancaires, vos fournisseurs et les créanciers publics.",
    icon: FcBinoculars
  },
  {
    title: "Une entreprise en procédure collective",
    description: "Vous souhaitez être accompagnés pour le bon déroulement de la période d’observation et l’anticipation du plan de redressement (sauvegarde ou redressement judiciaire).",
    icon: FcBusiness
  },
  {
    title: "Un candidat à l’acquisition d’une société en difficulté",
    description: "Vous sollicitez un expert pour réaliser la due diligence d’acquisition, ou vous avez besoin d’un accompagnement pour définir votre stratégie de reprise et votre business plan.",
    icon: FcCollaboration
  },
  {
    title: "Un mandataire ad hoc, conciliateur, administrateur judiciaire, mandataire judiciaire, avocat",
    description: "Vous souhaitez l’appui d’un spécialiste financier pour apporter un éclairage indépendant sur la situation financière de la société, ses perspectives et les options de restructuration envisageables.",
    icon: FcConferenceCall
  },
  {
    title: "Un actionnaire d’une société en difficulté",
    description: "Vous souhaitez construire une stratégie de retournement ou une stratégie de sortie.",
    icon: FcDecision
  },
  {
    title: "Un créancier",
    description: "Vous souhaitez un diagnostic stratégique, opérationnel et financier réalisé par un tiers indépendant.",
    icon: FcDonate
  },
  {
    title: "Une entreprise mature ou en croissance ayant des difficultés à se financer",
    description: "Vous avez besoin de financer votre activité et/ou vos investissements mais vous vous heurtez au refus des financiers traditionnels et souhaitez donc recourir à des financements alternatifs : fiducie, gage sur stocks, reverse factoring, etc.",
    icon: FcFactory
  }
];

const FocusRestructuring = ({ onBack }) => (
  <Container maxW="container.xl" p={6}>
    <Button leftIcon={<ArrowBackIcon />} colorScheme="blue" variant="solid" onClick={onBack} mb={6}>
      Retour
    </Button>

    <Box bg="gray.100" p={5} borderRadius="md" shadow="md">
      <Heading as="h2" size="xl" sx={gradientTextStyle} mb={4}>Focus Restructuring</Heading>
      <Text fontSize="lg" mb={5}>
        Nous accompagnons nos clients dans la gestion de leurs situations complexes...
      </Text>

      <Heading as="h3" size="lg" sx={gradientTextStyle} mb={4}>Nos réponses à vos problématiques</Heading>
      <Text mb={6}>Vous êtes …</Text>

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

export default FocusRestructuring;
