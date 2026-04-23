import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaSchool, FaSearch, FaUniversity } from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { usePublic } from "../../hooks/usePublic";
import escolasHero from "../../../src/images/escolas.jpg";

const EscolasRegistadas = () => {
  const { schools, loading, errorMessage, fetchSchools } = usePublic();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const escolasFiltradas = schools.filter((escola) => {
    const termo = searchTerm.toLowerCase();
    const nome = escola.fantasy_name?.toLowerCase() || "";
    const cidade = escola.address?.city?.toLowerCase() || "";
    const distrito = escola.address?.district?.toLowerCase() || "";

    return (
      nome.includes(termo) ||
      cidade.includes(termo) ||
      distrito.includes(termo)
    );
  });

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
            bgImage={`url(${escolasHero})`}
            bgRepeat="no-repeat"
            bgPosition="center"
            bgSize="cover"
            opacity={0.2}
            transform="scale(1.03)"
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
                Rede de escolas
              </Text>

              <Box
                as="h1"
                m={0}
                fontSize={{ base: "38px", md: "58px" }}
                fontWeight="bold"
                lineHeight={{ base: "1.08", md: "1.02" }}
                letterSpacing="-0.03em"
              >
                Escolas registadas e prontas para gerar oportunidades
              </Box>

              <Text
                fontSize={{ base: "16px", md: "20px" }}
                lineHeight="1.7"
                color="whiteAlpha.900"
                maxW="720px"
              >
                Conheca as instituicoes de ensino parceiras que conectam estudantes a experiencias reais de estagio e desenvolvimento profissional.
              </Text>

              <InputGroup size="lg" maxW="760px">
                <InputLeftElement pointerEvents="none" h="60px">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="text"
                  h="60px"
                  placeholder="Pesquisar escola, cidade ou distrito..."
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

              <HStack spacing={3} flexWrap="wrap">
                <Tag bg="whiteAlpha.180" color="white" borderRadius="full" px={4} py={2}>
                  <TagLabel>{schools.length} escolas parceiras</TagLabel>
                </Tag>
                <Tag bg="whiteAlpha.180" color="white" borderRadius="full" px={4} py={2}>
                  <TagLabel>{escolasFiltradas.length} resultados encontrados</TagLabel>
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
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height="260px" borderRadius="24px" />
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
                  Instituicoes Parceiras
                </Text>
                <Text fontSize="16px" color="#52617a" mt={1}>
                  {escolasFiltradas.length} instituicoes encontradas
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

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {escolasFiltradas.map((escola) => (
                <Box
                  key={escola.id}
                  bg="white"
                  borderRadius="24px"
                  border="1px solid #e5e7eb"
                  boxShadow="0 10px 28px rgba(15, 23, 42, 0.06)"
                  overflow="hidden"
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

                  <VStack p={{ base: 5, md: 6 }} align="start" spacing={5}>
                    <Flex w="100%" justify="space-between" align="start" gap={4}>
                      <Flex
                        align="center"
                        justify="center"
                        w="52px"
                        h="52px"
                        borderRadius="18px"
                        bg="#dbeafe"
                        color="#155dfc"
                      >
                        <Icon as={FaUniversity} boxSize={6} />
                      </Flex>

                      <Badge
                        bg="#eff6ff"
                        color="#155dfc"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="12px"
                        textTransform="none"
                      >
                        Parceira
                      </Badge>
                    </Flex>

                    <Box w="100%">
                      <Box
                        as="h2"
                        m={0}
                        mb={2}
                        fontSize={{ base: "22px", md: "24px" }}
                        fontWeight="bold"
                        lineHeight="1.2"
                        color="#172036"
                      >
                        {escola.fantasy_name || "Nome nao informado"}
                      </Box>

                      <HStack spacing={2} color="#52617a" fontSize="15px" align="start">
                        <Icon as={FaMapMarkerAlt} color="#155dfc" mt="2px" />
                        <Text fontWeight="medium">
                          {escola.address?.city || "Cidade N/A"}
                          {escola.address?.district
                            ? `, ${escola.address.district}`
                            : escola.address?.uf
                              ? `, ${escola.address.uf}`
                              : ""}
                        </Text>
                      </HStack>
                    </Box>

                    <Box
                      w="100%"
                      bg="#f8fafc"
                      borderRadius="16px"
                      px={4}
                      py={4}
                    >
                      <Text fontSize="12px" textTransform="uppercase" letterSpacing="0.08em" color="#64748b" mb={1}>
                        Status
                      </Text>
                      <Text fontSize="15px" fontWeight="semibold" color="#172036">
                        Escola integrada na rede NIPEE
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>

            {escolasFiltradas.length === 0 && (
              <VStack py={{ base: 16, md: 20 }} spacing={4}>
                <Icon as={FaSchool} boxSize={16} color="#cbd5e1" />
                <Text color="#64748b" fontSize="16px">
                  Nenhuma escola encontrada com esse termo.
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

export default EscolasRegistadas;
