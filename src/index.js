import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from 'layouts/admin';
import { ChakraProvider, IconButton, Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from './supabaseClient';
import { FcDataEncryption } from "react-icons/fc";


const App = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const updateSessionState = (session) => {
      setSession(session);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSessionState(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSessionState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    setSession(null); // Resets the session state on logout
  };
  // * Supabase Auth Error Message Translation
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList" || mutation.addedNodes.length === 0)
          return;

        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLElement &&
            (node.classList.contains("supabase-account-ui_ui-message") ||
              node.classList.contains("supabase-auth-ui_ui-message"))
          ) {
            const originErrorMessage = node.innerHTML.trim();

            let translatedErrorMessage;
            switch (originErrorMessage) {
              case "To signup, please provide your email":
                translatedErrorMessage = "Pour vous inscrire, veuillez fournir votre email";
                break;
              case "Signup requires a valid password":
                translatedErrorMessage = "L'inscription nécessite un mot de passe valide";
                break;
              case "User already registered":
                translatedErrorMessage = "Utilisateur déjà enregistré";
                break;
              case "Only an email address or phone number should be provided on signup.":
                translatedErrorMessage = "Seulement une adresse email ou un numéro de téléphone doit être fourni lors de l'inscription.";
                break;
              case "Signups not allowed for this instance":
                translatedErrorMessage = "Les inscriptions ne sont pas autorisées pour cette instance";
                break;
              case "Email signups are disabled":
                translatedErrorMessage = "Les inscriptions par email sont désactivées";
                break;
              case "Email link is invalid or has expired":
                translatedErrorMessage = "Le lien de l'email est invalide ou a expiré";
                break;
              case "Token has expired or is invalid":
                translatedErrorMessage = "Le jeton a expiré ou est invalide";
                break;
              case "The new email address provided is invalid":
                translatedErrorMessage = "La nouvelle adresse email fournie est invalide";
                break;
              case "Password should be at least 6 characters":
                translatedErrorMessage = "Le mot de passe doit comporter au moins 6 caractères";
                break;
              case "Invalid login credentials":
                translatedErrorMessage = "Identifiants de connexion invalides";
                break;
              default:
                translatedErrorMessage = "Erreur inconnue"; // Default error message
                break;
            }

            if (!document.querySelector("#auth-forgot-password")) {
              node.innerHTML = translatedErrorMessage || originErrorMessage;
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }, []);


  return (
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <ThemeEditorProvider>
          <HashRouter>
            <Box position="relative">
              {session && (
                <Flex
                position="absolute"
                top="1rem"
                right="1rem"
                align="center"
                zIndex={1000}
                onClick={handleLogout}
                  _hover={{ cursor: 'pointer' }} // Change cursor on hover
              >
                <Tooltip label="Déconnexion" hasArrow placement="top">
                  <IconButton
                    colorScheme="blue"
                    onClick={handleLogout}
                    icon={<FcDataEncryption />}
                    aria-label="Logout"
                    size="sm"
                  />
                </Tooltip>
              </Flex>
              
              )}
              {!session ? (<>
                <Text fontSize="2xl" fontWeight="bold" mb="4" textAlign="center" pt="10px">
                  📢Salut Thomas🖐🏻, depuis mardi, j'ai implémenté l'authentification🔐 par mail (LinkeldIn c'est pas encore ça mais je discute sur le discord de supabase... et sinon nouvelles options: discount %, whatsapp et excel + planning interne en cours🚀)
                </Text>
                <Box
                  width="90%"
                  margin="auto"
                  height="90vh"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >

                  <Auth
                    supabaseClient={supabase}
                    theme="default"
                    appearance={{
                      theme: ThemeSupa,
                      variables: {
                        default: {
                          colors: {
                            brand: 'rgb(0, 128, 255)',
                            brandAccent: 'rgb(0, 128, 255)',
                          },
                        },
                      },
                    }}

                    providers={['linkedin']}
                    localization={{
                      variables: {
                        sign_in: {
                          email_label: 'Adresse e-mail', // French translation for 'Email address'
                          password_label: 'Votre mot de passe', // French translation for 'Your Password'
                          email_input_placeholder: 'Saisissez votre adresse e-mail', // French translation for 'Your email address'
                          password_input_placeholder: 'Saisissez votre mot de passe', // French translation for 'Your password'
                          button_label: 'Se connecter', // French translation for 'Sign in'
                          loading_button_label: 'Connexion en cours ...', // French translation for 'Signing in ...'
                          social_provider_text: 'Se connecter avec {{provider}}', // Use the provided label
                          link_text: 'Vous avez déjà un compte? Connectez-vous', // French translation for 'Already have an account? Sign in'
                          confirmation_text: 'Vérifiez votre e-mail pour le lien de confirmation', // Use the provided label
                        },
                        sign_up: {
                          email_label: 'Votre adresse e-mail', // French translation for 'Email address'
                          password_label: 'Votre mot de passe', // French translation for 'Create a Password'
                          email_input_placeholder: 'Saisissez votre adresse e-mail', // French translation for 'Your email address'
                          password_input_placeholder: 'Saisissez votre mot de passe', // French translation for 'Your password'
                          button_label: "S'inscrire", // French translation for 'Sign up'
                          loading_button_label: 'Inscription en cours...', // French translation for 'Signing up ...'
                          social_provider_text: 'Se connecter avec {{provider}}', // Use the provided label
                          link_text: "Vous n'avez pas de compte? Inscrivez-vous", // French translation for 'Don't have an account? Sign up'
                          confirmation_text: 'Vérifiez votre e-mail pour le lien de confirmation', // French translation for 'Check your email for the confirmation link'
                        },
                        magic_link: {
                          email_label: 'Votre adresse e-mail',
                          password_label: 'Votre mot de passe',
                          email_input_placeholder: 'Saisissez votre adresse e-mail',
                          button_label: 'Envoyer des instructions de réinitialisation de mot de passe',
                          loading_button_label: 'Envoi des instructions de réinitialisation en cours...',
                          link_text: 'Mot de passe oublié?',
                          confirmation_text: 'Vérifiez votre e-mail pour le lien de réinitialisation du mot de passe',
                        },
                        forgotten_password: {
                          password_label: 'Nouveau mot de passe',
                          password_input_placeholder: 'Saisissez votre nouveau mot de passe',
                          button_label: 'Mettre à jour le mot de passe',
                          email_label: 'Adresse e-mail', // French translation for 'Email address'
                          loading_button_label: 'Envoi des instructions de réinitialisation en cours...', // French translation for 'Sending reset instructions ...'
                          link_text: 'Mot de passe oublié?', // French translation for 'Forgot your password?'
                          confirmation_text: 'Vérifiez votre e-mail pour le lien de réinitialisation du mot de passe', // French translation for 'Check your email for the password reset link'
                        },

                        update_password: {
                          email_input_label: 'Adresse e-mail',
                          email_input_placeholder: 'Saisissez votre adresse e-mail',
                          phone_input_label: 'Numéro de téléphone',
                          phone_input_placeholder: 'Saisissez votre numéro de téléphone',
                          token_input_label: 'Jeton',
                          token_input_placeholder: 'Saisissez votre jeton OTP',
                          button_label: 'Vérifier le jeton',
                          loading_button_label: 'Vérification en cours...',
                        },
                      },
                    }}
                  />
                </Box>
              </>
              ) : (
                <Switch>
                  <Route path={`/admin`} component={AdminLayout} />
                  <Redirect from='/' to='/admin' />
                </Switch>
              )}
            </Box>
          </HashRouter>
        </ThemeEditorProvider>
      </React.StrictMode>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
