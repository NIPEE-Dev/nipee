import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

import Navbar from "../../components/Navbar/Navbar";
import FormularioRegistro from "../../components/FormularioRegistro/FormularioRegistro";
import BannerConsentimento from "../../components/BannerConsentimento/BannerConsentimento";
import Footer from "../../components/Footer/Footer";

const RegistarEmpresa = () => {
  return (
    <Box bg="#F9FAFB" minH="100vh">
      <Navbar />

      <Box pt={{ base: 28, md: 32 }} pb={{ base: 14, md: 18 }} px={{ base: 4, md: 8 }}>
        <Box maxW="1200px" mx="auto">
          <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 12 }}>
            <Box
              as="h1"
              m={0}
              fontSize={{ base: "34px", md: "48px" }}
              fontWeight="bold"
              lineHeight="1.08"
              color="#172036"
            >
              Registar empresa
            </Box>
            <Text maxW="760px" fontSize={{ base: "16px", md: "18px" }} lineHeight="1.7" color="#52617a">
              Registe a sua empresa para publicar oportunidades, encontrar candidatos qualificados e gerir o processo de forma simples e organizada.
            </Text>
          </VStack>

          <FormularioRegistro
            initialType="empresa"
            lockType
            id="registar-empresa"
          />
        </Box>
      </Box>

      <BannerConsentimento />
      <Footer />
    </Box>
  );
};

export default RegistarEmpresa;
