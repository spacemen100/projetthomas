// Chakra Imports
import {
	Flex,
	useColorModeValue,
	Box,
  } from '@chakra-ui/react';
  import PropTypes from 'prop-types';
  import React from 'react';
  import routes from 'routes.js';
  import { SidebarResponsive } from 'components/sidebar/Sidebar';
  
export default function HeaderLinks(props) {
	const shadow = useColorModeValue(
	  '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
	  '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
	);
  
	// Use a constant to determine whether to render the Flex component
	const isSmallScreen = window.innerWidth <= 740;
  
	return (
	  <>
		{isSmallScreen && (
		  <Flex
			maxWidth="40px"
			bg="white"
			w="100%" // Set the width to 100% to fill the available space
			h="100%" // Set the height to 100% to fill the available space
			flexDirection="column" // Center the content vertically
			boxShadow={shadow}
			p="10px"
			borderRadius="10px"
		  >
			<SidebarResponsive routes={routes} />
		  </Flex>
		)}
  
		{/* Optionally, you can render something else for larger screens */}
		{!isSmallScreen && (
		  <Box w={{ sm: 'auto', md: 'auto' }}>
			{/* Content for larger screens */}
		  </Box>
		)}
	  </>
	);
  }
  
  HeaderLinks.propTypes = {
	variant: PropTypes.string,
	fixed: PropTypes.bool,
	secondary: PropTypes.bool,
	onOpen: PropTypes.func,
  };
  