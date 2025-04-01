import React, { useEffect, useState } from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";

const BannerConsentimento = () => {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("termosAceitos");
    if (consent === "true") {
      setIsAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("termosAceitos", "true");
    setIsAccepted(true);
  };

  const handleReject = () => {
    setIsAccepted(true); 
  };

  if (isAccepted) return null;

  return (
    <Box
      position="fixed"
      bottom={0}
      w="95%"
      bgGradient="linear(to-r, #5931E9, #7289FF)"
      color="white"
      py={4}
      px={6}
      boxShadow="lg"
      zIndex={1000}
    >
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
      >
        <Text
          fontSize={{ base: "sm", md: "md" }}
          textAlign="center"
          mb={{ base: 2, md: 0 }}
        >
          Este site utiliza cookies para melhorar a sua experiência. Ao
          continuar navegando, você concorda com os nossos{" "}
          <a
            href="/termos-condicoes-uso"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
              color: "#FFFBEA",
            }}
          >
            Termos e Condições de Uso
          </a>
          .
        </Text>
        <Flex gap={2}>
          <Button
            onClick={handleAccept}
            bg="white"
            color="#5931E9"
            fontWeight="bold"
            _hover={{
              bgGradient: "linear(to-r, #7289FF, #5931E9)",
              color: "white",
            }}
            size="sm"
          >
            Aceitar
          </Button>
          <Button
            onClick={handleReject}
            bg="white"
            color="#5931E9"
            fontWeight="bold"
            _hover={{
              bgGradient: "linear(to-r, #7289FF, #5931E9)",
              color: "white",
            }}
            size="sm"
          >
            Rejeitar
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default BannerConsentimento;
