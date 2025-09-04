import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import useUploadSignature from "../../hooks/useUploadSignature";
import {
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormErrorMessage,
  Button,
  useColorMode,
  useColorModeValue,
  Flex,
  // toast,
  Box,
} from "@chakra-ui/react";
import api from "../../api";

function SignaturePad({ documentId, onSuccess }) {
  const [nif, setNif] = useState(0);
  const [url, setUrl] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const signRef = useRef(null);
  const { uploadSignature, loading, error, successMessage } =
    useUploadSignature();
  const navigate = useNavigate();
  const toast = useToast();

  const userProfile = JSON.parse(localStorage.getItem("profile"));
  const userRole = userProfile?.role || "";
  const type =
    userRole === "Empresa" ? "empresa" : userRole === "Escola" ? "escola" : "";
  const contractId = documentId;

  useEffect(() => {
    const fetchNif = async () => {
      try {
        const response = await api.get("/nif");
        setNif(response.data.nif);
      } catch (e) {
        console.error("Erro ao buscar NIF:", e);
      }
    };
    fetchNif();
  }, []);

  const handleClear = () => {
    if (signRef.current) signRef.current.clear();
    setUrl("");
  };

  const handleAttemptSubmit = () => {
    if (!signRef.current || signRef.current.isEmpty()) {
      toast({
        title: "Erro!",
        description: "Por favor, faça a sua assinatura antes de enviar.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    const imageData = signRef.current.getTrimmedCanvas().toDataURL("image/png");
    setUrl(imageData);
    try {
      const result = await uploadSignature(contractId, imageData, type);

      toast({
        title: "Sucesso!",
        description:
          result?.data?.message || "O protocolo foi assinado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (onSuccess) {
        onSuccess();
      }
      e;
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Erro ao enviar a assinatura:", err);
      toast({
        title: "Erro!",
        description: error || "Ocorreu um erro ao assinar o protocolo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <Box alignItems={"center"} justifyContent="center" textAlign="center" p={4}>
      <Text mb={4}>
        Faça a sua assinatura. A assinatura realizada aqui será adicionada ao
        protocolo.
      </Text>

      <Box
        border="2px solid"
        w={500}
        h={200}
        mx="auto"
        backgroundColor="white"
        color="black"
      >
        <SignatureCanvas
          canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
          ref={signRef}
        />
        <Flex mt={4} wrap="wrap" justifyContent="center" textAlign="center">
          <Button
            variant="outline"
            colorScheme="gray"
            px={6}
            py={3}
            onClick={handleClear}
            mr={4}
          >
            Limpar
          </Button>
          <Button
            fontWeight="bold"
            bgGradient="linear(to-r, #5931E9, #7289FF)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
            py={3}
            onClick={handleAttemptSubmit}
            loadingText="Enviando..."
          >
            Assinar
          </Button>
        </Flex>
      </Box>

      <br />
      <br />
      {loading && (
        <Text style={{ paddingTop: "1rem" }}>Enviando assinatura...</Text>
      )}
      {successMessage && (
        <p style={{ color: "green", paddingTop: "1rem" }}>{successMessage}</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Modal isOpen={showConfirm} onClose={handleCancel} isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bgGradient="linear(to-r, #5931E9, #7289FF)"
          color="white"
          borderRadius="lg"
          boxShadow="2xl"
          overflow="hidden"
          transform="scale(1.05)"
          transition="all 0.3s ease-in-out"
          mx={4}
        >
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="white"
            mt={4}
          >
            Declaração de Aceitação
          </ModalHeader>
          <ModalBody textAlign="center" py={2} px={8}>
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
              mb={4}
            >
              <Text as="p">
                Eu, {userProfile.username}, titular do NIF {nif}, declaro que li
                e compreendi todos os termos e condições apresentados, e
                concordo com os mesmos.
              </Text>
            </Box>
            <Box
              bg="whiteAlpha.200"
              p={3}
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text as="p">
                Ao assinar digitalmente este documento, manifesto a minha
                aceitação plena e consciente, conferindo-lhe validade legal para
                todos os efeitos.
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center" pb={4}>
            <Button
              fontWeight="bold"
              bgGradient="linear(to-r, #E53935, #FF6F61)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, #FF6F61, #E53935)" }}
              py={3}
              mr={4}
              onClick={handleCancel}
              loadingText="Cancelando..."
            >
              Cancelar
            </Button>
            <Button
              fontWeight="bold"
              bgGradient="linear(to-r, #5931E9, #7289FF)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, #7289FF, #5931E9)" }}
              py={3}
              onClick={handleConfirm}
              loadingText="Enviando..."
            >
              Aceitar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SignaturePad;
