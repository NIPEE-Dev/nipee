import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaBriefcase,
  FaBus,
  FaClock,
  FaEuroSign,
  FaMapMarkerAlt,
  FaSearch,
  FaUtensils,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { usePublic } from "../../hooks/usePublic";
import vagasHero from "../../../src/images/vagas.jpeg";

const VagasEmAberto = () => {
  const { jobs, loading, errorMessage, fetchJobs } = usePublic();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const vagasFiltradas = jobs.filter((vaga) => {
    const termo = searchTerm.toLowerCase();
    const titulo = vaga.role?.toLowerCase() || "";
    const empresa = vaga.company?.fantasy_name?.toLowerCase() || "";
    const cidade = vaga.company?.address?.city?.toLowerCase() || "";

    return (
      titulo.includes(termo) ||
      empresa.includes(termo) ||
      cidade.includes(termo)
    );
  });

  const formatTime = (time) => (time ? time.substring(0, 5) : "--:--");

  return (
    <Box bg="#F9FAFB" minH="100vh">
      <Navbar />

      <Box mt={{ base: 24, md: 28 }} mb={{ base: 10, md: 12 }}>
        <Box
          position="relative"
          overflow="hidden"
          minH={{ base: "420px", md: "500px" }}
          bg="#0f172a"
          color="white"
        >
          <Box
            position="absolute"
            inset="0"
            bgImage={`url(${vagasHero})`}
            bgRepeat="no-repeat"
            bgPosition="center"
            bgSize="cover"
            opacity={0.22}
            transform="scale(1.04)"
          />
          <Box
            position="absolute"
            inset="0"
            bg="linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.8) 38%, rgba(15,23,42,0.65) 100%)"
          />

          <Box
            position="relative"
            maxW="1200px"
            mx="auto"
            px={{ base: 4, md: 8 }}
            py={{ base: 14, md: 20 }}
          >
            <VStack align="start" spacing={6} maxW="760px" textAlign="left">
              <Text
                fontSize="sm"
                fontWeight="bold"
                letterSpacing="0.14em"
                textTransform="uppercase"
                color="whiteAlpha.800"
              >
                Oportunidades abertas
              </Text>

              <Box
                as="h1"
                m={0}
                fontSize={{ base: "38px", md: "58px" }}
                fontWeight="bold"
                lineHeight={{ base: "1.08", md: "1.02" }}
                letterSpacing="-0.03em"
              >
                Encontre a sua proxima oportunidade de FCT ou estagio
              </Box>

              <Text
                fontSize={{ base: "16px", md: "20px" }}
                lineHeight="1.7"
                color="whiteAlpha.900"
                maxW="720px"
              >
                Pesquise por cargo, empresa ou cidade e descubra vagas alinhadas ao seu perfil com um processo mais simples e direto.
              </Text>

              <InputGroup size="lg" maxW="760px">
                <InputLeftElement pointerEvents="none" h="60px">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="text"
                  h="60px"
                  placeholder="Pesquisar por cargo, empresa ou cidade..."
                  borderRadius="full"
                  bg="white"
                  color="#172036"
                  border="none"
                  boxShadow="0 16px 40px rgba(15, 23, 42, 0.16)"
                  _placeholder={{ color: "gray.500" }}
                  _focus={{ boxShadow: "0 0 0 2px #60a5fa" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <HStack
                spacing={3}
                flexWrap="wrap"
                color="whiteAlpha.900"
                fontSize={{ base: "14px", md: "15px" }}
              >
                <Tag bg="whiteAlpha.180" color="white" borderRadius="full" px={4} py={2}>
                  <TagLabel>{jobs.length} vagas publicadas</TagLabel>
                </Tag>
                <Tag bg="whiteAlpha.180" color="white" borderRadius="full" px={4} py={2}>
                  <TagLabel>{vagasFiltradas.length} resultados encontrados</TagLabel>
                </Tag>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} pb={{ base: 14, md: 20 }}>
        {errorMessage && (
          <Alert status="error" mb={6} borderRadius="xl">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="320px" borderRadius="24px" />
            ))}
          </SimpleGrid>
        ) : (
          <>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "start", md: "center" }}
              gap={3}
              mb={8}
            >
              <Box>
                <Text fontSize={{ base: "24px", md: "30px" }} fontWeight="bold" color="#172036">
                  Vagas Disponiveis
                </Text>
                <Text fontSize="16px" color="#52617a" mt={1}>
                  {vagasFiltradas.length} oportunidades encontradas para voce
                </Text>
              </Box>

              {searchTerm && (
                <Button
                  variant="ghost"
                  color="#155dfc"
                  px={0}
                  _hover={{ bg: "transparent", color: "#0f4fd6" }}
                  onClick={() => setSearchTerm("")}
                >
                  Limpar pesquisa
                </Button>
              )}
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {vagasFiltradas.map((vaga) => (
                <Box
                  key={vaga.id}
                  bg="white"
                  borderRadius="24px"
                  border="1px solid #e5e7eb"
                  boxShadow="0 10px 28px rgba(15, 23, 42, 0.06)"
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                  position="relative"
                  transition="transform 0.25s ease, box-shadow 0.25s ease"
                  _hover={{
                    transform: "scale(1.02)",
                    boxShadow: "0 20px 42px rgba(15, 23, 42, 0.12)",
                  }}
                >
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="5px"
                    bg="linear-gradient(90deg, #155dfc 0%, #60a5fa 100%)"
                  />
                  <Box p={{ base: 5, md: 6 }} flex="1">
                    <Flex justify="space-between" align="start" mb={4} gap={4}>
                      <VStack align="start" spacing={2}>
                        <Badge
                          bg="#dbeafe"
                          color="#155dfc"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="12px"
                          textTransform="none"
                        >
                          {vaga.type || "Vaga"}
                        </Badge>

                        <Box
                          as="h2"
                          m={0}
                          fontSize={{ base: "22px", md: "24px" }}
                          fontWeight="bold"
                          lineHeight="1.2"
                          color="#172036"
                        >
                          {vaga.role || "Oportunidade"}
                        </Box>

                        <Text fontWeight="semibold" color="#155dfc" fontSize="15px">
                          {vaga.company?.fantasy_name || "Empresa Confidencial"}
                        </Text>
                      </VStack>

                      <Text
                        fontSize="13px"
                        color="#6b7280"
                        whiteSpace="nowrap"
                      >
                        {vaga.created_at
                          ? new Date(vaga.created_at).toLocaleDateString("pt-PT")
                          : ""}
                      </Text>
                    </Flex>

                    <Divider my={4} borderColor="#edf2f7" />

                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} mb={5}>
                      <HStack fontSize="14px" color="#52617a" align="start">
                        <Icon as={FaMapMarkerAlt} color="#155dfc" mt="2px" />
                        <Text noOfLines={2}>
                          {vaga.company?.address?.city || "Local a definir"}
                          {vaga.company?.address?.district
                            ? `, ${vaga.company.address.district}`
                            : ""}
                        </Text>
                      </HStack>

                      <HStack fontSize="14px" color="#52617a" align="start">
                        <Icon as={FaClock} color="#155dfc" mt="2px" />
                        <Text>
                          {formatTime(vaga.working_day?.start_hour)} -{" "}
                          {formatTime(vaga.working_day?.end_hour)}
                        </Text>
                      </HStack>

                      {Number(vaga.scholarship_value) > 0 ? (
                        <HStack fontSize="14px" color="green.600" fontWeight="bold">
                          <Icon as={FaEuroSign} />
                          <Text>{vaga.scholarship_value} / mes</Text>
                        </HStack>
                      ) : (
                        <HStack fontSize="14px" color="#6b7280">
                          <Icon as={FaBriefcase} color="#155dfc" />
                          <Text>Nao remunerado</Text>
                        </HStack>
                      )}
                    </SimpleGrid>

                    <Text color="#52617a" fontSize="15px" noOfLines={4} mb={5} lineHeight="1.7">
                      {vaga.description}
                    </Text>

                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      justify="space-between"
                      align={{ base: "start", sm: "center" }}
                      gap={3}
                      mb={4}
                      p={4}
                      borderRadius="16px"
                      bg="#f8fafc"
                    >
                      <Box>
                        <Text fontSize="12px" textTransform="uppercase" letterSpacing="0.08em" color="#64748b">
                          Empresa
                        </Text>
                        <Text fontSize="15px" fontWeight="semibold" color="#172036">
                          {vaga.company?.fantasy_name || "Empresa Confidencial"}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="12px" textTransform="uppercase" letterSpacing="0.08em" color="#64748b">
                          Cidade
                        </Text>
                        <Text fontSize="15px" fontWeight="semibold" color="#172036">
                          {vaga.company?.address?.city || "A definir"}
                        </Text>
                      </Box>
                    </Flex>

                    <HStack spacing={2} flexWrap="wrap">
                      {Number(vaga.transport_voucher) === 1 && (
                        <Tag
                          size="md"
                          bg="#eff6ff"
                          color="#155dfc"
                          borderRadius="full"
                          px={3}
                        >
                          <Icon as={FaBus} mr={2} boxSize="12px" />
                          <TagLabel>Transporte</TagLabel>
                        </Tag>
                      )}
                      {Number(vaga.meal_voucher) > 0 && (
                        <Tag
                          size="md"
                          bg="#fff7ed"
                          color="#ea580c"
                          borderRadius="full"
                          px={3}
                        >
                          <Icon as={FaUtensils} mr={2} boxSize="12px" />
                          <TagLabel>Refeicao</TagLabel>
                        </Tag>
                      )}
                    </HStack>
                  </Box>

                  <Box bg="#f8fafc" p={5} borderTop="1px solid #edf2f7">
                    <Button
                      as={RouterLink}
                      to={`/login?redirect=/jobs-candidate/${vaga.id}`}
                      w="full"
                      bg="#155dfc"
                      color="white"
                      borderRadius="full"
                      h="52px"
                      fontWeight="bold"
                      _hover={{ bg: "#0f4fd6", transform: "translateY(-1px)" }}
                      transition="all 0.2s ease"
                    >
                      Ver Detalhes e Candidatar
                    </Button>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>

            {vagasFiltradas.length === 0 && (
              <VStack py={{ base: 16, md: 20 }} spacing={4}>
                <Icon as={FaBriefcase} boxSize={16} color="#cbd5e1" />
                <Text color="#64748b" fontSize="16px">
                  Nenhuma vaga encontrada para esta pesquisa.
                </Text>
              </VStack>
            )}
          </>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default VagasEmAberto;
