import React from "react";
import { Box, Flex, HStack, Icon, Link, Text, VStack } from "@chakra-ui/react";
import { FaEnvelope, FaInstagram, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import logoBranca from "../../../src/images/logoBranca.png";

const quickLinks = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Contacto", href: "/#contato" },
];

const accessLinks = [
  { label: "Para estudantes", href: "/#para-estudantes" },
  { label: "Para empresas", href: "/#para-empresas" },
  { label: "Para escolas", href: "/#para-escolas" },
  { label: "Oportunidades", href: "/vagas-em-aberto" },
];

const FooterHome = () => {
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
              Ligamos escolas, estudantes e empresas, facilitando o acesso à
              Formação em Contexto de Trabalho e ao desenvolvimento profissional
              dos jovens.
            </Text>
          </VStack>

          <VStack align="start" spacing={4}>
            <Text fontSize="16px" fontWeight="bold">
              Links rápidos
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
              Acesso rápido
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
              Contacto
            </Text>
            <HStack color="whiteAlpha.700">
              <Icon as={FaEnvelope} />
              <Text>contacto@nipee.org</Text>
            </HStack>
            <HStack color="whiteAlpha.700">
              <Icon as={FaPhoneAlt} />
              <Text>(+351) 211 309 985</Text>
            </HStack>
            <HStack color="whiteAlpha.700">
              <Icon as={FaWhatsapp} />
              <Text>WhatsApp: (+351) 912 485 534</Text>
            </HStack>
            <HStack pt={2}>
              <Link
                href="https://www.instagram.com/nipee_portugal/"
                target="_blank"
                rel="noopener noreferrer"
                minH="36px"
                px={3}
                borderRadius="full"
                bg="whiteAlpha.100"
                display="flex"
                alignItems="center"
                gap={2}
                justifyContent="center"
                color="white"
                _hover={{ bg: "#155dfc", transform: "translateY(-1px)" }}
                transition="all 0.2s ease"
                aria-label="Instagram"
              >
                <Icon as={FaInstagram} />
                <Text fontSize="14px">nipee_portugal</Text>
              </Link>
            </HStack>
          </VStack>
        </Flex>

        <Text textAlign="center" color="whiteAlpha.700" fontSize="15px" pt={8}>
          &copy; 2026 NIPEE - KUKYDOMAIN LDA. Todos os direitos reservados.
        </Text>
      </Box>
    </Box>
  );
};

export default FooterHome;
