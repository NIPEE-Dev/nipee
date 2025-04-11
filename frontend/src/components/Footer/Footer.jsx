import React from 'react';
import { Box, useColorModeValue } from "@chakra-ui/react";

let current_year = new Date().getFullYear();

const Footer = (props = {}) => {
    return (
        <Box as="footer" 
        bg={useColorModeValue('white', 'gray.900')}
        borderRadius={5}
        borderTop={'solid'}
        borderColor={useColorModeValue('gray.100', 'gray.700')}
        borderWidth={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        color={useColorModeValue('black', 'white')}
        textAlign="center"
        {...props}>
            &copy; 2010 - {current_year} NIPEE, a KUKYDOMAIN LDA. Restricted
        </Box>
    )
}
    
export default Footer;