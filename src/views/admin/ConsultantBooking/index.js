import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
  Select,
  Textarea,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import Displaycustumerrequest from './components/Displaycustumerrequest';

const supabaseUrl = 'https://pvpsmyizvorwwccuwbuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cHNteWl6dm9yd3djY3V3YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjgzMDg2MCwiZXhwIjoyMDE4NDA2ODYwfQ.9YDEN41__xBFJU91XY9e3r119A03yQ2oq5azmrx1aqY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function CustomerContactForm() {
  const isFormValid = () => {
    return formData.nomEntreprise && formData.nomContact && formData.email && formData.typeService;
  };
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    nomContact: '',
    email: '',
    telephone: '',
    typeService: '',
    besoins: '',
  });
  const [alertData] = useState(null);
  const toast = useToast();

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  const validateField = (fieldName, fieldValue) => {
    if (!fieldValue) {
      showToast(`${fieldName} est requis`, `Le champ ${fieldName} est vide.`, 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateField('Nom de l\'Entreprise', formData.nomEntreprise) ||
      !validateField('Nom du Contact', formData.nomContact) ||
      !validateField('Adresse Email', formData.email) ||
      !validateField('Type de Service', formData.typeService)
    ) {
      return;
    }

    const newId = uuidv4();

    const { data, error } = await supabase
      .from('customer_contacts')
      .insert([
        {
          id: newId,
          company_name: formData.nomEntreprise,
          contact_name: formData.nomContact,
          email: formData.email,
          phone: formData.telephone,
          service_type: formData.typeService,
          needs: formData.besoins,
        },
      ]);

    if (error) {
      showToast('Error', 'Une erreur s\'est produite lors de la soumission du formulaire.', 'error');
      return;
    }

    if (data && data.length > 0) {
      showToast('Succès', 'Détails du contact soumis avec succès.', 'success');
    } else {
      showToast('Succès', 'Détails du contact soumis avec succès.', 'success');
    }
  };

  const renderAlert = () => {
    if (alertData) {
      return (
        <Alert status={alertData.status} variant="subtle" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>{alertData.title}</AlertTitle>
          <AlertDescription>{alertData.description}</AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <Box width="100%" pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Box spacing={4}>
        <Heading as="h3" size="lg">
          Détails du Contact Client
        </Heading>

        {renderAlert()}

        <form onSubmit={handleSubmit} width="100%">
          <FormControl id="nom-entreprise" mt="10px">
            <FormLabel>Nom de l'Entreprise</FormLabel>
            <Input
              name="nomEntreprise"
              type="text"
              value={formData.nomEntreprise}
              onChange={(e) => setFormData({ ...formData, nomEntreprise: e.target.value })}
            />
            {!formData.nomEntreprise && (
              <FormErrorMessage>Le nom de l'entreprise est requis.</FormErrorMessage>
            )}
            {formData.nomEntreprise && (
              <FormHelperText>Entrez le nom de votre entreprise.</FormHelperText>
            )}
          </FormControl>

          <FormControl id="nom-contact" mt="10px">
            <FormLabel>Nom du Contact</FormLabel>
            <Input
              name="nomContact"
              type="text"
              value={formData.nomContact}
              onChange={(e) => setFormData({ ...formData, nomContact: e.target.value })}
            />
            {!formData.nomContact && (
              <FormErrorMessage>Le nom du contact est requis.</FormErrorMessage>
            )}
            {formData.nomContact && (
              <FormHelperText>Entrez le nom du contact.</FormHelperText>
            )}
          </FormControl>
          <FormControl id="email" mt="10px">
            <FormLabel>Adresse Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {!formData.email && (
              <FormErrorMessage>L'adresse email est requise.</FormErrorMessage>
            )}
            {formData.email && (
              <FormHelperText>
                Entrez l'adresse email sur laquelle vous souhaitez recevoir la newsletter.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="telephone" mt="10px">
            <FormLabel>Numéro de Téléphone</FormLabel>
            <Input
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            />
          </FormControl>
          <FormControl id="type-service" mt="10px">
            <FormLabel>Type de Service</FormLabel>
            <Select
              name="typeService"
              placeholder="Sélectionnez le service"
              value={formData.typeService}
              onChange={(e) => setFormData({ ...formData, typeService: e.target.value })}
            >
              <option value="due-diligences">Due diligences</option>
              <option value="transformation">Transformation</option>
              <option value="restructuring">Restructuration</option>
              <option value="evaluation">Évaluation</option>
            </Select>
            {!formData.typeService && (
              <FormErrorMessage>Le type de service est requis.</FormErrorMessage>
            )}
            {formData.typeService && (
              <FormHelperText>Sélectionnez le type de service.</FormHelperText>
            )}
          </FormControl>
          <FormControl id="besoins" mt="10px">
            <FormLabel>Besoins</FormLabel>
            <Textarea
              name="besoins"
              value={formData.besoins}
              onChange={(e) => setFormData({ ...formData, besoins: e.target.value })}
              placeholder="Décrivez vos besoins"
            />
            {formData.besoins && (
              <FormHelperText>Décrivez vos besoins en détail.</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            colorScheme={isFormValid() ? "blue" : "gray"}
            mt="10px"
            disabled={!isFormValid()}
          >
            Soumettre
          </Button>
        </form>
      </Box>
      <Box mt="20px">
        <Displaycustumerrequest />
      </Box>
    </Box>
  );
}

export default CustomerContactForm;
