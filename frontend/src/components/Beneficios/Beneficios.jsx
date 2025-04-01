import React from "react";
import { Box, Flex, Text, Heading, VStack } from "@chakra-ui/react";

const Beneficios = () => {
  return (
    <Box bg="white" px={{ base: 4, md: 8 }} py={10}>
      <Flex
        maxW="1200px"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="flex-center"
        gap={8}
      >
        {/* Coluna para Empresas */}
        <VStack spacing={6} flex="1" textAlign={{ base: "center", md: "left" }}>
          <Heading
            as="h3"
            size="lg"
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            bgClip="text"
          >
            Benefícios para as Empresas/Instituições
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Por que publicar vagas?
          </Text>

          {/* Benefícios das Empresas */}
          <VStack spacing={4} w="100%">
            <Box
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="semibold"
              maxW="500px"
              w="100%"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Conecte-se com candidatos qualificados
            </Box>
            <Box
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="semibold"
              maxW="500px"
              w="100%"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Divulgue ofertas num portal acessível e dinâmico
            </Box>
            <Box
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="semibold"
              maxW="500px"
              w="100%"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Simplifique o processo de recrutamento através da gestão do processo global da FCT/Estágio via plataforma
            </Box>
          </VStack>
        </VStack>
        
        {/* Coluna para Alunos */}
        <VStack spacing={6} flex="1" textAlign={{ base: "center", md: "left" }}>
          <Heading
            as="h3"
            size="lg"
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            bgClip="text"
          >
            Benefícios para os Candidatos
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Por que se registar?
          </Text>

          {/* Benefícios dos Alunos */}
          <VStack spacing={4} w="100%">
            <Box
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="semibold"
              maxW="500px"
              w="100%"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              A aquisição de conhecimentos e competências inerentes à sua qualificação profissional
            </Box>
            <Box
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="semibold"
              maxW="500px"
              w="100%"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Inscrição simplificada e sem burocracia
            </Box>
            <Box
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="semibold"
              maxW="500px"
              w="100%"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Empresas parceiras em diversos setores
            </Box>
          </VStack>
        </VStack>

      </Flex>
    </Box>
  );
};

export default Beneficios;
