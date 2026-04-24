import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

const Footer = (props = {}) => {
  return (
    <Box
      as="footer"
      bg={useColorModeValue("white", "gray.700")}
      borderTop="solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      borderWidth={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      color={useColorModeValue("black", "white")}
      textAlign="center"
      {...props}
    >
      &copy; 2010 - {new Date().getFullYear()} NIPEE, a KUKYDOMAIN LDA. Restricted
    </Box>
  );
};

export default Footer;
