import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Container,
  Badge,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  Flex
} from "@chakra-ui/react";
import { FaSearch, FaMapMarkerAlt, FaSchool, FaUniversity } from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { usePublic } from './../../hooks/usePublic';

const EscolasRegistadas = () => {
  const { schools, loading, errorMessage, fetchSchools } = usePublic();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const escolasFiltradas = schools.filter(escola => {
    const termo = searchTerm.toLowerCase();
    const nome = escola.fantasy_name?.toLowerCase() || "";
    const cidade = escola.address?.city?.toLowerCase() || "";
    const distrito = escola.address?.district?.toLowerCase() || "";

    return nome.includes(termo) || cidade.includes(termo) || distrito.includes(termo);
  });

  const cardBg = useColorModeValue('white', 'gray.700');
  const iconBg = useColorModeValue('purple.50', 'whiteAlpha.200');

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Box bg="white" pt={28} pb={10} px={{ base: 4, md: 8 }} boxShadow="sm">
        <Container maxW="1200px">
          <VStack spacing={4} align="center" textAlign="center">
            <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold">
              Escolas{" "}
              <Text as="span" bgGradient="linear(to-r, #5931E9, #7289FF)" bgClip="text">
                Registadas
              </Text>
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="800px">
              Confira a lista de instituições de ensino parceiras.
            </Text>

            <InputGroup maxW="600px" mt={6} size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Pesquisar escola ou cidade..."
                borderRadius="full"
                bg="gray.50"
                _focus={{ bg: "white", borderColor: "#5931E9" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </VStack>
        </Container>
      </Box>

      <Container maxW="1200px" py={12} px={{ base: 4, md: 8 }}>
        
        {errorMessage && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} height="200px" rounded="xl" />)}
            </SimpleGrid>
        ) : (
            <>
                <Text mb={6} fontSize="md" color="gray.500">
                    {escolasFiltradas.length} instituições encontradas
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {escolasFiltradas.map((escola) => (
                    <Box
                        key={escola.id}
                        bg={cardBg}
                        rounded="xl"
                        boxShadow="sm"
                        position="relative"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.100"
                        transition="all 0.3s"
                        _hover={{ 
                            transform: 'translateY(-4px)', 
                            boxShadow: 'md',
                            borderColor: 'purple.200' 
                        }}
                    >
                        <Box h="6px" w="100%" bgGradient="linear(to-r, #5931E9, #7289FF)" />

                        <VStack p={6} align="start" spacing={4}>
                            
                            <Flex w="100%" justify="space-between" align="start">
                                <Flex 
                                    align="center" 
                                    justify="center" 
                                    w={12} 
                                    h={12} 
                                    rounded="lg" 
                                    bg={iconBg}
                                    color="#5931E9"
                                >
                                    <Icon as={FaUniversity} boxSize={6} />
                                </Flex>
                                
                                <Badge colorScheme="purple" variant="subtle" rounded="full" px={2} fontSize="0.7em">
                                    Parceira
                                </Badge>
                            </Flex>

                            <Box w="100%">
                                <Heading as="h3" size="md" lineHeight="tight" mb={2} noOfLines={2}>
                                    {escola.fantasy_name || "Nome não informado"}
                                </Heading>

                                <HStack spacing={2} color="gray.500" fontSize="sm">
                                    <Icon as={FaMapMarkerAlt} color="#5931E9" />
                                    <Text fontWeight="medium">
                                        {escola.address?.city || "Cidade N/A"}, {escola.address?.district || escola.address?.uf}
                                    </Text>
                                </HStack>
                            </Box>

                        </VStack>
                    </Box>
                    ))}
                </SimpleGrid>

                {!loading && escolasFiltradas.length === 0 && (
                    <VStack py={20} spacing={4}>
                        <Icon as={FaSchool} boxSize={16} color="gray.300" />
                        <Text color="gray.500">Nenhuma escola encontrada com esse termo.</Text>
                    </VStack>
                )}
            </>
        )}
      </Container>

      <Footer borderTop="1px solid" borderColor="gray.200" />
    </Box>
  );
};

export default EscolasRegistadas;