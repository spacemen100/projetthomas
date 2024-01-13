import React, { useState } from "react";
import FocusRestructuring from "./components/FocusRestructuring";
import FocusTransformation from "./components/FocusTransformation";
import {
  FcBinoculars,
  FcProcess,
  FcCollaboration,
  FcRating
} from "react-icons/fc";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Divider,
  VStack,
  useColorModeValue,
  HStack,
  Icon
} from "@chakra-ui/react";

const ServiceSection = ({ title, children, onLearnMore, icon }) => {
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.200, cyan.200)", 
    "linear(to-r, blue.600, cyan.600)"
  );

  return (
    <Box p={5} shadow="md" borderWidth="1px" bgGradient={bgGradient}>
      <HStack spacing={3}>
        <Icon as={icon} w={6} h={6} />
        <Heading fontSize="xl">{title}</Heading>
      </HStack>
      <Text mt={4}>{children}</Text>
      {onLearnMore && <Button size="sm" mt={2} onClick={onLearnMore}>En savoir +</Button>}
    </Box>
  );
};

const CompanyPresentation = () => {
  const [showDetail, setShowDetail] = useState(null);

  const handleLearnMoreTransformation = () => {
    setShowDetail("transformation");
  };

  const handleLearnMoreRestructuring = () => {
    setShowDetail("restructuring");
  };

  const handleBackToMain = () => {
    setShowDetail(null);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container maxW="container.xl" py={10} borderRadius="lg" bg="whiteAlpha.800" boxShadow="lg">
        <Heading as="h1" size="2xl" textAlign="center" my={5} color="gray.700">
          Advance Capital
        </Heading>
        <Text fontSize="lg" mb={5} color="gray.600" textAlign="center">
          Conseil financier & opérationnel depuis 2007. Accompagnant les entreprises dans leur développement.
        </Text>

        <Divider my={5} />

    <VStack spacing={4} align="stretch">
    {showDetail === "transformation" && <FocusTransformation onBack={handleBackToMain} />}
          {showDetail === "restructuring" && <FocusRestructuring onBack={handleBackToMain} />}

          {!showDetail && (
            <>

      <ServiceSection 
        title="Due Diligences financières"
        icon={FcBinoculars}>
        Conseil à l’acquisition ou à la cession. Une approche détaillée pour assurer une transaction sans heurt.
      </ServiceSection>

      <ServiceSection 
        title="Transformation"
        onLearnMore={handleLearnMoreTransformation}
        icon={FcProcess}>
        Reporting, amélioration de la performance opérationnelle et financière, accompagnement en phase de deal.
      </ServiceSection>

      <ServiceSection 
        title="Restructuring"
        onLearnMore={handleLearnMoreRestructuring}
        icon={FcCollaboration}>
        Accompagnement financier et opérationnel de l’entreprise en situation de sous-performance ou de difficultés avérées.
      </ServiceSection>

      <ServiceSection 
        title="Évaluation"
        icon={FcRating}>
        Evaluations financières de fonds propres ou d’actifs incorporels (PPA), conseil en instruments juridiques de Management Packages.
      </ServiceSection>
</>
          )}
    </VStack>
</Container>
    </Box>
  );
};

export default CompanyPresentation;
