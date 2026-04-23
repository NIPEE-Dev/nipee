import React from "react";
import { Box, Flex, HStack, Icon, Link, Text, VStack } from "@chakra-ui/react";
import { FaEnvelope, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import logoBranca from "../../../src/images/logoBranca.png";

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Sobre Nos", href: "/#sobre" },
  { label: "Como Funciona", href: "/#como-funciona" },
  { label: "Contato", href: "/#contato" },
];

const accessLinks = [
  { label: "Para Estudantes", href: "/#para-estudantes" },
  { label: "Para Empresas", href: "/#para-empresas" },
  { label: "Para Escolas", href: "/#para-escolas" },
  { label: "Vagas Disponiveis", href: "/vagas-em-aberto" },
];

const Footer = () => {
  return (
    <Box as="footer" bg="#0f172a" color="white" px={{ base: 6, md: 8 }} py={12}>
      <Box maxW="1200px" mx="auto">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="start"
          gap={{ base: 10, md: 12 }}
          pb={10}
          borderBottom="1px solid rgba(255,255,255,0.1)"
        >
          <VStack align="start" spacing={4} maxW="300px">
            <Box
              as="img"
              src={logoBranca}
              alt="Logo branca NIPEE"
              w={{ base: "180px", md: "210px" }}
              h="auto"
            />
            <Text color="whiteAlpha.700" fontSize="16px" lineHeight="1.7">
              Transformando vidas atraves da educacao de qualidade e
              desenvolvimento integral de jovens.
            </Text>
          </VStack>

          <VStack align="start" spacing={4}>
            <Text fontSize="16px" fontWeight="bold">
              Links Rapidos
            </Text>
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                color="whiteAlpha.700"
                _hover={{ color: "white" }}
              >
                {item.label}
              </Link>
            ))}
          </VStack>

          <VStack align="start" spacing={4}>
            <Text fontSize="16px" fontWeight="bold">
              Acesso Rapido
            </Text>
            {accessLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                color="whiteAlpha.700"
                _hover={{ color: "white" }}
              >
                {item.label}
              </Link>
            ))}
          </VStack>

          <VStack align="start" spacing={4}>
            <Text fontSize="16px" fontWeight="bold">
              Contato
            </Text>
            <HStack color="whiteAlpha.700">
              <Icon as={FaEnvelope} />
              <Text>contacto@nipee.org</Text>
            </HStack>
            <HStack color="whiteAlpha.700">
              <Icon as={FaPhoneAlt} />
              <Text>(11) 1234-5678</Text>
            </HStack>
            <HStack pt={2}>
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                w="36px"
                h="36px"
                borderRadius="full"
                bg="whiteAlpha.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                _hover={{ bg: "#155dfc", transform: "translateY(-1px)" }}
                transition="all 0.2s ease"
                aria-label="Instagram"
              >
                <Icon as={FaInstagram} />
              </Link>
            </HStack>
          </VStack>
        </Flex>

        <Text textAlign="center" color="whiteAlpha.700" fontSize="15px" pt={8}>
          © 2010 - 2026 NIPEE, a KUKYDOMAIN LDA. Restricted
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
