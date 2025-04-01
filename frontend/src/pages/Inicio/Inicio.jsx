import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  VStack,
  HStack,
  Stack
} from "@chakra-ui/react";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import illustation from "../../../src/images/img.png";
import illustation2 from "../../../src/images/img2.png";
import qrcode from "../../../src/images/qr-code.png";
import Navbar from "../../components/Navbar/Navbar";
import Beneficios from "../../components/Beneficios/Beneficios";
import FormularioRegistro from "../../components/FormularioRegistro/FormularioRegistro";
import FormularioContato from "../../components/FormularioContato/FormularioContato";
import BannerConsentimento from "../../components/BannerConsentimento/BannerConsentimento";

const Inicio = () => {
  return (
    <Box bg="white" px={{ base: 4, md: 8 }}>
      <Navbar />

      {/* Seção principal */}
      <Flex
        maxW="1200px"
        mx="auto"
        align="center"
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        py={10}
        mt={20}
      >
        <VStack
          align={{ base: "center", md: "start" }}
          spacing={6}
          flex="1"
          textAlign={{ base: "center", md: "left" }}
        >
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "5xl" }}
            fontWeight="bold"
            lineHeight="1.2"
          >
            <Text
              as="span"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              bgClip="text"
            >
              Menos
            </Text>{" "}
            burocracia,
            <br />
            <Text
              as="span"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              bgClip="text"
            >
              Mais
            </Text>{" "}
            opções de FCT/Estágio
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Conectamos alunos, escolas e empresas, promovendo a Formação em Contexto de Trabalho e simplificando a gestão através da informatização e sistematização dos processos.
          </Text>
        </VStack>

        <Box
          flex="1"
          mt={{ base: 8, md: 0 }}
          textAlign="center"
          ml={{ base: 0, md: 10 }}
        >
          <img
            src={illustation}
            alt="Ilustração de gestão de estágios"
            style={{
              maxWidth: "100%",
              width: "400px",
              margin: "0 auto",
            }}
          />
        </Box>
      </Flex>

      {/* Seção "Sobre nós" */}
      <Flex
        id="sobre"
        maxW="1200px"
        mx="auto"
        align="center"
        direction={{ base: "column-reverse", md: "row" }} 
        justifyContent="space-between"
        py={10}
      >
        <Box
          flex="1"
          mt={{ base: 8, md: 0 }}
          textAlign="center"
          mr={{ base: 0, md: 10 }}
        >
          <img
            src={illustation2}
            alt="Ilustração de gestão de estágios"
            style={{
              maxWidth: "100%",
              width: "400px",
            }}
          />
        </Box>

        <VStack
          align={{ base: "center", md: "start" }}
          spacing={6}
          flex="1"
          textAlign={{ base: "center", md: "left" }}
        >
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            lineHeight="1.2"
          >
            <Text as="span" bgGradient="linear(to-r, #5931E9, #7289FF)" bgClip="text">
              Sobre nós
            </Text>
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            A nossa empresa tem como missão facilitar a ligação entre as escolas, as empresas e os alunos formandos, promovendo oportunidades de Formação em Contexto de Trabalho. Temos como valores, a simplicidade, inovação, fiabilidade e acessibilidade. Pretendemos ser a principal plataforma de gestão de estágios em Portugal.
          </Text>
        </VStack>
      </Flex>

      <Beneficios />

      <FormularioRegistro />

      <Flex
        maxW="800px"
        mx="auto"
        align="center"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
        wrap="wrap"
        gap={{ base: 6, md: 8 }}
        py={10}
        >

        <VStack align="start" spacing={4} flex="1" w="100%" mb={{ base: 6, md: 0 }}>
            <Heading as="h3" size="lg" color="#5931E9" textAlign={{ base: "center", md: "left" }}>
            Ficou com alguma dúvida?
            </Heading>
            <Text textAlign={{ base: "center", md: "left" }}>
            Entre em contacto connosco ou envie-nos todas as suas dúvidas através do seu canal preferido!
            </Text>
            <Stack  w="100%" flexWrap="wrap">
            <Button
                leftIcon={<Icon as={FaPhoneAlt} />}
                bgGradient="linear(to-r, #5931E9, #7289FF)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
                size="lg"
                mb={4}
                w={{ base: "100%", md: "auto" }}
            >
                211 309 985
            </Button>
            <Button
                leftIcon={<Icon as={FaPhoneAlt} />}
                bgGradient="linear(to-r, #5931E9, #7289FF)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
                size="lg"
                w={{ base: "100%", md: "auto" }}
            >
                912 485 534
            </Button>
            </Stack>
            <Button
            leftIcon={<Icon as={FaEnvelope} />}
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
            size="lg"
            w="100%"
            >
            contacto@nipee.org
            </Button>
        </VStack>

        <Flex direction="column" align="center" flex="1" textAlign="center">
            <Box
            as="img"
            src={qrcode}
            alt="QR Code"
            boxSize={{ base: "150px", md: "200px" }}
            mb={4}
            />
            <Button
            as="a"
            href="https://wa.chatfuel.com/nipee"
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<Icon as={FaWhatsapp} />}
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
            size="lg"
            px={8}
            py={{ base: 6, md: 8 }}
            mt={4}
            w={{ base: "100%", md: "auto" }}
            >
            WhatsApp
            </Button>
        </Flex>
        </Flex>

        <FormularioContato />

        <BannerConsentimento/>
        
    </Box>
  );
};

export default Inicio;
