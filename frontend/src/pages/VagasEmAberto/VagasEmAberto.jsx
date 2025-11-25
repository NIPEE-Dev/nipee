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
  Button,
  Divider,
  Flex,
  useColorModeValue,
  Tag,
  TagLabel,
  TagLeftIcon,
  Skeleton,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaClock, 
  FaEuroSign, 
  FaBus, 
  FaUtensils, 
  FaBriefcase 
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { usePublic } from '../../hooks/usePublic';

const VagasEmAberto = () => {
  const { jobs, loading, errorMessage, fetchJobs } = usePublic();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  const vagasFiltradas = jobs.filter(vaga => {
    const termo = searchTerm.toLowerCase();
    const titulo = vaga.role?.toLowerCase() || "";
    const empresa = vaga.company?.fantasy_name?.toLowerCase() || "";
    const cidade = vaga.company?.address?.city?.toLowerCase() || "";
    
    return titulo.includes(termo) || empresa.includes(termo) || cidade.includes(termo);
  });

  const cardBg = useColorModeValue('white', 'gray.700');
  const dateColor = useColorModeValue('gray.500', 'gray.400');

  const formatTime = (time) => time ? time.substring(0, 5) : "--:--";

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Box bg="white" pt={28} pb={10} px={{ base: 4, md: 8 }} boxShadow="sm">
        <Container maxW="1200px">
          <VStack spacing={4} align="center" textAlign="center">
            <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold">
              Vagas em{" "}
              <Text as="span" bgGradient="linear(to-r, #5931E9, #7289FF)" bgClip="text">
                Aberto
              </Text>
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="800px">
              Encontre a sua próxima oportunidade de FCT ou estágio.
            </Text>

            <InputGroup maxW="600px" mt={6} size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Pesquisar por cargo, empresa ou cidade..."
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
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height="300px" rounded="xl" />)}
            </SimpleGrid>
        ) : (
            <>
                <Text mb={6} fontSize="md" color="gray.500">
                    {vagasFiltradas.length} oportunidades encontradas
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {vagasFiltradas.map((vaga) => (
                    <Box
                      key={vaga.id}
                      bg={cardBg}
                      rounded="xl"
                      boxShadow="md"
                      border="1px solid"
                      borderColor="gray.100"
                      transition="all 0.3s"
                      _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg', borderColor: 'purple.200' }}
                      overflow="hidden"
                      display="flex"
                      flexDirection="column"
                    >
                      <Box p={6} flex="1">
                        <Flex justify="space-between" align="start" mb={4}>
                           <VStack align="start" spacing={1}>
                              <Badge colorScheme="purple" variant="subtle" rounded="md" px={2} fontSize="0.7em">
                                {vaga.type || "Vaga"}
                              </Badge>
                              <Heading size="md" color="gray.800" lineHeight="shorter">
                                {vaga.role || "Oportunidade"}
                              </Heading>
                              <Text fontWeight="medium" color="#5931E9" fontSize="sm">
                                {vaga.company?.fantasy_name || "Empresa Confidencial"}
                              </Text>
                           </VStack>
                           
                           <Text fontSize="xs" color={dateColor} whiteSpace="nowrap">
                             {vaga.created_at ? new Date(vaga.created_at).toLocaleDateString('pt-PT') : ""}
                           </Text>
                        </Flex>

                        <Divider my={3} />

                        <SimpleGrid columns={2} spacing={3} mb={4}>
                            <HStack fontSize="sm" color="gray.600">
                                <Icon as={FaMapMarkerAlt} color="gray.400" />
                                <Text noOfLines={1}>
                                    {vaga.company?.address?.city || "Local a definir"}, {vaga.company?.address?.district || ""}
                                </Text>
                            </HStack>
                            
                            <HStack fontSize="sm" color="gray.600">
                                <Icon as={FaClock} color="gray.400" />
                                <Text>
                                    {formatTime(vaga.working_day?.start_hour)} - {formatTime(vaga.working_day?.end_hour)}
                                </Text>
                            </HStack>

                            {Number(vaga.scholarship_value) > 0 ? (
                                <HStack fontSize="sm" color="green.600" fontWeight="bold">
                                    <Icon as={FaEuroSign} />
                                    <Text>{vaga.scholarship_value} / mês</Text>
                                </HStack>
                            ) : (
                                <HStack fontSize="sm" color="gray.500">
                                    <Icon as={FaBriefcase} />
                                    <Text>Não remunerado</Text>
                                </HStack>
                            )}
                        </SimpleGrid>

                        <Text color="gray.600" fontSize="sm" noOfLines={3} mb={4}>
                            {vaga.description}
                        </Text>
                        
                        <HStack spacing={2} wrap="wrap">
                            {Number(vaga.transport_voucher) === 1 && (
                                <Tag size="sm" variant="outline" colorScheme="blue" borderRadius="full">
                                    <TagLeftIcon boxSize="12px" as={FaBus} />
                                    <TagLabel>Transporte</TagLabel>
                                </Tag>
                            )}
                            {Number(vaga.meal_voucher) > 0 && (
                                <Tag size="sm" variant="outline" colorScheme="orange" borderRadius="full">
                                    <TagLeftIcon boxSize="12px" as={FaUtensils} />
                                    <TagLabel>Refeição</TagLabel>
                                </Tag>
                            )}
                        </HStack>
                      </Box>

                      <Box bg="gray.50" p={4} borderTop="1px solid" borderColor="gray.100">
                        <Button 
                            as="a" 
                            href="/#registrar" 
                            w="full" 
                            bgGradient="linear(to-r, #5931E9, #7289FF)"
                            color="white"
                            _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
                        >
                            Ver Detalhes e Candidatar
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
                
                {!loading && vagasFiltradas.length === 0 && (
                    <VStack py={20} spacing={4}>
                        <Icon as={FaBriefcase} boxSize={16} color="gray.300" />
                        <Text color="gray.500">Nenhuma vaga encontrada para esta pesquisa.</Text>
                    </VStack>
                )}
            </>
        )}
      </Container>

      <Footer borderTop="1px solid" borderColor="gray.200" />
    </Box>
  );
};

export default VagasEmAberto;